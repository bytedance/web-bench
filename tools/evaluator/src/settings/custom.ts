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
  Task,
} from '@web-bench/evaluator-types'
import { parse } from 'yaml'
import fs from 'fs/promises'
import fse from 'fs-extra'
import { FileUtils } from '../utils/file'
import { PluginSchedule } from '../plugins/schedule'
import { readFile } from 'promise-fs'
import { tasks2setting } from '../utils/task'

export class CustomProjectSettingGetter implements ProjectSettingGetter {
  public hash: string

  public pluginSchedule: PluginSchedule

  public constructor(hash: string, pluginSchedule: PluginSchedule) {
    this.hash = hash
    this.pluginSchedule = pluginSchedule
  }

  public async getInitProjectSetting(project: ProjectConfig): Promise<ProjectSetting> {
    const { logLevel, production, taskMode = 'sequential', fileDiffLog = false } = project

    const projectRoot = process.cwd()

    // 1. 获取 package.json

    const packageJsonContent = await readFile(path.join(projectRoot, 'package.json'), {
      encoding: 'utf-8',
    })

    const packageJson: {
      name: string
      eval?: ProjectEvalConfig
      scripts?: Record<string, string>
    } = packageJsonContent ? JSON.parse(packageJsonContent) : {}

    const name = packageJson.name

    // 3. 获取对应的项目的 tasks

    let baseTasks = []
    if (await fse.pathExists(path.join(projectRoot, 'tasks.yml'))) {
      const ymlContent = await fs.readFile(path.join(projectRoot, 'tasks.yml'), {
        encoding: 'utf8',
      })
      baseTasks = parse(ymlContent)
    } else if (await fse.pathExists(path.join(projectRoot, 'tasks.jsonl'))) {
      const lines = (
        await fs.readFile(path.join(projectRoot, 'tasks.jsonl'), {
          encoding: 'utf8',
        })
      ).split('\n')
      baseTasks = lines.map((line) => JSON.parse(line))
    }

    const originTasks = tasks2setting(baseTasks, projectRoot)

    const tasks = await this.pluginSchedule.run('onGetTasks', { originTasks }, originTasks)

    const outputProjectDir: string[] = []

    // 输出的 eval 的路径
    const evalPath = path.join(projectRoot, 'eval', 'eval-' + this.hash)

    // assetsDir
    let assetsDir = ''

    // 7. 返回项目完整的 setting
    return {
      name,
      agentDir: projectRoot,
      repositoryDir: projectRoot,
      taskCount: tasks.filter((t) => !t.isInit).length,
      packageName: project.packageName,
      retry: project.retry || 2,
      tester: 'playwright',
      testUtilDir: '',
      evalRootDir: '',
      needBuild: !!packageJson.scripts?.build,
      taskMode,
      needInit: !!packageJson.scripts?.init,
      tasks,
      production: !!production,
      outputWorkspaceDir: evalPath,
      endpoint: project.endpoint,
      outputProjectDir,
      notScreenshot: true,
      logLevel: logLevel || 'info',
      originName: name,
      projectDir: projectRoot,
      fileValidate: {},
      testDir: '',
      fileDiffLog,
      model: project.model,
      initDir: '',
      srcDir: '',
      initFiles: [],
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

    return {
      ...prevSettings,
      // outputProjectDir: [newOutputPath, ...prevSettings.outputProjectDir],
      files,
    }
  }
}
