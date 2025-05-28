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
const { getOffsetByLocator } = require('../../../libraries/test-util/src')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('.toolkit', async ({ page }) => {
  await expect(page.locator('.toolkit')).toBeAttached()
})

test('.canvas', async ({ page }) => {
  await expect(page.locator('svg.canvas')).toBeAttached()
})

test('.shape', async ({ page }) => {
  await expect(page.locator('.toolkit .shape')).toBeAttached()
})

test('.operation', async ({ page }) => {
  await expect(page.locator('.toolkit .operation')).toBeAttached()
})

test('.prop', async ({ page }) => {
  await expect(page.locator('.toolkit .prop')).toBeAttached()
})

test('.line-width', async ({ page }) => {
  await expect(page.locator('.prop .line-width')).toBeVisible()
  await expect(page.locator('.line-width')).toHaveValue('9')
  await expect(page.locator('.line-width')).toHaveAttribute('max', '21')
  await expect(page.locator('.line-width')).toHaveAttribute('min', '1')
})

test('.color', async ({ page }) => {
  await expect(page.locator('.prop .color')).toBeVisible()
  await expect(page.locator('.color')).toHaveValue('#000000')
})