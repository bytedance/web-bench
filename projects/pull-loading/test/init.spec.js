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


// init components test for pull-loading project

const { test, expect } = require('@playwright/test')

test.beforeEach(async ({ page }) => {
  await page.goto('index.html')
})

test('body', async ({ page }) => {
  await expect(page.locator('body')).toBeAttached()
})

test('content', async ({ page }) => {
  await expect(page.locator('#content')).toBeAttached()
})

// test('root', async ({ page }) => {
//   await expect(page.locator('#root')).toBeAttached()
// })