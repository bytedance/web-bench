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

test('^2 1/x', async ({ page }) => {
  await expect(page.locator('button:text("^2") + button:text("1/x")')).toBeVisible()
})

test('2 1/x = 0.5', async ({ page }) => {
  await page.click('button:text("2")')
  await page.click('button:text("1/x")')

  await expect(page.locator('#display')).toHaveValue('0.5')
})

test('4 1/x = 0.25', async ({ page }) => {
  await page.click('button:text("4")')
  await page.click('button:text("1/x")')

  await expect(page.locator('#display')).toHaveValue('0.25')
})

test('10 1/x = 0.1', async ({ page }) => {
  await page.click('button:text("1")')
  await page.click('button:text("0")')
  await page.click('button:text("1/x")')

  await expect(page.locator('#display')).toHaveValue('0.1')
})