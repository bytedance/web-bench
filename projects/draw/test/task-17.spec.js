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
const coverage = require('../../../libraries/test-util/src/coverage');test.afterEach(coverage);;
test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('create and move', async ({ page }) => {
  const canvas = page.locator('.canvas')
  const shape = canvas.locator('line')

  // Draw
  await page.locator('.line').click()
  await canvas.hover({ position: { x: 50, y: 50 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 100, y: 150 } })
  await page.mouse.up()
  await expect(page.locator('input[name="operation"]:checked')).toHaveValue('move')

  // Move
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
})

test('copy and move', async ({ page }) => {
  const canvas = page.locator('.canvas')
  const shape = canvas.locator('line').nth(0)

  // Draw
  await page.locator('.line').click()
  await canvas.hover({ position: { x: 50, y: 50 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 100, y: 150 } })
  await page.mouse.up()

  // Copy
  await page.locator('.copy').click()
  await shape.click()
  const shape1 = canvas.locator('line').nth(1)
  await expect(page.locator('input[name="operation"]:checked')).toHaveValue('move')

  // Move
  await shape1.hover()
  await page.mouse.down()
  await canvas.hover({ position: { x: 125, y: 200 } })
  await page.mouse.up()
  const offsetCanvas = await getOffsetByLocator(canvas)
  const offset1 = await getOffsetByLocator(shape1)
  await expect(offset1).toMatchObject({
    left: 100 + offsetCanvas.left,
    top: 150 + offsetCanvas.top,
    width: 50,
    height: 100,
  })
})
