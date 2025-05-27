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

test('.root grid', async ({ page }) => {
  const style = await getComputedStyle(page, '.root')
  expect(style.display).toBe('grid')
})

test('.header .footer .content visible', async ({ page }) => {
  await expect(page.locator('.header')).toBeVisible()
  await expect(page.locator('.footer')).toBeVisible()
  await expect(page.locator('.content')).toBeVisible()
})

test('.header fixed top', async ({ page }) => {
  const offset = await getOffset(page, '.header')
  expect(offset.top).toEqual(0)
  expect(offset.left).toEqual(0)
})

test('.footer fixed bottom', async ({ page }) => {
  const offset = await getOffset(page, '.footer')
  const bodyHeight = (await getOffset(page, 'body')).height
  expect(offset.left).toEqual(0)
  expect(offset.bottom).toEqual(bodyHeight)
})

test('.content uses remaining height', async ({ page }) => {
  const header = await getOffset(page, '.header')
  const footer = await getOffset(page, '.footer')
  const content = await getOffset(page, '.content')
  const body = await getOffset(page, 'body')
  expectTolerance(header.height + footer.height + content.height, body.height, 1)
})
