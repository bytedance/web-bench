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
import { getUnionRect, hasUniqueValues, data, TO } from './util/util'

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
  await page.locator('#axes').uncheck()
  await page.locator('#axes').check()
  await page.waitForTimeout(TO)
  await expect(page.locator('svg.chart.line')).toBeAttached()
})

test('LineChart | check #axes', async ({ page }) => {
  await page.locator('#axes').check()
  const rect1 = await getOffsetByLocator(page.locator('.chart .datasets'))
  const rect2 = await getOffsetByLocator(page.locator('.chart'))

  await expectTolerance(rect1.width, rect2.width, 15)
})

test('LineChart | check/uncheck #axes', async ({ page }) => {
  await page.locator('#axes').check()
  await page.waitForTimeout(500)
  const rect1 = await getOffsetByLocator(page.locator('.chart .datasets'))

  await page.locator('#axes').uncheck()
  await page.waitForTimeout(500)
  const rect2 = await getOffsetByLocator(page.locator('.chart .datasets'))

  await expect(rect1.width).toBeLessThan(rect2.width)
  await expect(rect1.height).toBeLessThan(rect2.height)
})

test('Chart', async ({ page }) => {
  await expect(page.locator(`svg.chart`)).toBeAttached()

  await expect(await page.locator(`svg.chart.line`).count()).toBeGreaterThanOrEqual(1)

  await expect(page.locator(`.chart`)).toHaveAttribute('viewBox', '0 0 100 70')
})

test('LineChart | polylines', async ({ page }) => {
  await expect(page.locator('.chart polyline.dataset')).toHaveCount(3)
  await expect(page.locator('.chart .dataset-0')).toBeVisible()
  await expect(page.locator('.chart .dataset-1')).toBeVisible()
  await expect(page.locator('.chart .dataset-2')).toBeVisible()
})

test('LineChart | line colors', async ({ page }) => {
  const lines = await page.locator('.chart polyline.dataset').all()
  const strokes = []
  for await (const line of lines) {
    const style = await getComputedStyleByLocator(line)
    strokes.push(style.stroke)
  }

  await expect(hasUniqueValues(strokes)).toBeTruthy()
})

test('LineChart | axes, axes-x, axes-y', async ({ page }) => {
  await page.locator('#axes').check()
  await expect(page.locator('.chart .axes')).toHaveCount(2)
  await expect(page.locator('.chart .axes.axes-x .axis-x')).toHaveCount(1)
  await expect(page.locator('.chart .axis-x')).toBeAttached()
  let style = await getComputedStyleByLocator(page.locator('.chart .axis-x'))
  await expect(style.stroke).not.toBe('none')

  await expect(page.locator('.chart .axes.axes-y .axis-y')).toHaveCount(1)
  style = await getComputedStyleByLocator(page.locator('.chart .axis-y'))
  await expect(style.stroke).not.toBe('none')
})

test('LineChart | axes-x labels', async ({ page }) => {
  await expect(page.locator('.chart .axes-x')).toBeAttached()
  await expect(page.locator('.chart .axes-x .label')).toHaveCount(5)
  let i = 0
  for await (const labelText of data.labels) {
    const label = page.locator(`.chart .axes-x .label-${i}`)
    await expect(label).toHaveText(labelText)
    const style = await getComputedStyleByLocator(label)
    await expect(style.fill).not.toBe('none')
    i++
  }
})

test('LineChart | axes-x labels layout', async ({ page }) => {
  const offset0 = await getOffsetByLocator(page.locator(`.chart .axes-x .label-0`))
  const offset4 = await getOffsetByLocator(page.locator(`.chart .axes-x .label-4`))

  await expect(offset0.centerX < offset4.centerX).toBeTruthy()
})

test('LineChart | axes-y labels', async ({ page }) => {
  await expect(page.locator('.chart .axes-y')).toBeAttached()
  await expect(page.locator('.chart .axes-y .label')).toHaveCount(6)
  const values = data.datasets.flatMap((d) => d.data)
  const y0 = parseFloat((await page.locator('.chart .axes-y .label-0').textContent()) ?? '0')
  await expect(y0).toBeCloseTo(Math.min(...values))
  const y5 = parseFloat((await page.locator('.chart .axes-y .label-5').textContent()) ?? '0')
  await expect(y5).toBeCloseTo(Math.max(...values))
  const style = await getComputedStyleByLocator(page.locator('.chart .axes-y .label-5'))
  await expect(style.fill).not.toBe('none')
})

test('LineChart | axes-y labels layout', async ({ page }) => {
  const offset0 = await getOffsetByLocator(page.locator(`.chart .axes-y .label-0`))
  const offset5 = await getOffsetByLocator(page.locator(`.chart .axes-y .label-5`))

  await expect(offset0.centerY > offset5.centerY).toBeTruthy()
})
