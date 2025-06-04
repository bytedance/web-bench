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

test('fill rect', async ({ page }) => {
  const canvas = page.locator('.canvas')
  const rect = canvas.locator('rect')

  // Draw
  await page.locator('.rect').click()
  await canvas.hover({ position: { x: 50, y: 50 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 100, y: 100 } })
  await page.mouse.up()

  // Fill
  await expect(rect).toHaveAttribute('fill', 'white')
  await page.locator('.fill').click()
  await rect.click()
  const color = await page.locator('.color').inputValue()
  await expect(rect).toHaveAttribute('fill', color)
})

test('fill ellipse', async ({ page }) => {
  const canvas = page.locator('.canvas')
  const ellipse = canvas.locator('ellipse')

  // Draw
  await page.locator('.ellipse').click()
  await canvas.hover({ position: { x: 50, y: 50 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 100, y: 100 } })
  await page.mouse.up()

  // Fill
  await expect(ellipse).toHaveAttribute('fill', 'white')
  await page.locator('.fill').click()
  await ellipse.click()
  const color = await page.locator('.color').inputValue()
  await expect(ellipse).toHaveAttribute('fill', color)
})
