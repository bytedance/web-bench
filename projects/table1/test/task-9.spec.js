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
const path = require('path')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('select start(1, 1) end(1, 3)', async ({ page }) => {
  const row1 = page.locator('.table thead tr:nth-child(1)')

  await row1.locator('th:nth-child(1)').click()
  await page.keyboard.down('Shift')
  await row1.locator('th:nth-child(3)').click()
  await page.keyboard.up('Shift')

  await expect(row1.locator('th:nth-child(1)')).toHaveClass('selected')
  await expect(row1.locator('th:nth-child(2)')).toHaveClass('selected')
  await expect(row1.locator('th:nth-child(3)')).toHaveClass('selected')
})

test('select start(1, 3) end(1, 1)', async ({ page }) => {
  const row1 = page.locator('.table thead tr:nth-child(1)')

  await row1.locator('th:nth-child(3)').click()
  await page.keyboard.down('Shift')
  await row1.locator('th:nth-child(1)').click()
  await page.keyboard.up('Shift')

  await expect(row1.locator('th:nth-child(1)')).toHaveClass('selected')
  await expect(row1.locator('th:nth-child(2)')).toHaveClass('selected')
  await expect(row1.locator('th:nth-child(3)')).toHaveClass('selected')
})

test('select start(1, 1) end(3, 3)', async ({ page }) => {
  const row1 = page.locator('.table thead tr:nth-child(1)')
  const row2 = page.locator('.table tbody tr:nth-child(1)')
  const row3 = page.locator('.table tbody tr:nth-child(2)')

  await row1.locator('th:nth-child(1)').click()
  await page.keyboard.down('Shift')
  await row3.locator('td:nth-child(3)').click()
  await page.keyboard.up('Shift')

  await expect(row1.locator('th:nth-child(1)')).toHaveClass('selected')
  await expect(row1.locator('th:nth-child(2)')).toHaveClass('selected')
  await expect(row1.locator('th:nth-child(3)')).toHaveClass('selected')

  await expect(row2.locator('td:nth-child(1)')).toHaveClass('selected')
  await expect(row2.locator('td:nth-child(2)')).toHaveClass('selected')
  await expect(row2.locator('td:nth-child(3)')).toHaveClass('selected')

  await expect(row3.locator('td:nth-child(1)')).toHaveClass('selected')
  await expect(row3.locator('td:nth-child(2)')).toHaveClass('selected')
  await expect(row3.locator('td:nth-child(3)')).toHaveClass('selected')
})

test('select start(3, 3) end(1, 1)', async ({ page }) => {
  const row1 = page.locator('.table thead tr:nth-child(1)')
  const row2 = page.locator('.table tbody tr:nth-child(1)')
  const row3 = page.locator('.table tbody tr:nth-child(2)')

  await row3.locator('td:nth-child(3)').click()
  await page.keyboard.down('Shift')
  await row1.locator('th:nth-child(1)').click()
  await page.keyboard.up('Shift')

  await expect(row1.locator('th:nth-child(1)')).toHaveClass('selected')
  await expect(row1.locator('th:nth-child(2)')).toHaveClass('selected')
  await expect(row1.locator('th:nth-child(3)')).toHaveClass('selected')

  await expect(row2.locator('td:nth-child(1)')).toHaveClass('selected')
  await expect(row2.locator('td:nth-child(2)')).toHaveClass('selected')
  await expect(row2.locator('td:nth-child(3)')).toHaveClass('selected')

  await expect(row3.locator('td:nth-child(1)')).toHaveClass('selected')
  await expect(row3.locator('td:nth-child(2)')).toHaveClass('selected')
  await expect(row3.locator('td:nth-child(3)')).toHaveClass('selected')
})

test('select cells and click', async ({ page }) => {
  const row1 = page.locator('.table thead tr:nth-child(1)')

  await row1.locator('th:nth-child(1)').click()
  await page.keyboard.down('Shift')
  await row1.locator('th:nth-child(3)').click()
  await page.keyboard.up('Shift')

  await row1.locator('th:nth-child(1)').click()

  await expect(row1.locator('th:nth-child(1)')).toHaveClass('selected')
  await expect(row1.locator('th:nth-child(2)')).not.toHaveClass('selected')
  await expect(row1.locator('th:nth-child(3)')).not.toHaveClass('selected')
})

test('select cells and arrow key', async ({ page }) => {
  const row1 = page.locator('.table thead tr:nth-child(1)')

  await row1.locator('th:nth-child(1)').click()
  await page.keyboard.down('Shift')
  await row1.locator('th:nth-child(3)').click()
  await page.keyboard.up('Shift')

  await page.keyboard.press('ArrowLeft')

  await expect(row1.locator('th:nth-child(1)')).toHaveClass('selected')
  await expect(row1.locator('th:nth-child(2)')).not.toHaveClass('selected')
  await expect(row1.locator('th:nth-child(3)')).not.toHaveClass('selected')
})
