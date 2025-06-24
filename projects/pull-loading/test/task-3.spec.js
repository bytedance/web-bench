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


// test for dom painting and css styling in pull-loading project

const { test, expect } = require('@playwright/test')
const { getComputedStyle, getOffset, getHtmlElement } = require('@web-bench/test-util')


test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('content', async ({ page }) => {
    // Check if the pull loading element is present
    const style = await getComputedStyle(page,'#content');
    await expect(style.display).toBe('block')
})

test('content h1', async ({ page }) => {
    // Check if the pull loading element is present
    const style = await getComputedStyle(page,'#content h1');
    await expect(style.display).toBe('block')
})
//noticeTxt

test('noticeTxt', async ({ page }) => {
    // Check if the pull loading element is present
    const style = await getComputedStyle(page,'#noticeTxt');
    await expect(style.display).toBe('block')
})

test('content p', async ({ page }) => {
    // Check if the pull loading element is present
    const style = await getComputedStyle(page,'#content p');
    await expect(style.display).toBe('block')
})