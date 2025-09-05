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

test('p color', async ({ page }) => {
    // Check if the p element has the correct color
    const p = page.locator('#content p').first()
    const pStyle = await p.evaluate((el) =>  window.getComputedStyle(el))
    expect(pStyle.color).toBe('rgb(0, 230, 255)')
})

test('p font', async ({ page }) => {
    // Check if the p element has the correct font size
    const p = page.locator('#content p').last()
    const pStyle = await p.evaluate((el) =>  window.getComputedStyle(el))
    expect(pStyle.fontSize).toBe('16px')
})