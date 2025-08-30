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

import { AgentEvent, EvalPlugin, IProjectRunner, Task } from '@web-bench/evaluator-types'
import { EvalPluginPrefix } from '../../common'
import fs from 'promise-fs'
import path from 'path'
import { groupProjectsList } from '../../../utils/array'
import { EvaluationReport, ProjectReporter } from '../../utils/report'
import { formatEndpoint, formatModelName } from '../../../utils/format'
import stripAnsi from 'strip-ansi'
import fse from 'fs-extra'
import { getOrdinalNumberAbbreviation } from '../../../utils/report'
import { isJSONString, TesterFactory } from '../../utils'

const getReportName = (project: IProjectRunner) => {
  const { name, model } = project.settings

  const { endpoint } = project.agent

  const names = [name, formatModelName(model)]

  if (endpoint) {
    names.push(formatEndpoint(endpoint))
  }
  names.push(project.hash)

  return names.filter(Boolean).join('-')
}

const getReportDir = (project: IProjectRunner) => {
  const evalPath = path.join(project.settings.agentDir, 'report', 'eval-' + project.hash)

  return path.join(evalPath, project.settings.name, getReportName(project))
}

export const ReportPlugin: EvalPlugin[] = [
  {
    name: EvalPluginPrefix + 'evaluator_report',
    enforce: 'pre',
    onEvalStart: async ({ config, hash }) => {
      const { agentDir } = config
      /**
       * ├─ report
       * │ ├─ eval-202411012-194041
       * │ │ ├─ eval.report.md
       * │ │ ├─ proj1
       * │ │ │ ├─ proj1.report.md
       * │ │ │ ├─ proj1-model1-202411012-194041 // for zip
       * │ │ │ │ ├─ proj1-model1.report.md
       * │ │ │ │ ├─ cli.log
       * │ │ │ │ ├─ ...others
       * │ │ │ ├─ proj1-model2-202411012-194041
       * │ │ │ │ ├─ proj1-model1.report.md
       * │ │ │ │ ├─ cli.log
       * │ │ │ │ ├─ ...others
       * │ │ ├─ proj2
       */
      // 1. Create report folder
      await fs.mkdir(path.join(agentDir!, 'report'), {
        recursive: true,
      })

      const reportBase = path.join(agentDir!, 'report', `eval-${hash}`)

      // 2. Create eval-hash folder for this execution
      await fs.mkdir(reportBase, {
        recursive: true,
      })
    },

    onEvalEnd: async ({ projects, config, agents, hash }) => {
      const reportBase = path.join(config.agentDir!, 'report', `eval-${hash}`)

      // 4. Generate project-level report
      const projects2DList: IProjectRunner[][] = groupProjectsList(
        projects,
        config.projects!,
        agents
      )
      const report = new EvaluationReport()

      await Promise.all(
        projects2DList.map(async (projects) => {
          const content = report.getProjectReportContent({ projects, evalConfig: config })

          const name = projects[0].settings.name

          const projectReportPath = path.join(reportBase, name, `${name}-${hash}.report.md`)

          await fs.writeFile(projectReportPath, content, {
            encoding: 'utf-8',
          })
        })
      )

      // 5. Generate eval-level report
      const content = report.getEvaluationReportContent({
        projectsList: projects2DList,
        evalConfig: config,
      })

      await fs.writeFile(path.join(reportBase, `Evaluation-${hash}.report.md`), content, {
        encoding: 'utf-8',
      })

      // 6. Copy a complete report to the project eval directory
      for (const project of projects) {
        if (await fse.pathExists(project.settings.evalRootDir)) {
          await fse.copy(reportBase, path.join(project.settings.evalRootDir, 'report'))
        }
      }
    },
  },
  {
    name: EvalPluginPrefix + 'project_report',
    enforce: 'pre',
    onProjectStart: async ({ project, hash }) => {
      const evalPath = path.join(project.settings.agentDir, 'report', 'eval-' + hash)

      // 1. Create project folder under eval-hash
      await fs.mkdir(path.join(evalPath, project.settings.name), {
        recursive: true,
      })

      // 2. Create folder for current project report
      const reportDir = getReportDir(project)

      await fs.mkdir(reportDir, {
        recursive: true,
      })

      const reporter = new ProjectReporter()

      // 4. Generate initial report
      const templeReport = reporter.getTempleReportInitContent({
        model: project.settings.model,
        allTaskCount: project.tasks.length,
        endpoint: project.settings.endpoint,
        projectName: project.settings.name,
      })

      const reportPath = path.join(reportDir, getReportName(project) + '.report.md')

      await fs.appendFile(reportPath, templeReport, {
        encoding: 'utf-8',
      })
    },

    onProjectEnd: async ({ project }) => {
      const allTaskCount = project.settings.taskCount
      const taskInfo = new Map<string, Task>()

      project.tasks.forEach((task) => taskInfo.set(task.task.id, task.task))
      const taskSnippetsWithoutInit = project.taskSnippets.filter((taskSnippet) => {
        return !taskInfo.get(taskSnippet.id)?.isInit
      })

      project.logger.silentLog(
        'taskSnippets',
        project.taskSnippets.length,
        taskSnippetsWithoutInit.length,
        JSON.stringify(project.taskSnippets)
      )

      const reporter = new ProjectReporter()

      const context = reporter.getModelReportContent({
        allTaskCount,
        taskSnippetsWithoutInit,
        model: project.settings.model,
        taskSnippets: project.taskSnippets,
        endpoint: project.agent.endpoint,
        retry: project.settings.retry,
        projectName: project.settings.name,
      })

      const reportDir = getReportDir(project)

      const reportPath = path.join(reportDir, getReportName(project) + '.report.md')
      const logPath = path.join(reportDir, 'dev.log')
      await fs.unlink(reportPath)
      await fs.appendFile(reportPath, context, {
        encoding: 'utf-8',
      })
      project.logger.info('The report was generated successfully. The file path is ', reportPath)
      // Write log history directly to avoid RangeError
      const logHistory = project.logger.getHistory()
      for (const log of logHistory) {
        await fs.appendFile(logPath, stripAnsi(log) + '\n', {
          encoding: 'utf-8',
        })
      }
      project.logger.clearHistory()
    },

    onTaskScreenshot: async ({ task, project, screenshotPath }) => {
      const tester = TesterFactory.createTester(project.settings.tester, project)

      await tester.screenshot?.(
        path.join(getReportDir(project), screenshotPath),
        task,
        project.settings
      )
    },

    onTaskEnd: async ({ project, task, result, index }) => {
      // Generate temporary report
      const evalPath = path.join(project.settings.agentDir, 'report', 'eval-' + project.hash)

      const reportDir = path.join(evalPath, project.settings.name, getReportName(project))

      const reporter = new ProjectReporter()
      reporter.reportTaskSnippet({
        id: task.id,
        reportDir,
        reportName: getReportName(project),
        description: task.description,
        result,
        index,
      })
    },
  },
  {
    name: EvalPluginPrefix + 'agent_request_report',
    onProjectStart: async ({ project }) => {
      const reportDir = getReportDir(project)

      const listener = (request: string, response: string) => {
        fs.appendFile(
          path.join(reportDir, 'agent-request.md'),
          [
            `# ${project.currentTask?.task.id} ${getOrdinalNumberAbbreviation(project.currentTask?.executeInfo?.times || 0 + 1)} Attempt`,
            '## Request',
            '```json\n' + JSON.stringify(JSON.parse(request || '{}'), null, 2) + '\n```\n',
            '## Response',
            isJSONString(response) ? '```json\n' + JSON.stringify(JSON.parse(response || '{}'), null, 2) + '\n```\n' : response,
            '',
          ].join('\n'),
          {
            encoding: 'utf-8',
          }
        )
      }

      const logListener = (type: AgentEvent['log'][0], content: string) => {
        const { logger } = project
        switch (type) {
          case 'info':
            logger.info(content)
            return
          case 'debug':
            logger.debug(content)
            return
          case 'error':
            logger.error(content)
          default:
            logger.debug(content)
        }
      }
      project.agent.emitter?.addListener('onRequest', listener)
      project.agent.emitter?.addListener('log', logListener)

      project.metadata.set('onRequest', listener)
      project.metadata.set('log', logListener)
    },
    onProjectEnd: async ({ project }) => {
      const listener = project.metadata.get('onRequest')
      const logListener = project.metadata.get('log')

      project.agent.emitter?.removeListener('onRequest', listener)
      project.agent.emitter?.removeListener('log', logListener)

      project.metadata.delete('log')
      project.metadata.delete('onRequest')
    },
  },
]
