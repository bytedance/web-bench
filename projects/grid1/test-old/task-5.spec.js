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

test('.leftbar width', async ({ page }) => {
  const offset = await getOffset(page, '.leftbar')
  const body = await getOffset(page, 'body')
  expect(offset.width).toEqual(Math.min(200, body.width * 0.2)) // 200
})

test('.rightbar width', async ({ page }) => {
  const offset = await getOffset(page, '.rightbar')
  const body = await getOffset(page, 'body')
  expect(offset.width).toBeCloseTo(Math.max(200, body.width * 0.2)) // 256
})

test.describe('page width 800px', () => {
  test.use({ viewport: { width: 800, height: 720 } })

  test('leftbar visible', async ({ page }) => {
    await expect(page.locator('.leftbar')).toBeVisible()
  })

  test('.leftbar fixed left', async ({ page }) => {
    const offset = await getOffset(page, '.leftbar')
    const body = await getOffset(page, 'body')
    expect(offset.width).toEqual(Math.min(200, body.width * 0.2)) // 160
  })

  test('.rightbar fixed right', async ({ page }) => {
    const offset = await getOffset(page, '.rightbar')
    const body = await getOffset(page, 'body')
    expect(offset.width).toBeCloseTo(Math.max(200, body.width * 0.2)) // 200
  })
})

test.describe('page width 799px', () => {
  test.use({ viewport: { width: 799, height: 720 } })

  test('leftbar not visible', async ({ page }) => {
    await expect(page.locator('.leftbar')).toBeAttached()
    await expect(page.locator('.leftbar')).not.toBeVisible()
  })
})
