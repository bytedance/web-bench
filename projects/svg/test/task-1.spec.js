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

test('create line', async ({ page }) => {
  await page.locator('.line').click()

  const canvas = page.locator('.canvas')
  const shape = canvas.locator('line')
  await expect(shape).not.toBeAttached()
  await canvas.hover({ position: { x: 50, y: 50 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 100, y: 150 } })
  await page.mouse.up()
  await expect(shape).toBeVisible()
  await expect(shape).toHaveAttribute('stroke-width', '9')
  await expect(shape).toHaveAttribute('stroke', '#000000')
  await expect(shape).toHaveAttribute('x1', '50')
  await expect(shape).toHaveAttribute('y1', '50')
  await expect(shape).toHaveAttribute('x2', '100')
  await expect(shape).toHaveAttribute('y2', '150')
  const offsetCanvas = await getOffsetByLocator(canvas)
  const offset = await getOffsetByLocator(shape)
  // console.log({ offsetCanvas, offset })

  await expect(offset).toMatchObject({
    left: 50 + offsetCanvas.left,
    top: 50 + offsetCanvas.top,
    width: 50,
    height: 100,
  })
})

test('create line with props', async ({ page }) => {
  await page.locator('.line-width').fill('21')
  await page.locator('.color').fill('#ff0000')
  await page.locator('.line').click()

  const canvas = page.locator('.canvas')
  const shape = canvas.locator('line')
  await expect(shape).not.toBeAttached()
  await canvas.hover({ position: { x: 50, y: 50 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 100, y: 150 } })
  await page.mouse.up()
  await expect(shape).toBeVisible()
  await expect(shape).toHaveAttribute('stroke-width', '21')
  await expect(shape).toHaveAttribute('stroke', '#ff0000')
  await expect(shape).toHaveAttribute('x1', '50')
  await expect(shape).toHaveAttribute('y1', '50')
  await expect(shape).toHaveAttribute('x2', '100')
  await expect(shape).toHaveAttribute('y2', '150')
  const offsetCanvas = await getOffsetByLocator(canvas)
  const offset = await getOffsetByLocator(shape)
  // console.log({ offsetCanvas, offset })

  await expect(offset).toMatchObject({
    left: 50 + offsetCanvas.left,
    top: 50 + offsetCanvas.top,
    width: 50,
    height: 100,
  })
})

test('create line | x1 < x2 && y1 < y2', async ({ page }) => {
  await page.locator('.line').click()

  const canvas = page.locator('.canvas')
  const shape = canvas.locator('line')
  await expect(shape).not.toBeAttached()
  await canvas.hover({ position: { x: 100, y: 150 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 50, y: 50 } })
  await page.mouse.up()
  await expect(shape).toBeVisible()
  await expect(shape).toHaveAttribute('stroke-width', '9')
  await expect(shape).toHaveAttribute('stroke', '#000000')
  await expect(shape).toHaveAttribute('x1', '100')
  await expect(shape).toHaveAttribute('y1', '150')
  await expect(shape).toHaveAttribute('x2', '50')
  await expect(shape).toHaveAttribute('y2', '50')
  const offsetCanvas = await getOffsetByLocator(canvas)
  const offset = await getOffsetByLocator(shape)
  // console.log({ offsetCanvas, offset })

  await expect(offset).toMatchObject({
    left: 50 + offsetCanvas.left,
    top: 50 + offsetCanvas.top,
    width: 50,
    height: 100,
  })
})