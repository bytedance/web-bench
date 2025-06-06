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

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('1 M- 2 + MR =', async ({ page }) => {
  await page.click('button:text("1")')
  await page.click('button:text("M-")')
  await expect(page.locator('#display')).toHaveValue('')

  await page.click('button:text("2")')
  await page.click('button:text("+")')
  await page.click('button:text("MR")')
  await page.click('button:text("=")')
  await expect(page.locator('#display')).toHaveValue('1')
})

test('1 M- 2 M- 3 M- MR', async ({ page }) => {
  await page.click('button:text("1")')
  await page.click('button:text("M-")')
  await page.click('button:text("2")')
  await page.click('button:text("M-")')
  await page.click('button:text("3")')
  await page.click('button:text("M-")')
  await page.click('button:text("MR")')
  await expect(page.locator('#display')).toHaveValue('-6')
})

test('M- at modes', async ({ page }) => {
  await expect(page.locator('button:text("M-")')).toBeVisible()

  await page.click('#mode')

  await expect(page.locator('button:text("M-")')).not.toBeVisible()
})