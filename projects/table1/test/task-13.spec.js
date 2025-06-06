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

test('copy/paste selected cell', async ({ page }) => {
  const row1 = page.locator('.table tbody tr:nth-child(1)')
  const td = row1.locator('td:nth-child(1)')
  const text = new Date().getTime() + ''
  await td.dblclick()
  await td.clear()
  await td.fill(text)
  await page.keyboard.press('Escape')

  const cmd = getCmdKey()
  await page.keyboard.down(cmd)
  await page.keyboard.press('KeyC')
  await page.keyboard.up(cmd)

  await row1.locator('td:nth-child(2)').click()
  await page.keyboard.down(cmd)
  await page.keyboard.press('KeyV')
  await page.keyboard.up(cmd)

  await expect(row1.locator('td:nth-child(2)')).toHaveText(text)
})

test('copy/paste editing cell', async ({ page }) => {
  const row1 = page.locator('.table tbody tr:nth-child(1)')
  const td = row1.locator('td:nth-child(1)')
  const text = new Date().getTime() + ''
  await td.dblclick()
  await td.clear()
  await td.fill(text)

  const cmd = getCmdKey()
  await page.keyboard.down(cmd)
  await page.keyboard.press('KeyC')
  await page.keyboard.up(cmd)

  await row1.locator('td:nth-child(2)').click()
  await page.keyboard.down(cmd)
  await page.keyboard.press('KeyV')
  await page.keyboard.up(cmd)

  await expect(row1.locator('td:nth-child(2)')).not.toHaveText(text)
})
