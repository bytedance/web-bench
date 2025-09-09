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
const { getOffset } = require('@web-bench/test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('Check Close Button place in the right of modal', async ({ page }) => {
  await page.getByText('Add Blog').click()

  await expect(page.getByText('Create Blog')).toBeVisible()

  const c1 = await getOffset(page, '.close-btn')
  const c2 = await getOffset(page, ':text("Create Blog")')

  expect(c1.centerX).toBeGreaterThan(c2.centerX)
})

test('Check Add Blog Modal, Open And Close', async ({ page }) => {
  await page.getByText('Add Blog').click()
  await expect(page.getByText('Create Blog')).toBeVisible()
  await page.locator('.close-btn').click()
  await expect(page.getByText('Create Blog')).toBeHidden()
})
