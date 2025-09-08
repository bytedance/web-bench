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
  await page.goto('/')

  // CI will stuck for 500 ms, since the bad performance of vue reactive proxy compared with React
  page.setDefaultTimeout(1000)
})

test('Check Blog Length', async ({ page }) => {
  await page.getByText('Random Blogs').click()
  await expect(page.locator('.blog-list-len')).toContainText('100002')
})

test('Check Random Blogs will not stuck pages', async ({ page }) => {
  await page.getByText('Random Blogs').click()

  await page.getByText('Add Blog').click()
  await expect(page.getByText('Create Blog')).toBeVisible()
})

test('Check Search will not stuck in large blog list', async ({ page }) => {
  await page.getByText('Random Blogs').click()
  await page.getByText('Random Blogs').click()
  await page.getByText('Random Blogs').click()

  await page.getByPlaceholder('Search Blogs').fill('Random')
  await expect(page.locator('.list-item:has-text("Random")').first()).toBeVisible()
})
