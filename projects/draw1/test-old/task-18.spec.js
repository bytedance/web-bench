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
const { getOffsetByLocator } = require('@web-bench/test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('press and hold blankspace to move', async ({ page }) => {
  const canvas = page.locator('.canvas')
  const shape = canvas.locator('line')

  // Draw
  await page.locator('.line').click()
  await canvas.hover({ position: { x: 50, y: 50 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 100, y: 150 } })
  await page.mouse.up()

  // Press and hold blankspace to move
  await page.keyboard.down(' ')
  await shape.hover()
  await page.mouse.down()
  await canvas.hover({ position: { x: 125, y: 200 } })
  await page.mouse.up()
  const offsetCanvas = await getOffsetByLocator(canvas)
  const offset = await getOffsetByLocator(shape)
  await expect(offset).toMatchObject({
    left: 100 + offsetCanvas.left,
    top: 150 + offsetCanvas.top,
    width: 50,
    height: 100,
  })

  // Release blankspace
  await page.keyboard.up(' ')
  await expect(page.locator('input[name="operation"]:checked')).toHaveValue('move')
})

test('release blankspace | no prev checked', async ({ page }) => {
  const canvas = page.locator('.canvas')

  // Press and hold blankspace to move
  // No Error
  await page.keyboard.down(' ')
  await canvas.hover()
  await page.mouse.down()
  await canvas.hover({ position: { x: 125, y: 200 } })
  await page.mouse.up()

  // Release blankspace
  await page.keyboard.up(' ')
  // await expect(page.locator('input[name="operation"]:checked'))
})

test('release blankspace', async ({ page }) => {
  const canvas = page.locator('.canvas')

  await page.locator('.move').click()

  // Press and hold blankspace to move
  // No Error
  await page.keyboard.down(' ')
  await canvas.hover()
  await page.mouse.down()
  await canvas.hover({ position: { x: 125, y: 200 } })
  await page.mouse.up()

  // Release blankspace
  await page.keyboard.up(' ')
  await expect(page.locator('input[name="operation"]:checked')).toHaveValue('move')
})
