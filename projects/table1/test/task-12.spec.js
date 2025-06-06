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
const path = require('path')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('press enter to edit the selected cell', async ({ page }) => {
  const row1 = page.locator('.table tbody tr:nth-child(1)')
  const td = row1.locator('td:nth-child(1)')
  await td.click()
  await page.keyboard.press('Enter')

  await expect(td).toHaveAttribute('contenteditable', /true/i)
  const text = new Date().getTime() + ''
  await td.clear()
  await td.fill(text)
  await expect(td).toHaveText(text)
})

test('press escape to change editable to selected', async ({ page }) => {
  const row1 = page.locator('.table tbody tr:nth-child(1)')
  const td = row1.locator('td:nth-child(1)')
  await td.click()
  await expect(td).toHaveClass('selected')

  await page.keyboard.press('Enter')
  await expect(td).toHaveClass('selected')
  await expect(td).toHaveAttribute('contenteditable', /true/i)

  await page.keyboard.press('Escape')
  await expect(td).toHaveClass('selected')
  await expect(td).not.toHaveAttribute('contenteditable', /true/i)
})
