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
  await page.goto('index.html')
})

// Initialize the test environment and display the page elements

test('dom ready', async ({ page }) => {

  // Check if the page title is correct
  // await expect(page).toHaveTitle('Pull Loading')

  // Check if the main container is present
  // const container = page.locator('#container')
  await expect(page.locator('#content')).toBeVisible()

  await expect(page.locator('p').first()).toBeAttached()
  // Check if the pull loading button is present
  const noticeTxt = page.locator('#noticeTxt')
  
  await expect(noticeTxt).toBeVisible()

})

test('body', async ({ page }) => {
  await expect(page.locator('body')).toBeAttached()
})

test('content', async ({ page }) => {
  await expect(page.locator('#content')).toBeAttached()
})

