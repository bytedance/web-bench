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
const { getCmdKey } = require('@web-bench/test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('copy/paste cells, same sizes', async ({ page }) => {
  const cmd = getCmdKey()
  // copy 2x2
  await page.locator('.table thead tr:nth-child(1) th:nth-child(1)').click()
  await page.keyboard.down('Shift')
  await page.locator('.table tbody tr:nth-child(1) td:nth-child(2)').click()
  await page.keyboard.up('Shift')
  await page.keyboard.down(cmd)
  await page.keyboard.press('KeyC')
  await page.keyboard.up(cmd)

  // extend table
  await page.locator('.table thead tr:nth-child(1) th:nth-child(3)').click({ button: 'right' })
  await page.locator('.menu-item-insert-col-right').click()
  await page.locator('.table tbody tr:nth-child(2) td:nth-child(3)').click({ button: 'right' })
  await page.locator('.menu-item-insert-row-below').click()

  // paste 2x2
  await page.locator('.table tbody tr:nth-child(2) td:nth-child(3)').click()
  await page.keyboard.down('Shift')
  await page.locator('.table tbody tr:nth-child(3) td:nth-child(4)').click()
  await page.keyboard.up('Shift')
  await page.keyboard.down(cmd)
  await page.keyboard.press('KeyV')
  await page.keyboard.up(cmd)

  // assertion
  await expect(page.locator('.table thead tr:nth-child(1) th:nth-child(1)')).toHaveText(
    (await page.locator('.table tbody tr:nth-child(2) td:nth-child(3)').textContent()) ?? ''
  )
  await expect(page.locator('.table thead tr:nth-child(1) th:nth-child(2)')).toHaveText(
    (await page.locator('.table tbody tr:nth-child(2) td:nth-child(4)').textContent()) ?? ''
  )
  await expect(page.locator('.table tbody tr:nth-child(1) td:nth-child(1)')).toHaveText(
    (await page.locator('.table tbody tr:nth-child(3) td:nth-child(3)').textContent()) ?? ''
  )
  await expect(page.locator('.table tbody tr:nth-child(1) td:nth-child(2)')).toHaveText(
    (await page.locator('.table tbody tr:nth-child(3) td:nth-child(4)').textContent()) ?? ''
  )
})

test('copy/paste cells, different sizes', async ({ page }) => {
  const cmd = getCmdKey()
  // copy 2x2
  await page.locator('.table thead tr:nth-child(1) th:nth-child(1)').click()
  await page.keyboard.down('Shift')
  await page.locator('.table tbody tr:nth-child(1) td:nth-child(2)').click()
  await page.keyboard.up('Shift')
  await page.keyboard.down(cmd)
  await page.keyboard.press('KeyC')
  await page.keyboard.up(cmd)

  // paste 1x1
  await page.locator('.table tbody tr:nth-child(2) td:nth-child(3)').click()
  await page.keyboard.down(cmd)
  await page.keyboard.press('KeyV')
  await page.keyboard.up(cmd)

  // assertion
  await expect(page.locator('.table thead tr:nth-child(1) th:nth-child(1)')).toHaveText(
    (await page.locator('.table tbody tr:nth-child(2) td:nth-child(3)').textContent()) ?? ''
  )
  await expect(page.locator('.table thead tr:nth-child(1) th:nth-child(2)')).toHaveText(
    (await page.locator('.table tbody tr:nth-child(2) td:nth-child(4)').textContent()) ?? ''
  )
  await expect(page.locator('.table tbody tr:nth-child(1) td:nth-child(1)')).toHaveText(
    (await page.locator('.table tbody tr:nth-child(3) td:nth-child(3)').textContent()) ?? ''
  )
  await expect(page.locator('.table tbody tr:nth-child(1) td:nth-child(2)')).toHaveText(
    (await page.locator('.table tbody tr:nth-child(3) td:nth-child(4)').textContent()) ?? ''
  )
})

test('copy/paste cells, different sizes 2', async ({ page }) => {
  const cmd = getCmdKey()
  // copy 2x2
  await page.locator('.table thead tr:nth-child(1) th:nth-child(1)').click()
  await page.keyboard.down('Shift')
  await page.locator('.table tbody tr:nth-child(1) td:nth-child(2)').click()
  await page.keyboard.up('Shift')
  await page.keyboard.down(cmd)
  await page.keyboard.press('KeyC')
  await page.keyboard.up(cmd)

  // paste 1x1
  await page.locator('.table tbody tr:nth-child(2) td:nth-child(2)').click()
  await page.keyboard.down('Shift')
  await page.locator('.table tbody tr:nth-child(2) td:nth-child(3)').click()
  await page.keyboard.up('Shift')
  await page.keyboard.down(cmd)
  await page.keyboard.press('KeyV')
  await page.keyboard.up(cmd)

  // assertion
  await expect(page.locator('.table thead tr:nth-child(1) th:nth-child(1)')).toHaveText(
    (await page.locator('.table tbody tr:nth-child(2) td:nth-child(2)').textContent()) ?? ''
  )
  await expect(page.locator('.table thead tr:nth-child(1) th:nth-child(2)')).toHaveText(
    (await page.locator('.table tbody tr:nth-child(2) td:nth-child(3)').textContent()) ?? ''
  )
  await expect(page.locator('.table tbody tr:nth-child(1) td:nth-child(1)')).toHaveText(
    (await page.locator('.table tbody tr:nth-child(3) td:nth-child(2)').textContent()) ?? ''
  )
  await expect(page.locator('.table tbody tr:nth-child(1) td:nth-child(2)')).toHaveText(
    (await page.locator('.table tbody tr:nth-child(3) td:nth-child(3)').textContent()) ?? ''
  )
})
