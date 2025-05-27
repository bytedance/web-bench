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
  expectTolerance,
} = require('@web-bench/test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('.leftbar .rightbar visible', async ({ page }) => {
  await expect(page.locator('.leftbar')).toBeVisible()
  await expect(page.locator('.rightbar')).toBeVisible()
})

test('.leftbar fixed left', async ({ page }) => {
  const offset = await getOffset(page, '.leftbar')
  // const body = await getOffset(page, 'body')
  expect(offset.left).toEqual(0)
  // expect(offset.width).toEqual(Math.min(200, body.width * 0.2)) // 200
})

test('.rightbar fixed right', async ({ page }) => {
  const offset = await getOffset(page, '.rightbar')
  const body = await getOffset(page, 'body')
  expect(offset.right).toEqual(body.width)
  // expect(offset.width).toBeCloseTo(Math.max(200, body.width * 0.2)) // 256
})

test('.content uses remaining width', async ({ page }) => {
  const leftbar = await getOffset(page, '.leftbar')
  const rightbar = await getOffset(page, '.rightbar')
  const content = await getOffset(page, '.content')
  const body = await getOffset(page, 'body')
  expectTolerance(leftbar.width + rightbar.width + content.width, body.width, 1)
})
