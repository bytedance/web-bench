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

test('common/menu.js', async ({ page }) => {
  await expect(isExisted('common/menu.js', path.join(__dirname, '../src'))).toBeTruthy()
})

test('.menu show/hide(from table click)', async ({ page }) => {
  await expect(page.locator('.menu')).toBeHidden()

  await page.locator('.table').click({ button: 'right' })
  await expect(page.locator('.menu')).toBeVisible()

  await page.locator('.table').click({ position: { x: 0, y: 0 } })
  await expect(page.locator('.menu')).toBeHidden()
})

test('.menu show/hide(from page click)', async ({ page }) => {
  await expect(page.locator('.menu')).toBeHidden()

  await page.locator('.table').click({ button: 'right' })
  await expect(page.locator('.menu')).toBeVisible()

  await page.locator('body').click({ position: { x: 0, y: 0 } })
  await expect(page.locator('.menu')).toBeHidden()
})

// test('.menu-item-hide-caption', async ({ page }) => {
//   const caption = page.locator('.table caption')
//   const menuitem = page.locator('.menu-item-hide-caption')

//   await expect(caption).toBeVisible()
//   await caption.click({ button: 'right' })
//   await expect(menuitem).toBeVisible()

//   await menuitem.click()
//   await expect(caption).toBeHidden()
//   await expect(menuitem).toBeHidden()
// })
