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
const { getOffset, getComputedStyle, getMarginBox, expectTolerance } = require('@web-bench/test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('content 12 cards', async ({ page }) => {
  await expect(page.locator('.content > .card')).toHaveCount(12)
})

test('content 3 cards/row', async ({ page }) => {
  const c1 = await getOffset(page, '.card:nth-child(1)')
  const c2 = await getOffset(page, '.card:nth-child(2)')
  const c3 = await getOffset(page, '.card:nth-child(3)')
  const c4 = await getOffset(page, '.card:nth-child(4)')
  expect(c1.centerY).toBe(c2.centerY)
  expect(c2.centerY).toBe(c3.centerY)
  expect(c1.centerX).toBe(c4.centerX)
})

test('content scollable', async ({ page }) => {
  await expect(page.locator('.content')).toHaveCSS('overflow-y', /auto|scroll/)
})

test('card min-height', async ({ page }) => {
  await expect(page.locator('.card:nth-child(1)')).toHaveCSS('min-height', '100px')

  const offset = await getOffset(page, '.card:nth-child(1)')
  expect(offset.height).toBeGreaterThanOrEqual(100)
})

test('cards height', async ({ page }) => {
  const c1 = await getComputedStyle(page, '.card:nth-child(1)')
  const c4 = await getComputedStyle(page, '.card:nth-child(4)')
  const c7 = await getComputedStyle(page, '.card:nth-child(7)')
  const c10 = await getComputedStyle(page, '.card:nth-child(10)')
  const content = await getOffset(page, '.content')
  expectTolerance(
    getMarginBox(c1).height +
      getMarginBox(c4).height +
      getMarginBox(c7).height +
      getMarginBox(c10).height,
    content.height,
    5
  )
})
