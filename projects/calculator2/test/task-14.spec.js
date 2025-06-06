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

test('0 cos', async ({ page }) => {
  await page.click('button:text("0")')
  await page.click('button:text("cos")')

  await expect(page.locator('#display')).toHaveValue('1')
})

test('1 cos', async ({ page }) => {
  await page.click('button:text("1")')
  await page.click('button:text("cos")')

  const result = parseFloat(await page.locator('#display').inputValue())
  await expect(result).toBeCloseTo(0.5403023058681398, 5)
})

test('0 tan', async ({ page }) => {
  await page.click('button:text("0")')
  await page.click('button:text("tan")')

  await expect(page.locator('#display')).toHaveValue('0')
})

test('1 tan', async ({ page }) => {
  await page.click('button:text("1")')
  await page.click('button:text("tan")')

  const result = parseFloat(await page.locator('#display').inputValue())
  await expect(result).toBeCloseTo(1.5574077246549023, 5)
})

test('1 sinh', async ({ page }) => {
  await page.click('button:text("1")')
  await page.click('button:text("sinh")')

  const result = parseFloat(await page.locator('#display').inputValue())
  await expect(result).toBeCloseTo(1.175201193643801, 5)
})

test('1 cosh', async ({ page }) => {
  await page.click('button:text("1")')
  await page.click('button:text("cosh")')

  const result = parseFloat(await page.locator('#display').inputValue())
  await expect(result).toBeCloseTo(1.543080634815244, 5)
})
