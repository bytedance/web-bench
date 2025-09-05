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
  await page.goto('/index.html')
})

//find an element that you want to make visible at the bottom, and scroll it into view

test('scroll to bottom', async ({ page }) => {
    //bottom element
    const pullLoadingElement = page.locator('#noticeTxt')
    // Check if the pull loading element is present

    await pullLoadingElement.scrollIntoViewIfNeeded()
    // Check if the pull loading element is present

    await expect(pullLoadingElement).toBeVisible()
})
