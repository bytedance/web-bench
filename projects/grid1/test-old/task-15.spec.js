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
  getOffset,
  getComputedStyle,
  getMarginBox,
  expectTolerance,
  expectOneLine,
} = require('@web-bench/test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test("content 12 card's children", async ({ page }) => {
  await expect(page.locator('.card-image')).toHaveCount(12)
  await expect(page.locator('.card-title')).toHaveCount(12)
  await expect(page.locator('.card-price')).toHaveCount(12)
})

test('card image visible', async ({ page }) => {
  await expect(page.locator('.content > *:nth-child(1) .card-image')).toBeVisible()
})

test('card title visible', async ({ page }) => {
  await expectOneLine(page, '.card-title')
  await expect(page.locator('.content > *:nth-child(1) .card-title')).toBeVisible()
})

test('card price visible', async ({ page }) => {
  await expect(page.locator('.content > *:nth-child(1) .card-price')).toBeVisible()
})

test.describe('page width 899px', () => {
  test.use({ viewport: { width: 899, height: 720 } })

  test('content 2 cards/row', async ({ page }) => {
    const c1 = await getOffset(page, '.content > *:nth-child(1)')
    const c2 = await getOffset(page, '.content > *:nth-child(2)')
    const c3 = await getOffset(page, '.content > *:nth-child(3)')
    expect(c1.centerY).toBe(c2.centerY)
    expect(c1.centerX).toBe(c3.centerX)
  })
})

test.describe('page width 799px', () => {
  test.use({ viewport: { width: 799, height: 720 } })

  test('content 2 cards/row', async ({ page }) => {
    const c1 = await getOffset(page, '.content > *:nth-child(1)')
    const c2 = await getOffset(page, '.content > *:nth-child(2)')
    const c3 = await getOffset(page, '.content > *:nth-child(3)')
    expect(c1.centerY).toBe(c2.centerY)
    expect(c1.centerX).toBe(c3.centerX)
  })
})

test.describe('page width 699px', () => {
  test.use({ viewport: { width: 699, height: 720 } })

  test('content 2 cards/row', async ({ page }) => {
    const c1 = await getOffset(page, '.content > *:nth-child(1)')
    const c2 = await getOffset(page, '.content > *:nth-child(2)')
    const c3 = await getOffset(page, '.content > *:nth-child(3)')
    expect(c1.centerY).toBe(c2.centerY)
    expect(c1.centerX).toBe(c3.centerX)
  })
})

test.describe('page width 599px', () => {
  test.use({ viewport: { width: 699, height: 720 } })

  test('card image visible', async ({ page }) => {
    await expect(page.locator('.content > *:nth-child(1) .card-image')).toBeVisible()
  })

  test('card title visible', async ({ page }) => {
    await expectOneLine(page, '.card-title')
    await expect(page.locator('.content > *:nth-child(1) .card-title')).toBeVisible()
  })

  test('card price visible', async ({ page }) => {
    await expect(page.locator('.content > *:nth-child(1) .card-price')).toBeVisible()
  })
})


test.describe('page width 99px', () => {
  test.use({ viewport: { width: 99, height: 720 } })

  test('card title visible', async ({ page }) => {
    await expectOneLine(page, '.card-title')
  })
})
