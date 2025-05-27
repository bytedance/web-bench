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

test.describe('page width 599px', () => {
  test.use({ viewport: { width: 599, height: 720 } })

  test('content 12 cards', async ({ page }) => {
    await expect(page.locator('.content > .card')).toHaveCount(12)
  })

  test('content 1 card/row', async ({ page }) => {
    const c1 = await getOffset(page, '.content > *:nth-child(1)')
    const c2 = await getOffset(page, '.content > *:nth-child(2)')
    const c3 = await getOffset(page, '.content > *:nth-child(3)')
    expect(c1.centerX).toBe(c2.centerX)
    expect(c2.centerX).toBe(c3.centerX)
  })

  test('content scroll', async ({ page }) => {
    const c1 = await getOffset(page, '.content > *:nth-child(1)')
    const content = page.locator('.content')
    // scroll
    const scroll = await content.evaluate((el) => {
      el.scrollTo(0, 400)

      return {
        top: el.scrollTop,
        left: el.scrollLeft,
        scrollHeight: el.scrollHeight,
      }
    })

    // expect(scroll.left).toBe(0)
    // FIXME why scroll.top === 0
    // expect(scroll.top).toBe(400)
    expectTolerance(c1.height * 12, scroll.scrollHeight, 5)
  })
})
