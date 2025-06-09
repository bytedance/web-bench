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

test('√ ^2', async ({ page }) => {
  await expect(page.locator('button:text("√") + button:text("^2")')).toBeVisible()
})

test('3 ^2 = 9', async ({ page }) => {
  await page.click('button:text("3")')
  await page.click('button:text("^2")')

  await expect(page.locator('#display')).toHaveValue('9')
})

test('2 ^2 ^2 ^2 ^2 = 65536', async ({ page }) => {
  await page.click('button:text("2")')
  await page.click('button:text("^2")')
  await page.click('button:text("^2")')
  await page.click('button:text("^2")')
  await page.click('button:text("^2")')

  await expect(page.locator('#display')).toHaveValue('65536')
})

test('10 ^2 = 100', async ({ page }) => {
  await page.click('button:text("1")')
  await page.click('button:text("0")')
  await page.click('button:text("^2")')

  await expect(page.locator('#display')).toHaveValue('100')
})

test('-2 ^2 = 4', async ({ page }) => {
  await page.click('button:text("-")')
  await page.click('button:text("2")')
  await page.click('button:text("^2")')

  await expect(page.locator('#display')).toHaveValue('4')
})