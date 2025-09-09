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

import { expect, test } from '@playwright/test'
import {
  expectTolerance,
  getComputedStyleByLocator,
  getOffsetByLocator,
} from '@web-bench/test-util'
import { data, getUnionRect, hasUniqueValues } from './util/util'

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
  await page.locator('#legends').uncheck()
  await page.locator('#legends').check()
})

test('LineChart | uncheck #legends', async ({ page }) => {
  await page.locator('#legends').uncheck()
  await expect(page.locator('.chart .legends')).not.toBeAttached()
})

test('LineChart | check #legends', async ({ page }) => {
  await page.locator('#legends').check()
  await page.waitForTimeout(500)
  const rect1 = await getOffsetByLocator(page.locator('.chart .datasets'))

  await page.locator('#legends').uncheck()
  await page.waitForTimeout(500)
  const rect2 = await getOffsetByLocator(page.locator('.chart .datasets'))

  await expect(rect1.height).toBeLessThan(rect2.height)
  await expect(rect1.width).toBeCloseTo(rect2.width)
})

test('LineChart | legends', async ({ page }) => {
  await expect(page.locator('.chart .legends')).toHaveCount(1)
  await expect(page.locator('.chart .legend')).toHaveCount(3)
  await expect(page.locator('.chart .legend-0')).toBeAttached()
  await expect(page.locator('.chart .legend-1')).toBeAttached()
  await expect(page.locator('.chart .legend-2')).toBeAttached()
})

test('LineChart | legend content', async ({ page }) => {
  const dot = page.locator('.chart .legend-0 circle')
  await page.waitForTimeout(500)
  const style = await getComputedStyleByLocator(page.locator('.chart .dataset-0'))

  await expect(dot).toBeAttached()

  await expect(dot).toHaveCSS('fill', style.stroke)
  await expect(page.locator('.chart .legend-0 text')).toHaveText(data.datasets[0].label)
  await expect(page.locator('.chart .legend-1 text')).toHaveText(data.datasets[1].label)
  await expect(page.locator('.chart .legend-2 text')).toHaveText(data.datasets[2].label)
})
