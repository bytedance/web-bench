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

test('cards order', async ({ page }) => {
  const card11 = await getComputedStyle(page, '.content > .card:nth-child(11)')
  const card12 = await getComputedStyle(page, '.content > .card:nth-child(12)')
  expect(parseFloat(card11.order)).toBeGreaterThan(parseFloat(card12.order))
})

test('cards position', async ({ page }) => {
  const card11 = await getOffset(page, '.content > .card:nth-child(11)')
  const card12 = await getOffset(page, '.content > .card:nth-child(12)')

  expect(card11.centerX).toBeGreaterThan(card12.centerX)
})
