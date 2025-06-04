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
require('../../../libraries/test-util/src/coverage');
test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('combined transforms to line | move-rotate-zoom', async ({ page }) => {
  const canvas = page.locator('.canvas')
  const shape = canvas.locator('line')

  // Draw
  await page.locator('.line').click()
  await canvas.hover({ position: { x: 50, y: 50 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 100, y: 100 } })
  await page.mouse.up()

  // Move
  await page.locator('.move').click()
  await shape.hover()
  await page.mouse.down()
  await canvas.hover({ position: { x: 125, y: 125 } })
  await page.mouse.up()
  // Rotate
  await page.locator('.rotate').click()
  await canvas.hover({ position: { x: 150, y: 100 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 150, y: 150 } })
  await page.mouse.up()
  // Zoom
  await page.locator('.zoom').click()
  await canvas.hover({ position: { x: 150, y: 150 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 175, y: 175 } })
  await page.mouse.up()

  const offsetCanvas = await getOffsetByLocator(canvas)
  const offset = await getOffsetByLocator(shape)
  await expect(offset).toMatchObject({
    left: 75 + offsetCanvas.left,
    top: 75 + offsetCanvas.top,
    width: 100,
    height: 100,
  })
})

test('combined transforms to rect | move-rotate-zoom', async ({ page }) => {
  const canvas = page.locator('.canvas')
  const shape = canvas.locator('rect')

  // Draw
  await page.locator('.rect').click()
  await canvas.hover({ position: { x: 50, y: 50 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 100, y: 100 } })
  await page.mouse.up()

  // Move
  await page.locator('.move').click()
  await shape.hover()
  await page.mouse.down()
  await canvas.hover({ position: { x: 125, y: 125 } })
  await page.mouse.up()
  // Rotate
  await page.locator('.rotate').click()
  await canvas.hover({ position: { x: 150, y: 100 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 150, y: 150 } })
  await page.mouse.up()
  // Zoom
  await page.locator('.zoom').click()
  await canvas.hover({ position: { x: 150, y: 150 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 175, y: 175 } })
  await page.mouse.up()

  const offsetCanvas = await getOffsetByLocator(canvas)
  const offset = await getOffsetByLocator(shape)
  await expect(offset).toMatchObject({
    left: 75 + offsetCanvas.left,
    top: 75 + offsetCanvas.top,
    width: 100,
    height: 100,
  })
})

test('combined transforms to ellipse | move-rotate-zoom', async ({ page }) => {
  const canvas = page.locator('.canvas')
  const shape = canvas.locator('ellipse')

  // Draw
  await page.locator('.ellipse').click()
  await canvas.hover({ position: { x: 50, y: 50 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 100, y: 100 } })
  await page.mouse.up()

  // Move
  await page.locator('.move').click()
  await shape.hover()
  await page.mouse.down()
  await canvas.hover({ position: { x: 125, y: 125 } })
  await page.mouse.up()
  // Rotate
  await page.locator('.rotate').click()
  await canvas.hover({ position: { x: 150, y: 100 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 150, y: 150 } })
  await page.mouse.up()
  // Zoom
  await page.locator('.zoom').click()
  await canvas.hover({ position: { x: 150, y: 125 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 175, y: 125 } })
  await page.mouse.up()

  const offsetCanvas = await getOffsetByLocator(canvas)
  const offset = await getOffsetByLocator(shape)
  await expect(offset).toMatchObject({
    left: 75 + offsetCanvas.left,
    top: 75 + offsetCanvas.top,
    width: 100,
    height: 100,
  })
})

test('combined transforms to rect | zoom-rotate-move', async ({ page }) => {
  const canvas = page.locator('.canvas')
  const shape = canvas.locator('rect')

  // Draw
  await page.locator('.rect').click()
  await canvas.hover({ position: { x: 50, y: 50 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 100, y: 100 } })
  await page.mouse.up()

  // Zoom
  await page.locator('.zoom').click()
  await canvas.hover({ position: { x: 100, y: 75 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 125, y: 75 } })
  await page.mouse.up()
  // Rotate
  await page.locator('.rotate').click()
  await canvas.hover({ position: { x: 125, y: 25 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 125, y: 125 } })
  await page.mouse.up()
  // Move
  await page.locator('.move').click()
  await shape.hover()
  await page.mouse.down()
  await canvas.hover({ position: { x: 125, y: 125 } })
  await page.mouse.up()

  const offsetCanvas = await getOffsetByLocator(canvas)
  const offset = await getOffsetByLocator(shape)
  await expect(offset).toMatchObject({
    left: 75 + offsetCanvas.left,
    top: 75 + offsetCanvas.top,
    width: 100,
    height: 100,
  })
})

test('combined transforms to rect | rotate-zoom-move', async ({ page }) => {
  const canvas = page.locator('.canvas')
  const shape = canvas.locator('rect')

  // Draw
  await page.locator('.rect').click()
  await canvas.hover({ position: { x: 50, y: 50 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 100, y: 100 } })
  await page.mouse.up()

  // Rotate
  await page.locator('.rotate').click()
  await canvas.hover({ position: { x: 100, y: 50 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 100, y: 100 } })
  await page.mouse.up()
  // Zoom
  await page.locator('.zoom').click()
  await canvas.hover({ position: { x: 100, y: 75 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 125, y: 75 } })
  await page.mouse.up()
  // Move
  await page.locator('.move').click()
  await shape.hover()
  await page.mouse.down()
  await canvas.hover({ position: { x: 125, y: 125 } })
  await page.mouse.up()

  const offsetCanvas = await getOffsetByLocator(canvas)
  const offset = await getOffsetByLocator(shape)
  await expect(offset).toMatchObject({
    left: 75 + offsetCanvas.left,
    top: 75 + offsetCanvas.top,
    width: 100,
    height: 100,
  })
})
