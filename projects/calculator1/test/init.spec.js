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

// @ts-check
const { test, expect } = require('@playwright/test')
const { getOffset, expectTolerance } = require('@web-bench/test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('check all buttons', async ({ page }) => {
  await expect(page.locator('button:text("0")').first()).toBeVisible()
  await expect(page.locator('button:text("1")').first()).toBeVisible()
  await expect(page.locator('button:text("2")').first()).toBeVisible()
  await expect(page.locator('button:text("3")').first()).toBeVisible()
  await expect(page.locator('button:text("4")').first()).toBeVisible()
  await expect(page.locator('button:text("5")').first()).toBeVisible()
  await expect(page.locator('button:text("6")').first()).toBeVisible()
  await expect(page.locator('button:text("7")').first()).toBeVisible()
  await expect(page.locator('button:text("8")').first()).toBeVisible()
  await expect(page.locator('button:text("9")').first()).toBeVisible()
  await expect(page.locator('button:text("+")').first()).toBeVisible()
  await expect(page.locator('button:text("-")').first()).toBeVisible()
  await expect(page.locator('button:text("*")').first()).toBeVisible()
  await expect(page.locator('button:text("/")').first()).toBeVisible()
  await expect(page.locator('button:text(".")').first()).toBeVisible()
  await expect(page.locator('button:text("=")').first()).toBeVisible()
  await expect(page.locator('button:text("Clear")')).toBeVisible()
  await expect(page.locator('input#display')).toBeVisible()
})

test('check #display & Clear at the top', async ({ page }) => {
  const display = await getOffset(page, '#display')
  const button7 = await getOffset(page, 'button:text("7")')
  const buttonMulti = await getOffset(page, 'button:text("*")')
  const button0 = await getOffset(page, 'button:text("0")')
  const buttonClear = await getOffset(page, 'button:text("Clear")')

  // display at top
  expect(display.top).toBeLessThan(button7.top)
  expect(display.top).toBeLessThan(buttonMulti.top)
  expect(display.top).toBeLessThan(button0.top)
  expect(display.top).toBeLessThan(buttonClear.top)

  // Clear at bottom
  expect(buttonClear.top).toBeGreaterThan(button7.top)
  expect(buttonClear.top).toBeGreaterThan(buttonMulti.top)
  expect(buttonClear.top).toBeGreaterThan(button0.top)
})

test('1 + 2 =', async ({ page }) => {
  await page.click('button:text("1")')
  await page.click('button:text("+")')
  await page.click('button:text("2")')
  await page.click('button:text("=")')

  await expect(page.locator('#display')).toHaveValue('3')
})

test('2 * 3 =', async ({ page }) => {
  await page.click('button:text("2")')
  await page.click('button:text("*")')
  await page.click('button:text("3")')
  await page.click('button:text("=")')

  await expect(page.locator('#display')).toHaveValue('6')
})

test('6 / 2 =', async ({ page }) => {
  await page.click('button:text("6")')
  await page.click('button:text("/")')
  await page.click('button:text("2")')
  await page.click('button:text("=")')

  await expect(page.locator('#display')).toHaveValue('3')
})

test('5 - 3 =', async ({ page }) => {
  await page.click('button:text("5")')
  await page.click('button:text("-")')
  await page.click('button:text("3")')
  await page.click('button:text("=")')

  await expect(page.locator('#display')).toHaveValue('2')
})

test('1 2 3  Clear', async ({ page }) => {
  await page.click('button:text("1")')
  await page.click('button:text("2")')
  await page.click('button:text("3")')
  await page.click('button:text("Clear")')

  await expect(page.locator('#display')).toHaveValue('')
})

test('Decimal calculation 1.5 + 2.5 = 4', async ({ page }) => {
  await page.click('button:text("1")')
  await page.click('button:text(".")')
  await page.click('button:text("5")')
  await page.click('button:text("+")')
  await page.click('button:text("2")')
  await page.click('button:text(".")')
  await page.click('button:text("5")')
  await page.click('button:text("=")')

  await expect(page.locator('#display')).toHaveValue('4')
})

test('Error handling - invalid expression', async ({ page }) => {
  await page.click('button:text("1")')
  await page.click('button:text("+")')
  await page.click('button:text("+")')
  await page.click('button:text("2")')
  await page.click('button:text("=")')

  await expect(page.locator('#display')).toHaveValue('Error')
})

test('Error handling - division by zero', async ({ page }) => {
  await page.click('button:text("5")')
  await page.click('button:text("/")')
  await page.click('button:text("0")')
  await page.click('button:text("=")')

  await expect(page.locator('#display')).toHaveValue('Infinity')
})

test('Error handling - multiple decimal points', async ({ page }) => {
  await page.click('button:text("1")')
  await page.click('button:text(".")')
  await page.click('button:text("2")')
  await page.click('button:text(".")')
  await page.click('button:text("3")')
  await page.click('button:text("=")')

  await expect(page.locator('#display')).toHaveValue('Error')
})

test('Error handling - incomplete expression', async ({ page }) => {
  await page.click('button:text("5")')
  await page.click('button:text("+")')
  await page.click('button:text("=")')

  await expect(page.locator('#display')).toHaveValue('Error')
})

test('Error handling - consecutive operators', async ({ page }) => {
  await page.click('button:text("5")')
  await page.click('button:text("+")')
  await page.click('button:text("-")')
  await page.click('button:text("*")')
  await page.click('button:text("3")')
  await page.click('button:text("=")')

  await expect(page.locator('#display')).toHaveValue('Error')
})

test('Error handling - starting with operator', async ({ page }) => {
  await page.click('button:text("*")')
  await page.click('button:text("5")')
  await page.click('button:text("=")')

  await expect(page.locator('#display')).toHaveValue('Error')
})

test('Error handling - empty expression', async ({ page }) => {
  await page.click('button:text("=")')

  await expect(page.locator('#display')).toHaveValue('Error')
})

test('Error handling - expression ending with operator', async ({ page }) => {
  await page.click('button:text("5")')
  await page.click('button:text("+")')
  await page.click('button:text("3")')
  await page.click('button:text("-")')
  await page.click('button:text("=")')

  await expect(page.locator('#display')).toHaveValue('Error')
})

test('Error handling - overflow numbers', async ({ page }) => {
  await page.click('button:text("9")')
  for (let i = 0; i < 20; i++) {
    await page.click('button:text("9")')
  }
  await page.click('button:text("*")')
  await page.click('button:text("9")')
  await page.click('button:text("=")')

  const display = await page.locator('#display')
  const value = await display.inputValue()
  await expect(value.includes('e')).toBeTruthy() // Should return scientific notation
})
