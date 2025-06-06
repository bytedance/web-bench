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

test('.menu-item-insert-col-left at first col', async ({ page }) => {
  const th = page.locator('.table thead tr:nth-child(1) th:first-child')
  const menuitem = page.locator('.menu-item-insert-col-left')

  await expect(th).toBeVisible()
  await th.click({ button: 'right' })
  await expect(menuitem).toBeVisible()

  // @ts-ignore
  // await expect(await th.evaluate((el) => el.cellIndex)).toBe(2)
  await expect(page.locator('.table thead tr:nth-child(1) th')).toHaveCount(3)
  await expect(page.locator('.table tbody tr:nth-child(1) td')).toHaveCount(3)
  await menuitem.click()
  // @ts-ignore
  // await expect(await th.evaluate((el) => el.cellIndex)).toBe(3)
  await expect(page.locator('.table thead tr:nth-child(1) th')).toHaveCount(4)
  await expect(page.locator('.table tbody tr:nth-child(1) td')).toHaveCount(4)
})

test('.menu-item-insert-col-right at last col', async ({ page }) => {
  const th = page.locator('.table thead tr:nth-child(1) th:nth-child(3)')
  const menuitem = page.locator('.menu-item-insert-col-right')

  await expect(th).toBeVisible()
  await th.click({ button: 'right' })
  await expect(menuitem).toBeVisible()

  // @ts-ignore
  // await expect(await th.evaluate((el) => el.cellIndex)).toBe(2)
  await expect(page.locator('.table thead tr:nth-child(1) th')).toHaveCount(3)
  await expect(page.locator('.table tbody tr:nth-child(1) td')).toHaveCount(3)
  await menuitem.click()
  // @ts-ignore
  // await expect(await th.evaluate((el) => el.cellIndex)).toBe(3)
  await expect(page.locator('.table thead tr:nth-child(1) th')).toHaveCount(4)
  await expect(page.locator('.table tbody tr:nth-child(1) td')).toHaveCount(4)
})

test('.menu-item-delete-col last col', async ({ page }) => {
  const th = page.locator('.table thead tr:nth-child(1) th:nth-child(3)')
  const menuitem = page.locator('.menu-item-delete-col')

  await expect(th).toBeVisible()
  await th.click({ button: 'right' })
  await expect(menuitem).toBeVisible()

  await expect(page.locator('.table thead tr:nth-child(1) th')).toHaveCount(3)
  await expect(page.locator('.table tbody tr:nth-child(1) td')).toHaveCount(3)
  await menuitem.click()
  await expect(page.locator('.table thead tr:nth-child(1) th')).toHaveCount(2)
  await expect(page.locator('.table tbody tr:nth-child(1) td')).toHaveCount(2)
  await expect(th).toBeHidden()
})

test('.menu-item-delete-col first col', async ({ page }) => {
  const th = page.locator('.table thead tr:nth-child(1) th:nth-child(1)')
  const menuitem = page.locator('.menu-item-delete-col')

  await expect(th).toBeVisible()
  await th.click({ button: 'right' })
  await expect(menuitem).toBeVisible()

  await expect(page.locator('.table thead tr:nth-child(1) th')).toHaveCount(3)
  await expect(page.locator('.table tbody tr:nth-child(1) td')).toHaveCount(3)
  await menuitem.click()
  await expect(page.locator('.table thead tr:nth-child(1) th')).toHaveCount(2)
  await expect(page.locator('.table tbody tr:nth-child(1) td')).toHaveCount(2)
})
