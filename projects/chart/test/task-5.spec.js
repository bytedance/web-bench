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
  await page.locator('#dataLabels').check()
})

test('LineChart | uncheck #dataLabels', async ({ page }) => {
  await page.locator('#dataLabels').uncheck()
  await page.waitForTimeout(500)
  await expect(page.locator('.chart .dataLabels')).not.toBeAttached()
})

test('LineChart | check #dataLabels', async ({ page }) => {
  await page.locator('#dataLabels').check()
  await expect(page.locator('.chart .dataLabels')).toHaveCount(3)
})

test('LineChart | dataLabels', async ({ page }) => {
  await expect(page.locator('.chart .dataLabels')).toHaveCount(3)
  await expect(page.locator('.chart .dataLabels-0 .dataLabel')).toHaveCount(5)
  await expect(page.locator('.chart .dataLabels-0 .dataLabel-0')).toBeVisible()
  await expect(page.locator('.chart .dataLabels-0 .dataLabel-4')).toBeVisible()

  await expect(page.locator('#line .dataLabels')).toHaveCount(0)
})

test('LineChart | dataLabels color', async ({ page }) => {
  await page.waitForTimeout(1000)
  for await (const [i, dataset] of Object.entries(data.datasets)) {
    const line = page.locator(`.chart .dataset-${i}`)
    const lineStyle = await getComputedStyleByLocator(line)
    for await (const [j, item] of Object.entries(dataset.data)) {
      const dataLabel = page.locator(`.chart .dataLabels-${i} .dataLabel-${j}`)
      await expect(dataLabel).toHaveCSS('fill', lineStyle.stroke)
    }
  }
})

test('LineChart | dataLabels layout', async ({ page }) => {
  for await (const [i, dataset] of Object.entries(data.datasets)) {
    const dataLabelsRect = await getOffsetByLocator(
      page.locator(`.chart .dataLabels-${i}`)
    )
    const lineRect = await getOffsetByLocator(page.locator(`.chart .dataset-${i}`))
    await expectTolerance(dataLabelsRect.centerX, lineRect.centerX, 10)
    await expectTolerance(dataLabelsRect.centerY, lineRect.centerY, 20)
  }
})
