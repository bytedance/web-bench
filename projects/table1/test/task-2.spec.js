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

test('.menu-item-insert-row-above cell-1-1', async ({ page }) => {
  const td = page.locator('.table tbody tr:nth-child(1) td:nth-child(3)')
  const menuitem = page.locator('.menu-item-insert-row-above')

  await expect(td).toBeVisible()
  await td.click({ button: 'right' })
  await expect(menuitem).toBeVisible()

  await expect(page.locator('.table tbody tr')).toHaveCount(2)
  await menuitem.click()
  await expect(page.locator('.table tbody tr')).toHaveCount(3)
})

test('.menu-item-insert-row-below last-child', async ({ page }) => {
  const td = page.locator('.table tbody tr:nth-child(2) td:nth-child(3)')
  const menuitem = page.locator('.menu-item-insert-row-below')

  await expect(td).toBeVisible()
  await td.click({ button: 'right' })
  await expect(menuitem).toBeVisible()

  await expect(page.locator('.table tbody tr')).toHaveCount(2)
  await menuitem.click()
  await expect(page.locator('.table tbody tr')).toHaveCount(3)
})

test('.menu-item-delete-row cell-1-1', async ({ page }) => {
  const td = page.locator('.table tbody tr:nth-child(2) td:nth-child(3)')
  const menuitem = page.locator('.menu-item-delete-row')

  await expect(td).toBeVisible()
  await td.click({ button: 'right' })
  await expect(menuitem).toBeVisible()

  await expect(page.locator('.table tbody tr')).toHaveCount(2)
  await menuitem.click()
  await expect(page.locator('.table tbody tr')).toHaveCount(1)
  await expect(td).toBeHidden()
})

test('.menu-item-delete-row last-child', async ({ page }) => {
  const td = page.locator('.table tbody tr:nth-child(1) td:nth-child(3)')
  const menuitem = page.locator('.menu-item-delete-row')

  await expect(td).toBeVisible()
  await td.click({ button: 'right' })
  await expect(menuitem).toBeVisible()

  await expect(page.locator('.table tbody tr')).toHaveCount(2)
  await menuitem.click()
  await expect(page.locator('.table tbody tr')).toHaveCount(1)
})
