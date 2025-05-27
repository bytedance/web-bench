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

test('.header grid', async ({ page }) => {
  const style = await getComputedStyle(page, '.header')
  expect(style.display).toBe('grid')
  // await expect(page.locator('.header')).toHaveCSS('grid-template-columns', /fr/)
  // expect(style.gridTemplateColumns.includes('fr')).toBeTruthy()
})

test('.menu grid', async ({ page }) => {
  const style = await getComputedStyle(page, '.menu')
  expect(style.display).toBe('grid')
})

test('.menu items', async ({ page }) => {
  await expect(page.locator('.menu > *:nth-child(1)')).toBeVisible()
  await expect(page.locator('.menu > *:nth-child(2)')).toBeVisible()
  await expect(page.locator('.menu > *:nth-child(3)')).toBeVisible()
})

test('.menu has 3 items', async ({ page }) => {
  await expect(page.locator('.menu > *')).toHaveCount(3)
})

test('.menu item3 position', async ({ page }) => {
  const offset = await getOffset(page, '.menu > *:nth-child(3)')
  const bodyWidth = (await getOffset(page, 'body')).width
  expect(offset.centerX / bodyWidth).toBeGreaterThan(0.5)
})
