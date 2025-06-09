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
const { getOffsetByLocator, isExisted } = require('@web-bench/test-util')
const path = require('path')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('common/layout.js', async ({ page }) => {
  await expect(isExisted('common/layout.js', path.join(__dirname, '../src'))).toBeTruthy()
})

test('resize tbody row height', async ({ page }) => {
  const td = page.locator('.table tbody tr:nth-child(1) td:nth-child(2)')
  const offset = await getOffsetByLocator(td)

  await td.hover()
  await page.mouse.move(offset.centerX, offset.bottom - 1, { steps: 10 })
  await page.mouse.down()
  await page.mouse.move(offset.centerX, offset.bottom + offset.height - 1, { steps: 10 })
  await page.mouse.up()

  const offset1 = await getOffsetByLocator(td)
  await expect(offset.height * 2).toBeCloseTo(offset1.height)
})

test('resize tbody new row height', async ({ page }) => {
  const td = page.locator('.table tbody tr:nth-child(1) td:nth-child(2)')

  // insert new row above
  await td.click({ button: 'right' })
  await page.locator('.menu-item-insert-row-above').click()

  const offset = await getOffsetByLocator(td)
  
  await td.hover()
  await page.mouse.move(offset.centerX, offset.bottom - 1, { steps: 10 })
  await page.mouse.down()
  await page.mouse.move(offset.centerX, offset.bottom + offset.height - 1, { steps: 10 })
  await page.mouse.up()

  const offset1 = await getOffsetByLocator(td)
  await expect(offset.height * 2).toBeCloseTo(offset1.height)
})

test('resize thead row height', async ({ page }) => {
  const th = page.locator('.table thead tr:nth-child(1) th:nth-child(2)')
  const offset = await getOffsetByLocator(th)

  await th.hover()
  await page.mouse.move(offset.centerX, offset.bottom - 1, { steps: 10 })
  await page.mouse.down()
  await page.mouse.move(offset.centerX, offset.bottom + offset.height - 1, { steps: 10 })
  await page.mouse.up()

  const offset1 = await getOffsetByLocator(th)
  await expect(offset.height * 2).toBeCloseTo(offset1.height)
})

test('resize row min height', async ({ page }) => {
  const td = page.locator('.table tbody tr:nth-child(1) td:nth-child(2)')
  const offset = await getOffsetByLocator(td)

  await td.hover()
  await page.mouse.move(offset.centerX, offset.bottom - 1, { steps: 10 })
  await page.mouse.down()
  await page.mouse.move(offset.centerX, offset.top + 20, { steps: 10 })
  await page.mouse.up()

  const newOffset = await getOffsetByLocator(td)
  await expect(newOffset.height).toBeCloseTo(40)
})
