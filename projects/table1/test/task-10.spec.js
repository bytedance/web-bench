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
const { isExisted, getOffsetByLocator } = require('@web-bench/test-util')
const path = require('path')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('common/mouse.js', async ({ page }) => {
  await expect(isExisted('common/mouse.js', path.join(__dirname, '../src'))).toBeTruthy()
})

test('mouse down/move/up select cells', async ({ page }) => {
  const row2 = page.locator('.table tbody tr:nth-child(1)')
  const row3 = page.locator('.table tbody tr:nth-child(2)')
  const td21 = row2.locator('td:nth-child(1)')
  const td32 = row3.locator('td:nth-child(2)')
  const point = await getOffsetByLocator(td32)
  await td21.hover()
  await page.mouse.down()
  await page.mouse.move(point.centerX, point.centerY)
  await page.mouse.up()

  await expect(row2.locator('td:nth-child(1)')).toHaveClass(/selected/i)
  await expect(row2.locator('td:nth-child(2)')).toHaveClass(/selected/i)
  await expect(row3.locator('td:nth-child(1)')).toHaveClass(/selected/i)
  await expect(row3.locator('td:nth-child(2)')).toHaveClass(/selected/i)
})

test('mouse down/move/up select a row of cells', async ({ page }) => {
  const row2 = page.locator('.table tbody tr:nth-child(1)')
  const td21 = row2.locator('td:nth-child(1)')
  const td23 = row2.locator('td:nth-child(3)')
  const point = await getOffsetByLocator(td23)
  await td21.hover()
  await page.mouse.down()
  await page.mouse.move(point.centerX, point.centerY, { steps: 10 })
  await page.mouse.up()

  await expect(row2.locator('td:nth-child(1)')).toHaveClass(/selected/i)
  await expect(row2.locator('td:nth-child(2)')).toHaveClass(/selected/i)
  await expect(row2.locator('td:nth-child(3)')).toHaveClass(/selected/i)
})

test('mouse down/move/up select a col of cells', async ({ page }) => {
  const row1 = page.locator('.table thead tr:nth-child(1)')
  const row2 = page.locator('.table tbody tr:nth-child(1)')
  const row3 = page.locator('.table tbody tr:nth-child(2)')
  const td11 = row1.locator('th:nth-child(1)')
  const td31 = row3.locator('td:nth-child(1)')
  const point = await getOffsetByLocator(td31)
  await td11.hover()
  await page.mouse.down()
  await page.mouse.move(point.centerX, point.centerY, { steps: 10 })
  await page.mouse.up()

  await expect(row1.locator('th:nth-child(1)')).toHaveClass(/selected/i)
  await expect(row2.locator('td:nth-child(1)')).toHaveClass(/selected/i)
  await expect(row3.locator('td:nth-child(1)')).toHaveClass(/selected/i)
})

test('mouse down/move/up not select single cell', async ({ page }) => {
  const row2 = page.locator('.table tbody tr:nth-child(1)')
  const td21 = row2.locator('td:nth-child(1)')
  const point = await getOffsetByLocator(td21)
  await td21.hover()
  await page.mouse.down()
  await page.mouse.move(point.centerX, point.centerY, { steps: 10 })
  await page.mouse.up()

  await expect(td21).toHaveClass(/selected/i)
  await expect(td21).not.toHaveAttribute('contenteditable', 'true')
})
