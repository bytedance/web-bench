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

test('initial files', async ({ page }) => {
  await expect(isExisted('index.html', path.join(__dirname, '../src'))).toBeTruthy()
  await expect(isExisted('index.css', path.join(__dirname, '../src'))).toBeTruthy()
  await expect(isExisted('index.js', path.join(__dirname, '../src'))).toBeTruthy()
})

test('.table', async ({ page }) => {
  await expect(page.locator('.table')).toBeVisible()
})

test('.table structure', async ({ page }) => {
  await expect(page.locator('.table thead')).toBeAttached()
  await expect(page.locator('.table tbody')).toBeAttached()

  await expect(page.locator('.table tr')).toHaveCount(3)
  await expect(page.locator('.table tr:nth-child(1) th')).toHaveCount(3)
  await expect(page.locator('.table tr:nth-child(1) td')).toHaveCount(3)

  await expect(page.locator('.table th')).toHaveCount(3)
  await expect(page.locator('.table td')).toHaveCount(6)
})
