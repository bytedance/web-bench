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

import path from 'path'
import {
  ProjectConfig,
  ProjectEvalConfig,
  ProjectSetting,
  ProjectSettingGetter,
} from '@web-bench/evaluator-types'
import fs from 'fs/promises'
import { parse } from 'yaml'
import fse from 'fs-extra'

import { FileUtils } from '../utils/file'
import { getTasksFromStartTaskToEndTask, tasks2setting } from '../utils/task'
import { toCamelCase } from '../utils/word'
import { formatEndpoint, formatModelName } from '../utils/format'
import { PluginSchedule } from '../plugins/schedule'

export class BenchProjectSettingGetter implements ProjectSettingGetter {
  public hash: string

  public pluginSchedule: PluginSchedule

  public constructor(hash: string, pluginSchedule: PluginSchedule) {
    this.hash = hash
    this.pluginSchedule = pluginSchedule
  }

  public async getInitProjectSetting(project: ProjectConfig): Promise<ProjectSetting> {
    const {
      packageName,
      logLevel,
      agentDir,
      startTask,
      endTask,
      production = true,
      fileDiffLog = false,
      taskMode = 'sequential',
    } = project

    // TODO: 这里怎么更优雅一点
    const projectRoot = path.join(__dirname, '../../../projects/')
    const repositoryDir = path.join(__dirname, '../../..')

    // 1. 获取所有的 projects 的 package.json

    const allProjects = await fs.readdir(projectRoot)

    const projectStats = await Promise.all(
      allProjects.map((p) => {
        return fs.stat(path.join(projectRoot, p))
      })
    )

    const projects = allProjects.filter((_, i) => projectStats[i].isDirectory())

    const packageJsons = await Promise.all(
      projects.map((p) =>
        fs
          .readFile(path.join(projectRoot, p, 'package.json'), {
            encoding: 'utf-8',
          })
          .catch((e) => {
            return undefined
          })
      )
    )

    // 2. 找到对应的项目的 package.json
    const idx = packageJsons.findIndex((json) => json && JSON.parse(json).name === packageName)

    const packageJson: { eval?: ProjectEvalConfig; scripts?: Record<string, string> } =
      packageJsons[idx] ? JSON.parse(packageJsons[idx]) : {}

    const { fileValidate, screenshot = true } = packageJsons[idx] ? packageJson?.eval || {} : {}

    if (idx === -1) {
      throw Error(`project ${packageName} not found`)
    }

    const name = project.name || toCamelCase(projects[idx])

    // 3. 获取对应的项目的 tasks

    const projectDir = path.join(projectRoot, projects[idx])

    // 4. 找到 init 文件的所有文件

    const initDir = path.join(projectDir, 'src-init')

    const initFiles = await FileUtils.getAllFiles(initDir, { relative: true })

    // 5. 获取对应的项目的 tasks
    let baseTasks = []
    if (await fse.pathExists(path.join(projectDir, 'tasks.yml'))) {
      const ymlContent = await fs.readFile(path.join(projectDir, 'tasks.yml'), {
        encoding: 'utf8',
      })
      baseTasks = parse(ymlContent)
    } else if (await fse.pathExists(path.join(projectDir, 'tasks.jsonl'))) {
      const lines = (
        await fs.readFile(path.join(projectDir, 'tasks.jsonl'), {
          encoding: 'utf8',
        })
      ).split('\n')
      baseTasks = lines.map((line) => JSON.parse(line))
    }

    const fullTasks = tasks2setting(baseTasks, projectDir)

    let originTasks = getTasksFromStartTaskToEndTask(fullTasks, startTask, endTask)

    const tasks = await this.pluginSchedule.run('onGetTasks', { originTasks }, originTasks)

    // 6. 初始化一些属性
    // 6.1 强制设置非 production mode，以及只执行部分任务则认为是开发模式
    const isDevMode = !production || fullTasks.length !== tasks.length

    const hasInit = tasks.find((task) => task.isInit)
    const srcDir = path.join(projectDir, 'src')
    // 6.2 设置初始文件夹的路径，考虑以下几种 case
    //   6.2.1 从 init task 开始的 eval：不需要读取任何初始文件
    //   6.2.2 没有 init task 的 eval: 存在 startTask 说明是校准过程，从 src 中复制
    //   6.2.3 没有 init task 的 eval: 不存在 startTask 从 init 文件下复制
    const outputProjectDir: string[] = []
    // 存在 init task 就不需要复制 init 文件了
    if (!hasInit) {
      // 存在 startTask 说明是校准过程，从 src 中复制
      if (startTask) {
        outputProjectDir.push(srcDir)
      } else {
        // 不存在 startTask 从 init 文件下复制
        outputProjectDir.push(initDir)
      }
    }

    // 输出的 eval 的路径
    const evalPath = path.join(projectDir, 'eval', 'eval-' + this.hash)

    if (await fse.pathExists(outputProjectDir[0])) {
      try {
        await fse.copy(outputProjectDir[0], path.join(evalPath, 'eval-source'), {
          filter(src) {
            if (
              src.includes('node_modules') ||
              src.includes('dist') ||
              src.includes('package-lock.json')
            ) {
              return false
            }

            return true
          },
        })
      } catch (e) {}
    }

    // assetsDir
    let assetsDir = ''

    if (await FileUtils.checkDirectoryExists(path.join(projectDir, 'assets'))) {
      assetsDir = path.join(projectDir, 'assets')
    }

    // 7. 返回项目完整的 setting
    return {
      name,
      taskMode,
      evalRootDir: evalPath,
      agentDir: agentDir || '',
      repositoryDir,
      taskCount: tasks.filter((t) => !t.isInit).length,
      packageName: project.packageName,
      retry: project.retry || 2,
      // TODO: tester 改为从 package.json 中获取
      tester: 'playwright',
      testUtilDir: path.join(repositoryDir, 'libraries', 'test-util'),
      needBuild: !!packageJson.scripts?.build,
      needInit: !!packageJson.scripts?.init,
      tasks,
      production: !isDevMode,
      outputWorkspaceDir: evalPath,
      endpoint: project.endpoint,
      // 该值在 initProject 和 updateSettingBeforeRunTask 中更新
      outputProjectDir,
      notScreenshot: !screenshot,
      logLevel: logLevel || 'info',
      originName: projects[idx],
      projectDir,
      fileValidate,
      testDir: path.join(projectDir, 'test'),
      model: project.model,
      initDir: initDir,
      srcDir: srcDir,
      initFiles,
      fileDiffLog,
      files: [],
      assetsDir,
    }
  }

  public async updateSettingBeforeRunTask(
    prevSettings: ProjectSetting,
    { task, times }: Parameters<ProjectSettingGetter['updateSettingBeforeRunTask']>[1]
  ): Promise<ProjectSetting> {
    // 更新文件，使用最新运行的 project 的运行路径

    let files: string[] = []
    if (prevSettings.outputProjectDir[0]) {
      files = await FileUtils.getAllFiles(prevSettings.outputProjectDir[0], {
        relative: true,
      })
    }
    const newOutputPath = path.join(
      prevSettings.outputWorkspaceDir,
      (formatModelName(prevSettings.model) || formatEndpoint(prevSettings.endpoint))!,
      [task.id, (times + 1).toString()].join('-')
    )
    if (prevSettings.assetsDir) {
      if (await FileUtils.checkDirectoryExists(path.join(newOutputPath, 'assets'))) {
        console.log('assets exists')
      } else {
        await fs.cp(prevSettings.assetsDir, path.join(newOutputPath, 'assets'), {
          recursive: true,
        })
      }
    }

    return {
      ...prevSettings,
      outputProjectDir: [newOutputPath, ...prevSettings.outputProjectDir],
      files,
    }
  }
}
