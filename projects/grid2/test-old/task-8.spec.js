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
const { getComputedStyle, getOffset, getHtmlElement } = require('@web-bench/test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test.describe('page width 400px', () => {
  test.use({ viewport: { width: 400, height: 720 } })

  test('menu items horizontally align', async ({ page }) => {
    const item1 = await getOffset(page, '.menu > *:nth-child(1)')
    const item2 = await getOffset(page, '.menu > *:nth-child(2)')
    expect(item1.centerY).toBe(item2.centerY)
  })
})

test.describe('page width 399px', () => {
  test.use({ viewport: { width: 399, height: 720 } })

  test('menu items vertically align', async ({ page }) => {
    const item1 = await getOffset(page, '.menu > *:nth-child(1)')
    const item2 = await getOffset(page, '.menu > *:nth-child(2)')
    expect(item1.centerX).toBe(item2.centerX)
    expect(item1.width).toBe(item2.width)
  })

  test('menu items width', async ({ page }) => {
    const item1 = await getOffset(page, '.menu > *:nth-child(1)')
    const body = await getOffset(page, 'body')
    expect(item1.width).toBe(body.width)
  })
})
