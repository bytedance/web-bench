// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {
  AgentRequest,
  IAgent,
  ITaskRunner,
  Task,
  TaskResultSnippet,
} from '@web-bench/evaluator-types'
import chalk from 'chalk'
import { diff } from 'string-diff-viewer'
import path from 'node:path'

import { clearErrorMsg } from '../../utils/error'
import { getOrdinalNumberAbbreviation } from '../../utils/report'
import { ProjectRunner } from '../project-runner'
import { sum } from 'lodash'

export class DefaultTaskRunner implements ITaskRunner {
  public type: AgentRequest['type'] = 'normal'

  public task: Task

  public project: ProjectRunner

  public agent: IAgent

  public executeInfo?: ITaskRunner['executeInfo'] | undefined

  public constructor(task: Task, project: ProjectRunner) {
    this.task = task
    this.agent = project.agent
    this.project = project
  }

  public async run(): Promise<boolean> {
    const { logger } = this.project

    const retry = this.project.settings.retry

    const result: TaskResultSnippet[] = []

    const beforeErrors: string[] = []

    // 2. Iterate through tasks
    for (let times = 0; times < retry; times++) {
      const { settings, pluginSchedule } = this.project

      this.executeInfo = { times }

      let request = '{}'

      const taskBegin = +new Date()

      let response: Record<string, string> = {}

      let inputTokens = 0
      let outputTokens = 0

      let trajectory;

      const description = this.task.description

      logger.info(
        `${chalk.blue.bold(this.task.id)} ${getOrdinalNumberAbbreviation(times + 1)} Attempt Started:\n${chalk.gray(description)}`
      )

      logger.debug(`Get in the context`)

      let error = ''
      let screenshotPath = ''

      let requestBegin = 0
      let requestEnd = 0

      let testBegin = 0
      let testEnd = 0

      try {
        if (times) {
          await pluginSchedule.run('onTaskRetry', { project: this.project })
        }

        await pluginSchedule.run('onTaskStart', {
          project: this.project,
          task: this.task,
          times,
        })

        // Get context
        const files = await pluginSchedule.run(
          'onTaskContextCollect',
          { task: this.task, project: this.project },
          {}
        )

        logger.debug(`Get the context`)

        // 3. Request agent to return results

        const agentRequest = {
          files,
          type: this.type,
          task: this.task.description,
          error: beforeErrors.pop(),
        }

        requestBegin = +new Date()

        logger.silentLog(`Request`, JSON.stringify(agentRequest))

        request = JSON.stringify(agentRequest)

        logger.debug(`Request files`, Object.keys(files))

        const agentRes = await pluginSchedule.run(
          'onTaskCallAgent',
          {
            request: agentRequest,
            response: undefined,
            project: this.project,
          },
          { files: {} }
        )

        requestEnd = +new Date()

        response = agentRes?.files || ''
        inputTokens = agentRes.inputTokens || 0
        outputTokens = agentRes.outputTokens || 0
        trajectory = agentRes.trajectory
        logger.silentLog(`Request - response`, JSON.stringify(response))

        logger.debug(`The file is writing...`)

        for (const [file, fileContent] of Object.entries(agentRes.files)) {
          const oldFileContent = agentRequest.files[file]
          if (fileContent !== oldFileContent) {
            if (settings.fileDiffLog) {
              logger.debug(
                '\n' +
                  (await diff(oldFileContent ?? '', fileContent, {
                    language: getLanguageFromPath(file),
                    displayFilename: file,
                  }))
              )
            }
         
          }
        }

        // 4. Write files back

        await pluginSchedule.run('onTaskRewriteFiles', {
          task: this.task,
          files: response,
          project: this.project,
          times,
        })

        logger.debug(`The file has be written.`)

        logger.debug(`The file screenshots...`)

        // 5. Initialize file runtime environment

        if (settings.needInit) {
          await pluginSchedule.run('onTaskInitEnv', {
            task: this.task,
            project: this.project,
          })
        }

        // 6. Build verification

        if (settings.needBuild) {
          const buildResult = await pluginSchedule.run('onTaskBuild', {
            task: this.task,
            project: this.project,
          })

          if (buildResult) {
            throw new Error(buildResult)
          }
        }

        // Generate screenshot
        if (!settings.notScreenshot) {
          screenshotPath = this.task.id + '-' + (times + 1) + '.png'

          await pluginSchedule.run('onTaskScreenshot', {
            task: this.task,
            project: this.project,
            screenshotPath,
          })

          logger.debug(`The file is finish screenshot.`)
        }

        testBegin = +new Date()

        // 7. Call test cases
        const originTestResult = await pluginSchedule.run('onTaskTest', {
          task: this.task,
          project: this.project,
          times,
        })

        if (originTestResult) {
          const testResult = clearErrorMsg(originTestResult!, [
            settings.testDir,
            settings.projectDir,
            settings.testUtilDir,
            settings.repositoryDir,
            'src/',
          ])
          error = `An error occurred during the execution of the unit test. \n${testResult}`
          if (testResult) {
            beforeErrors.push(testResult)
          }
          logger.debug('Execute error: ', error)
        }

        testEnd = +new Date()
      } catch (e: unknown) {
        let msg = ''
        if (typeof e === 'string') {
          msg = e
        } else if (e instanceof Error) {
          msg = e.message // works, `e` narrowed to Error
        }
        error = msg || 'unknown error'
        beforeErrors.push(msg)
        logger.debug('Execute error: ', error, e)

        if (requestBegin && !requestEnd) {
          requestEnd = +new Date()
        }
        if (testBegin && !testEnd) {
          testEnd = +new Date()
        }

        console.error(e)
      }

      const snippet = {
        success: !error,
        errorMessage: error,
        request,
        screenshot: screenshotPath,
        response,
        inputTokens,
        outputTokens,
        trajectory,
      }

      // Execution time, request time + test time, whether successful (request / test), reason for failure

      const taskEnd = +new Date()

      logger.info(
        [
          `${chalk.blue.bold(this.task.id)} ${getOrdinalNumberAbbreviation(times + 1)} Attempt ${error ? '❌' : '✅'}:`,
          `Task ${chalk.green((taskEnd - taskBegin) / 1000 + 's')}`,
          `Request ${chalk.green((requestEnd - requestBegin) / 1000 + 's')}`,
          `Test ${chalk.green((testEnd - testBegin) / 1000 + 's')}`,
        ].join(' ')
      )

      result.push(snippet)

      await pluginSchedule.run('onTaskEnd', {
        project: this.project,
        task: this.task,
        times,
        result: snippet,
        index: this.project.tasks.findIndex((t) => t.task.id === this.task.id),
      })

      if (!error) {
        break
      }
    }

    // Store current run log
    this.project.addTaskSnippet({
      id: this.task.id,
      description: this.task.description,
      result,
      inputTokens: sum(result.map(_task => _task.inputTokens || 0)),
      outputTokens: sum(result.map(_task => _task.outputTokens || 0)),
    })

    // As long as there is a successful run, it is considered a complete successful run
    return result.some((v) => v.success)
  }
}

function getLanguageFromPath(filePath: string) {
  const extname = path.extname(filePath)

  const map: Record<string, string> = {
    '.js': 'js',
    '.ts': 'ts',
    '.mts': 'ts',
    '.mjs': 'js',
    '.cjs': 'js',
    '.css': 'css',
    '.less': 'less',
    '.scss': 'scss',
    '.sass': 'sass',
    '.json': 'json',
    '.md': 'markdown',
    '.html': 'html',
  }

  return map[extname] ?? 'text'
}
