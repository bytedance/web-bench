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

test.describe('page width 399px', () => {
  test.use({ viewport: { width: 399, height: 720 } })

  test('right-drag', async ({ page }) => {
    await expect(page.locator('.right-drag')).toBeAttached()
    await expect(page.locator('.right-drag')).not.toBeVisible()
  })

  test('content hover', async ({ page }) => {
    await page.hover('.content')
    await expect(page.locator('.right-drag')).toBeVisible()
  })

  test('content and drags style', async ({ page }) => {
    const rightDrag = await getOffset(page, '.right-drag')
    const content = await getOffset(page, '.content')
    const style = await getComputedStyle(page, '.content')
    expect(rightDrag.bottom).toBe(content.bottom - parseFloat(style.borderBottomWidth))
  })

  test('right-drag ⬆', async ({ page }) => {
    await page.locator('.content').hover()
    await page.locator('.right-drag').hover()
    const initialOffset = await getOffset(page, '.rightbar')

    // drag
    await page.mouse.down()
    await page.mouse.move(0, initialOffset.top - initialOffset.height / 2)
    await page.mouse.move(0, initialOffset.top - initialOffset.height / 4)
    await page.mouse.move(0, initialOffset.top - initialOffset.height / 8)
    await page.mouse.up()
    const finalOffset = await getOffset(page, '.rightbar')
    expect(initialOffset.height).toBeLessThan(finalOffset.height)
  })

  test('right-drag ⬇', async ({ page }) => {
    await page.locator('.content').hover()
    await page.locator('.right-drag').hover()
    const initialOffset = await getOffset(page, '.rightbar')

    // drag
    await page.mouse.down()
    await page.mouse.move(0, initialOffset.top + initialOffset.height / 2)
    await page.mouse.move(0, initialOffset.top + initialOffset.height / 4)
    await page.mouse.move(0, initialOffset.top + initialOffset.height / 8)
    await page.mouse.up()
    const finalOffset = await getOffset(page, '.rightbar')
    expect(initialOffset.height).toBeGreaterThan(finalOffset.height)
  })
})
