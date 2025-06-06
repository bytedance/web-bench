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

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('create minimal line', async ({ page }) => {
  await page.locator('.line').click()
  const canvas = page.locator('.canvas')
  const shape = canvas.locator('line')
  await expect(shape).not.toBeAttached()
  await canvas.hover({ position: { x: 50, y: 50 } })
  await page.mouse.down()
  await page.mouse.up()

  await expect(shape).toBeAttached()
  // await expect(line).toBeVisible() // playwright, height = 0, hidden
  await expect(shape).toHaveAttribute('x1', '50')
  await expect(shape).toHaveAttribute('y1', '50')

  const offset = await getOffsetByLocator(shape)
  await expect(Math.sqrt(offset.width ** 2 + offset.height ** 2)).toBeCloseTo(9)
})

test('create minimal line 2', async ({ page }) => {
  await page.locator('.line').click()
  const canvas = page.locator('.canvas')
  const shape = canvas.locator('line')
  await expect(shape).not.toBeAttached()
  await canvas.hover({ position: { x: 50, y: 50 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 51, y: 51 } })
  await page.mouse.up()

  await expect(shape).toBeAttached()
  await expect(shape).toHaveAttribute('x1', '50')
  await expect(shape).toHaveAttribute('y1', '50')
  // await expect(shape).toHaveAttribute('x2', '59')
  // await expect(shape).toHaveAttribute('y2', '50')

  const offset = await getOffsetByLocator(shape)
  await expect(Math.sqrt(offset.width ** 2 + offset.height ** 2)).toBeCloseTo(9)
})

test('create minimal line 3', async ({ page }) => {
  await page.locator('.line').click()
  const canvas = page.locator('.canvas')
  const shape = canvas.locator('line')
  await expect(shape).not.toBeAttached()
  await canvas.hover({ position: { x: 50, y: 50 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 49, y: 49 } })
  await page.mouse.up()

  await expect(shape).toBeAttached()
  await expect(shape).toHaveAttribute('x1', '50')
  await expect(shape).toHaveAttribute('y1', '50')
  // await expect(shape).toHaveAttribute('x2', '41')
  // await expect(shape).toHaveAttribute('y2', '50')

  const offset = await getOffsetByLocator(shape)
  await expect(Math.sqrt(offset.width ** 2 + offset.height ** 2)).toBeCloseTo(9)
})
