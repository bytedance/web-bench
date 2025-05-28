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

test('.toolkit shapes', async ({ page }) => {
  await expect(page.locator('.toolkit .line')).toBeVisible()
  await expect(page.locator('.toolkit .rect')).toBeVisible()
  await expect(page.locator('.toolkit .ellipse')).toBeVisible()
})

test('.toolkit operations', async ({ page }) => {
  await expect(page.locator('.toolkit .move')).toBeVisible()
  await expect(page.locator('.toolkit .rotate')).toBeVisible()
  await expect(page.locator('.toolkit .zoom')).toBeVisible()
  await expect(page.locator('.toolkit .copy')).toBeVisible()
  await expect(page.locator('.toolkit .delete')).toBeVisible()
  await expect(page.locator('.toolkit .fill')).toBeVisible()
})

test('.toolkit check', async ({ page }) => {
  // await expect(page.locator('input[name="operation"]:checked')).not.toBeAttached()

  await page.locator('.rect').click()
  await expect(page.locator('input[name="operation"]:checked')).toHaveValue('rect')

  await page.locator('.rotate').click()
  await expect(page.locator('input[name="operation"]:checked')).toHaveValue('rotate')
})
