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
  const offset = await getOffsetByLocator(page.locator('.jupiter'))
  await page.mouse.move(offset.centerX, offset.centerY)
  await page.locator('.jupiter').click()
})

test('satellite revolutions', async ({ page }) => {
  await expect(page.locator('animateMotion')).toHaveCount(5)
})

test('satellite revolution params', async ({ page }) => {
  await Promise.all(
    starData.bodies[4].bodies.map(async (body, i) => {
      const rev = page.locator('animateMotion').nth(i)
      await expect(rev).toHaveAttribute('dur', `${body.dur}s`)
      await expect(rev.locator('mpath')).toBeAttached()
      try {
        await expect(rev.locator('mpath')).toHaveAttribute('href', /#/i)
      } catch {
        await expect(rev.locator('mpath')).toHaveAttribute('xlink:href', /#/i)
      }
    })
  )
})

test('satellite revolution pause', async ({ page }) => {
  const satellite = page.locator('.satellite').nth(2)
  await page.waitForTimeout(500)
  const offset = await getOffsetByLocator(satellite)
  await page.mouse.move(offset.centerX, offset.centerY)

  const offset0 = await getOffsetByLocator(satellite)
  await page.waitForTimeout(500)
  const offset1 = await getOffsetByLocator(satellite)
  await expect(offset0.centerX).toBe(offset1.centerX)
  await expect(offset0.centerY).toBe(offset1.centerY)
})
