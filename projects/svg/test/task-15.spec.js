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

const { test, expect } = require('@playwright/test')
const { getOffsetByLocator } = require('../../../libraries/test-util/src')
const coverage = require('../../../libraries/test-util/src/coverage')

test.afterEach(coverage)

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('create text', async ({ page }) => {
  await page.locator('.text').click()

  const canvas = page.locator('.canvas')
  const shape = canvas.locator('text')
  await expect(shape).not.toBeAttached()
  await canvas.hover({ position: { x: 50, y: 50 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 150, y: 100 } })
  await page.mouse.up()
  await expect(shape).toBeVisible()
  await expect(shape).toHaveAttribute('fill', '#000000')
  await expect(shape).toHaveText('Text')
  // const offsetCanvas = await getOffsetByLocator(canvas)
  // const offset = await getOffsetByLocator(shape)
  // await expect(offset).toMatchObject({
  //   left: 50 + offsetCanvas.left,
  //   top: 50 + offsetCanvas.top,
  //   width: 50,
  //   height: 50,
  // })
})

test('create text with props', async ({ page }) => {
  await page.locator('.color').fill('#ff0000')
  await page.locator('.text').click()

  const canvas = page.locator('.canvas')
  const shape = canvas.locator('text')
  await expect(shape).not.toBeAttached()
  await canvas.hover({ position: { x: 50, y: 50 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 150, y: 100 } })
  await page.mouse.up()
  await expect(shape).toBeVisible()
  await expect(shape).toHaveAttribute('fill', '#ff0000')
  await expect(shape).toHaveText('Text')
})

test('create text | x1 < x2 && y1 < y2', async ({ page }) => {
  await page.locator('.text').click()

  const canvas = page.locator('.canvas')
  const shape = canvas.locator('text')
  await expect(shape).not.toBeAttached()
  await canvas.hover({ position: { x: 150, y: 100 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 50, y: 50 } })
  await page.mouse.up()
  await expect(shape).toHaveText('Text')
})

test('edit text', async ({ page }) => {
  await page.locator('.text').click()

  const canvas = page.locator('.canvas')
  const shape = canvas.locator('text').nth(0)
  await expect(shape).not.toBeAttached()
  await canvas.hover({ position: { x: 50, y: 50 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 150, y: 100 } })
  await page.mouse.up()
  await expect(shape).toHaveText('Text')

  await page.locator('.move').click()
  const newText = 'New Text'
  page.on('dialog', (dialog) => {
    if (dialog.type() === 'prompt') {
      dialog.accept(newText)
    }
  })
  await shape.dblclick()
  await expect(shape).toHaveText(newText)
})
