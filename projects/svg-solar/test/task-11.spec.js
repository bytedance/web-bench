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
const { expectTolerance, getOffsetByLocator } = require('@web-bench/test-util')
const { starData, density } = require('./util/util')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('detailPanel', async ({ page }) => {
  await expect(page.locator('foreignObject#detailPanel')).toBeVisible()
})

test('detailPanel | default star', async ({ page }) => {
  const detail = page.locator('#detailPanel')
  await expect(detail).toContainText(/star/i)
  await expect(detail).toContainText(/sun/i)
  await expect(detail.getByText('earth')).toBeVisible()
  await expect(detail.getByText('jupiter')).toBeVisible()
})

test('detailPanel | star | hover', async ({ page }) => {
  const offset = await getOffsetByLocator(page.locator('.jupiter'))
  await page.mouse.move(offset.centerX, offset.centerY)

  const detail = page.locator('#detailPanel')
  await expect(detail).toContainText(/planet/i)
  await expect(detail).toContainText(/jupiter/i)
  await expect(detail.getByText('europa')).toBeVisible()
  await expect(detail.getByText('callisto')).toBeVisible()
})

test('detailPanel | default planet', async ({ page }) => {
  const offset = await getOffsetByLocator(page.locator('.jupiter'))
  await page.mouse.move(offset.centerX, offset.centerY)
  await page.locator('.jupiter').click()

  await expect(page.locator('foreignObject#detailPanel')).toBeVisible()

  const detail = page.locator('#detailPanel')
  await expect(detail).toContainText(/planet/i)
  await expect(detail).toContainText(/jupiter/i)
  await expect(detail.getByText('europa')).toBeVisible()
  await expect(detail.getByText('callisto')).toBeVisible()
})

test('detailPanel | planet | hover', async ({ page }) => {
  const offset = await getOffsetByLocator(page.locator('.jupiter'))
  await page.mouse.move(offset.centerX, offset.centerY)
  await page.locator('.jupiter').click()

  await page.waitForTimeout(500)
  const offset1 = await getOffsetByLocator(page.locator('.europa'))
  await page.mouse.move(offset1.centerX, offset1.centerY)

  const detail = page.locator('#detailPanel')
  await expect(detail).toContainText(/satellite/i)
  await expect(detail).toContainText(/europa/i)
})
