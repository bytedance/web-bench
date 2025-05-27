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

  test('rightbar at the right of content block', async ({ page }) => {
    const rightbarStyle = await getOffset(page, '.rightbar')
    const contentStyle = await getOffset(page, '.content')

    expect(contentStyle.left).toBe(0)
    expect(contentStyle.right).toBe(rightbarStyle.left)
  })

  test('rightbar + content === page width', async ({ page }) => {
    const rightbarStyle = await getOffset(page, '.rightbar')
    const contentStyle = await getOffset(page, '.content')
    const bodyStyle = await getOffset(page, 'body')

    expect(rightbarStyle.width + contentStyle.width).toBe(bodyStyle.width)
  })
})

test.describe('page width 399px', () => {
  test.use({ viewport: { width: 399, height: 720 } })

  test('rightbar at the bottom of content block', async ({ page }) => {
    const rightbarStyle = await getOffset(page, '.rightbar')
    const contentStyle = await getOffset(page, '.content')

    expect(rightbarStyle.left).toBe(0)
    expect(contentStyle.left).toBe(0)
    expect(rightbarStyle.top).toBe(contentStyle.bottom)
  })

  test('rightbar and content has page width', async ({ page }) => {
    const rightbarStyle = await getOffset(page, '.rightbar')
    const contentStyle = await getOffset(page, '.content')
    const bodyStyle = await getOffset(page, 'body')

    expect(contentStyle.width).toBe(rightbarStyle.width)
    expect(contentStyle.width).toBe(bodyStyle.width)
  })
})
