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
const { getCmdKey } = require('@web-bench/test-util')
const path = require('path')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('.menu-item-select-row', async ({ page }) => {
  const row1 = page.locator('.table tbody tr:nth-child(1)')
  const row2 = page.locator('.table tbody tr:nth-child(2)')
  const td = row1.locator('td:nth-child(1)')
  const menuitem = page.locator('.menu-item-select-row')

  await expect(td).toBeVisible()
  await td.click({ button: 'right' })
  await expect(menuitem).toBeVisible()

  await menuitem.click()
  await expect(td).toHaveClass('selected')
  await expect(row1.locator('td:nth-child(2)')).toHaveClass('selected')
  await expect(row1.locator('td:nth-child(3)')).toHaveClass('selected')
  await expect(row2.locator('td:nth-child(1)')).not.toHaveClass('selected')
})

test('.menu-item-select-row unselect', async ({ page }) => {
  const row1 = page.locator('.table tbody tr:nth-child(1)')
  const row2 = page.locator('.table tbody tr:nth-child(2)')
  const td = row1.locator('td:nth-child(1)')
  const menuitem = page.locator('.menu-item-select-row')

  await expect(td).toBeVisible()
  await td.click({ button: 'right' })
  await expect(menuitem).toBeVisible()

  await menuitem.click()
  await td.click()
  await expect(row1.locator('td:nth-child(1)')).toHaveClass('selected')
  await expect(row1.locator('td:nth-child(2)')).not.toHaveClass('selected')
  await expect(row1.locator('td:nth-child(3)')).not.toHaveClass('selected')
})

test('.menu-item-select-col', async ({ page }) => {
  const row1 = page.locator('.table thead tr:nth-child(1)')
  const row2 = page.locator('.table tbody tr:nth-child(1)')
  const row3 = page.locator('.table tbody tr:nth-child(2)')
  const th = row1.locator('th:nth-child(1)')
  const menuitem = page.locator('.menu-item-select-col')

  await expect(th).toBeVisible()
  await th.click({ button: 'right' })
  await expect(menuitem).toBeVisible()

  await menuitem.click()
  await expect(th).toHaveClass('selected')
  await expect(row2.locator('td:nth-child(1)')).toHaveClass('selected')
  await expect(row3.locator('td:nth-child(1)')).toHaveClass('selected')
  await expect(row1.locator('th:nth-child(2)')).not.toHaveClass('selected')

  await th.click()
  await expect(th).toHaveClass('selected')
  await expect(row2.locator('td:nth-child(1)')).not.toHaveClass('selected')
  await expect(row3.locator('td:nth-child(1)')).not.toHaveClass('selected')
  await expect(row1.locator('th:nth-child(2)')).not.toHaveClass('selected')
})

test('.menu-item-select-col unselect', async ({ page }) => {
  const row1 = page.locator('.table thead tr:nth-child(1)')
  const row2 = page.locator('.table tbody tr:nth-child(1)')
  const row3 = page.locator('.table tbody tr:nth-child(2)')
  const th = row1.locator('th:nth-child(1)')
  const menuitem = page.locator('.menu-item-select-col')

  await expect(th).toBeVisible()
  await th.click({ button: 'right' })
  await expect(menuitem).toBeVisible()

  await menuitem.click()
  await th.click()
  await expect(th).toHaveClass('selected')
  await expect(row2.locator('td:nth-child(1)')).not.toHaveClass('selected')
  await expect(row3.locator('td:nth-child(1)')).not.toHaveClass('selected')
  await expect(row1.locator('th:nth-child(2)')).not.toHaveClass('selected')
})

test('cmd+a, unselected', async ({ page }) => {
  const row1 = page.locator('.table thead tr:nth-child(1)')
  const row2 = page.locator('.table tbody tr:nth-child(1)')
  const row3 = page.locator('.table tbody tr:nth-child(2)')

  const cmd = getCmdKey()
  await page.keyboard.down(cmd)
  await page.keyboard.press('KeyA')
  await page.keyboard.up(cmd)
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

test('cmd+a, selected', async ({ page }) => {
  const row1 = page.locator('.table thead tr:nth-child(1)')
  const row2 = page.locator('.table tbody tr:nth-child(1)')
  const row3 = page.locator('.table tbody tr:nth-child(2)')
  await row1.locator('th:nth-child(1)').click()

  const cmd = getCmdKey()
  await page.keyboard.down(cmd)
  await page.keyboard.press('KeyA')
  await page.keyboard.up(cmd)
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

test('escape unselect single cell', async ({ page }) => {
  const table = page.locator('.table')
  await table.locator('tbody tr:nth-child(2) td:nth-child(1)').click()
  await expect(table.locator('tbody tr:nth-child(2) td:nth-child(1)')).toHaveClass('selected')

  await page.keyboard.press('Escape')
  await expect(table.locator('tbody tr:nth-child(2) td:nth-child(1)')).not.toHaveClass('selected')
})

test('escape unselect cells', async ({ page }) => {
  const row1 = page.locator('.table thead tr:nth-child(1)')
  const row2 = page.locator('.table tbody tr:nth-child(1)')
  const row3 = page.locator('.table tbody tr:nth-child(2)')

  const cmd = getCmdKey()
  await page.keyboard.down(cmd)
  await page.keyboard.press('KeyA')
  await page.keyboard.up(cmd)
  await page.keyboard.press('Escape')
  await expect(row1.locator('th:nth-child(1)')).not.toHaveClass('selected')
  await expect(row1.locator('th:nth-child(2)')).not.toHaveClass('selected')
  await expect(row1.locator('th:nth-child(3)')).not.toHaveClass('selected')
  await expect(row2.locator('td:nth-child(1)')).not.toHaveClass('selected')
  await expect(row2.locator('td:nth-child(2)')).not.toHaveClass('selected')
  await expect(row2.locator('td:nth-child(3)')).not.toHaveClass('selected')
  await expect(row3.locator('td:nth-child(1)')).not.toHaveClass('selected')
  await expect(row3.locator('td:nth-child(2)')).not.toHaveClass('selected')
  await expect(row3.locator('td:nth-child(3)')).not.toHaveClass('selected')
})

test('escape', async ({ page }) => {
  const table = page.locator('.table')
  await table.locator('tbody tr:nth-child(2) td:nth-child(1)').click()
  await expect(table.locator('tbody tr:nth-child(2) td:nth-child(1)')).toHaveClass('selected')

  await page.keyboard.press('Escape')
  await expect(table.locator('tbody tr:nth-child(2) td:nth-child(1)')).not.toHaveClass('selected')
})
