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
import { ProjectSetting, Task } from '@web-bench/evaluator-types'
import child_process from 'child_process'
import path from 'path'
import fs from 'promise-fs'

const { exec } = child_process

const getExecPromise = (
  cmd: string,
  {
    projectDir,
    port,
    settings,
  }: {
    projectDir: string
    port: number
    settings: ProjectSetting
  }
) => {
  return new Promise((resolve, reject) => {
    exec(
      cmd,
      {
        env: {
          ...process.env,
          EVAL_PROJECT_ROOT: projectDir,
          EVAL_PROJECT_PORT: `${port}`,
          IS_EVAL_PRODUCTION: settings.production ? 'true' : undefined,
          EVAL: 'true',
        },
      },
      (err, stdout, stderr) => {
        if (err) reject(stdout + '\n' + stderr)
        resolve('')
      }
    )
  })
}

const getTestBeforeEach = async (taskTestSpec: string) => {
  if (!fs.existsSync(taskTestSpec)) {
    return `test.beforeEach(async ({ page }) => {\n  await page.goto('/index.html') \n})`
  }

  const taskTestSpecContent = await fs.readFile(taskTestSpec, 'utf-8')
  const start = taskTestSpecContent.indexOf('test.beforeEach(')
  if (start === -1) return null
  let i = start + 'test.beforeEach('.length
  let stack = 1
  let end = i
  while (end < taskTestSpecContent.length && stack > 0) {
    if (taskTestSpecContent[end] === '(') stack++
    else if (taskTestSpecContent[end] === ')') stack--
    end++
  }
  // Extract content inside parentheses
  return `test.beforeEach(${taskTestSpecContent.slice(i, end - 1)})`
}

export const generateScreenShot = async (
  filename: string,
  settings: ProjectSetting,
  {
    port,
    task,
  }: {
    port: number
    task: Task
  }
) => {
  const isESModule = settings.packageJson?.type === 'module'

  // Include port number to avoid screenshot errors when multiple models run simultaneously and delete other screenshot.spec.js files
  const screenshotPath = path.join(settings.testDir, `screenshot-${port}.spec.js`)
  const taskTestSpec = path.join(settings.testDir, `${task.id}.spec.js`)

  // Fix: https://github.com/bytedance/web-bench/issues/71
  const escapedFilename = filename.replace(/\\/g, '\\\\'); // Replace \ with \\

  const content = `${
    isESModule
      ? `import { test } from '@playwright/test'`
      : `const { test } = require('@playwright/test')`
  }

${await getTestBeforeEach(taskTestSpec)}

test("Take Screenshot", async ({ page }) => {
  await page.waitForLoadState()
  await page.waitForLoadState('networkidle', { timeout: 5000 })
  await page.screenshot({
    path: "${escapedFilename}"
  })
})`

  try {
    await fs.access(screenshotPath)
    await fs.unlink(screenshotPath)
  } catch (error) {}

  try {
    await fs.writeFile(screenshotPath, content, 'utf-8')

    await getExecPromise(`cd ${settings.projectDir} && npx playwright test ${screenshotPath}`, {
      projectDir: settings.outputProjectDir[0],
      port,
      settings,
    })

    await fs.unlink(screenshotPath)
  } catch (error) {
    await fs.unlink(screenshotPath)

    return `Generate screenshot failed: port ${port}\n ${error}`
  }
}
