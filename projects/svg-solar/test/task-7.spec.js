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
  getComputedStyleByLocator,
  getOffsetByLocator,
  expectTolerance,
} = require('@web-bench/test-util')
const { starData, density } = require('./util/util')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
  const offset = await getOffsetByLocator(page.locator('.jupiter'))
  await page.mouse.move(offset.centerX, offset.centerY)
  await page.locator('.jupiter').click()
})

test('data', async ({ page }) => {
  const jupiter = starData.bodies[4]
  await expect(jupiter.bodies.length).toBe(5)
  const satellite = jupiter.bodies[0]
  await expect(satellite.rx).toBeGreaterThan(1)
  await expect(satellite.ry).toBeGreaterThan(1)
})

test('jump to planet-satellites', async ({ page }) => {
  await expect(page.locator('.star')).toHaveCount(0)
  await expect(page.locator('.planet')).toHaveCount(1)
  await expect(page.locator('.satellite')).toHaveCount(5)
})

test('jupiter layout', async ({ page }) => {
  await expect(page.locator('.jupiter')).toBeVisible()
  const jupiter = starData.bodies[4]
  await expect(page.locator('.jupiter')).toHaveAttribute('r', `${Math.max(jupiter.r, 8)}`)
  const offset = await getOffsetByLocator(page.locator('.jupiter'))
  await expect(offset).toMatchObject({ centerX: 80 * density, centerY: 80 * density })
})

test('orbit', async ({ page }) => {
  await expect(page.locator('path.orbit')).toHaveCount(5)
  const orbit = page.locator('path.orbit').nth(0)
  const body = starData.bodies[4].bodies[0]
  const style = await getComputedStyleByLocator(orbit)
  await expect(orbit).toHaveAttribute('id', `orbit_${body.name}`)
  await expect(style.stroke).toMatch('rgb(255, 255, 255)')
  await expect(style.fill).toMatch(/none|transparent/)
  await expect(style.strokeWidth).toMatch(`1px`)
})

test('orbit layout', async ({ page }) => {
  await Promise.all(
    starData.bodies[4].bodies.map(async (body, i) => {
      // console.log(i, body.name)
      const orbit = page.locator('path.orbit').nth(i)
      const offset = await getOffsetByLocator(orbit)
      await expectTolerance(offset.width, body.rx * 2 * density)
      await expectTolerance(offset.height, body.ry * 2 * density)
      await expectTolerance(offset.centerX, 80 * density)
      await expectTolerance(offset.centerY, 80 * density)
    })
  )
})

test('satellite attributes', async ({ page }) => {
  const satellite = page.locator('.satellite').nth(0)
  const body = starData.bodies[4].bodies[0]
  await expect(satellite).toHaveAttribute('r', `${body.r}`)
  await expect(satellite).toHaveAttribute('fill', `${body.color}`)
})

test('satellite layout', async ({ page }) => {
  await page.waitForTimeout(500)
  await Promise.all(
    starData.bodies[4].bodies.map(async (body, i) => {
      const satellite = page.locator('.satellite').nth(i)
      const offset = await getOffsetByLocator(satellite)
      await expectTolerance(offset.centerX, (80 + body.rx) * density, 20)
      await expectTolerance(offset.centerY, 80 * density, 20)
    })
  )
})
