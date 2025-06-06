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

test('common/table.js', async ({ page }) => {
  await expect(isExisted('common/table.js', path.join(__dirname, '../src'))).toBeTruthy()
})

test('select th', async ({ page }) => {
  const th11 = page.locator('.table thead tr:nth-child(1) th:nth-child(1)')
  const th12 = page.locator('.table thead tr:nth-child(1) th:nth-child(2)')
  const th11Selected = page.locator('.table thead tr:nth-child(1) th:nth-child(1).selected')

  await expect(th11Selected).not.toBeAttached()

  await th11.click()
  await expect(th11Selected).toBeAttached()

  await th12.click()
  await expect(th11Selected).not.toBeAttached()
})

test('select td', async ({ page }) => {
  const td11 = page.locator('.table tbody tr:nth-child(1) td:nth-child(1)')
  const td12 = page.locator('.table tbody tr:nth-child(1) td:nth-child(2)')
  const td11Selected = page.locator('.table tbody tr:nth-child(1) td:nth-child(1).selected')

  await expect(td11Selected).not.toBeAttached()

  await td11.click()
  await expect(td11Selected).toBeAttached()

  await td12.click()
  await expect(td11Selected).not.toBeAttached()
})
