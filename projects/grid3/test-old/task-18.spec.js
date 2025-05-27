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

test('left-drag and right-drag', async ({ page }) => {
  await expect(page.locator('.left-drag')).toBeAttached()
  await expect(page.locator('.left-drag')).not.toBeVisible()
  await expect(page.locator('.right-drag')).toBeAttached()
  await expect(page.locator('.right-drag')).not.toBeVisible()
})

test('content hover', async ({ page }) => {
  await page.hover('.content')
  await expect(page.locator('.left-drag')).toBeVisible()
  await expect(page.locator('.right-drag')).toBeVisible()
})

test('content and drags style', async ({ page }) => {
  await expect(page.locator('.content')).toHaveCSS('position', /relative|absolute/)
  await expect(page.locator('.left-drag')).toHaveCSS('position', /absolute/)
  await expect(page.locator('.right-drag')).toHaveCSS('position', /absolute/)

  const style = await page.locator('.content').evaluate((el) => window.getComputedStyle(el))
  const borderLeftWidth = parseFloat(style.borderLeftWidth)
  const borderRightWidth = parseFloat(style.borderRightWidth)
  const content = await getOffset(page, '.content')
  const leftDrag = await getOffset(page, '.left-drag')
  const rightDrag = await getOffset(page, '.right-drag')
  expect(leftDrag.left).toBe(content.left + borderLeftWidth)
  expect(rightDrag.right).toBe(content.right - borderRightWidth)
})
