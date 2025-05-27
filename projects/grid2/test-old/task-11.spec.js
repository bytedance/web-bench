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
const {
  getComputedStyle,
  getOffset,
  getHtmlElement,
  getBox,
  getMarginBox,
  expectBetween,
  expectTolerance,
} = require('@web-bench/test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test.describe('page width 399px', () => {
  test.use({ viewport: { width: 399, height: 720 } })

  test('rightbar 2 columns', async ({ page }) => {
    const c1 = await getOffset(page, '.rightbar > *:nth-child(1)')
    const c2 = await getOffset(page, '.rightbar > *:nth-child(2)')
    expect(c1.centerY).toBe(c2.centerY)
  })

  test('rightbar 3 rows', async ({ page }) => {
    const c1 = await getOffset(page, '.rightbar > *:nth-child(1)')
    const c3 = await getOffset(page, '.rightbar > *:nth-child(3)')
    const c5 = await getOffset(page, '.rightbar > *:nth-child(5)')
    expect(c1.centerX).toBe(c3.centerX)
    expect(c3.centerX).toBe(c5.centerX)
  })

  test('rightbar top 6 cells visible', async ({ page }) => {
    const elements = await page.locator('.rightbar > *').all()
    for (let i = 0; i < elements.length; i++) {
      if (i < 6) await expect(elements[i]).toBeVisible()
      else {
        await expect(elements[i]).toBeAttached()
        await expect(elements[i]).not.toBeVisible()
      }
    }
  })

  test('rightbar 3 rows height', async ({ page }) => {
    const c1 = await getComputedStyle(page, '.rightbar > *:nth-child(1)')
    const c3 = await getComputedStyle(page, '.rightbar > *:nth-child(3)')
    const c5 = await getComputedStyle(page, '.rightbar > *:nth-child(5)')
    const rightbar = await getOffset(page, '.rightbar')
    expectTolerance(
      getMarginBox(c1).height + getMarginBox(c3).height + getMarginBox(c5).height,
      rightbar.height,
      5
    )
  })
})
