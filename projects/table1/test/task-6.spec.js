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
const { isExisted } = require('@web-bench/test-util')
const path = require('path')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

async function shiftTab(page) {
  await page.keyboard.down('Shift')
  await page.keyboard.press('Tab')
  await page.keyboard.up('Shift')
}

test('no selected cell, tab', async ({ page }) => {
  const headerRow = page.locator('.table thead tr:nth-child(1)')
  await page.keyboard.press('Tab')
  await expect(headerRow.locator('th:nth-child(1)')).toHaveClass('selected')
})

test('no selected cell, shift+tab', async ({ page }) => {
  const headerRow = page.locator('.table thead tr:nth-child(1)')
  await shiftTab(page)
  await expect(headerRow.locator('th:nth-child(1)')).toHaveClass('selected')
})

test('tab', async ({ page }) => {
  const row1 = page.locator('.table thead tr:nth-child(1)')
  const row2 = page.locator('.table tbody tr:nth-child(1)')
  const row3 = page.locator('.table tbody tr:nth-child(2)')

  await page.keyboard.press('Tab')
  await expect(row1.locator('th:nth-child(1)')).toHaveClass('selected')
  await page.keyboard.press('Tab')
  await expect(row1.locator('th:nth-child(2)')).toHaveClass('selected')
  await page.keyboard.press('Tab')
  await expect(row1.locator('th:nth-child(3)')).toHaveClass('selected')

  await page.keyboard.press('Tab')
  await expect(row2.locator('td:nth-child(1)')).toHaveClass('selected')
  await page.keyboard.press('Tab')
  await expect(row2.locator('td:nth-child(2)')).toHaveClass('selected')
  await page.keyboard.press('Tab')
  await expect(row2.locator('td:nth-child(3)')).toHaveClass('selected')

  await page.keyboard.press('Tab')
  await expect(row3.locator('td:nth-child(1)')).toHaveClass('selected')
  await page.keyboard.press('Tab')
  await expect(row3.locator('td:nth-child(2)')).toHaveClass('selected')
  await page.keyboard.press('Tab')
  await expect(row3.locator('td:nth-child(3)')).toHaveClass('selected')
})

test('shift+tab', async ({ page }) => {
  const row1 = page.locator('.table thead tr:nth-child(1)')
  const row2 = page.locator('.table tbody tr:nth-child(1)')
  const row3 = page.locator('.table tbody tr:nth-child(2)')

  await shiftTab(page)
  await expect(row1.locator('th:nth-child(1)')).toHaveClass('selected')

  await shiftTab(page)
  await expect(row3.locator('td:nth-child(3)')).toHaveClass('selected')
  await shiftTab(page)
  await expect(row3.locator('td:nth-child(2)')).toHaveClass('selected')
  await shiftTab(page)
  await expect(row3.locator('td:nth-child(1)')).toHaveClass('selected')

  await shiftTab(page)
  await expect(row2.locator('td:nth-child(3)')).toHaveClass('selected')
  await shiftTab(page)
  await expect(row2.locator('td:nth-child(2)')).toHaveClass('selected')
  await shiftTab(page)
  await expect(row2.locator('td:nth-child(1)')).toHaveClass('selected')

  await shiftTab(page)
  await expect(row1.locator('th:nth-child(3)')).toHaveClass('selected')
  await shiftTab(page)
  await expect(row1.locator('th:nth-child(2)')).toHaveClass('selected')
  await shiftTab(page)
  await expect(row1.locator('th:nth-child(1)')).toHaveClass('selected')
})
