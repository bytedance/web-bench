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
const { getOffsetByLocator, isExisted } = require('@web-bench/test-util')
const path = require('path')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('common/drag.js', async ({ page }) => {
  await expect(isExisted('common/drag.js', path.join(__dirname, '../src'))).toBeTruthy()
})

test('drag the selected row to other row bottom half', async ({ page }) => {
  const td22 = page.locator('.table tbody tr:nth-child(1) td:nth-child(2)')
  const td32 = page.locator('.table tbody tr:nth-child(2) td:nth-child(2)')
  const text = new Date().getTime() + ''

  // edit
  await td22.dblclick()
  await td22.clear()
  await td22.fill(text)
  await page.keyboard.press('Escape')
  await expect(td22).toHaveText(text)
  // select row
  await td22.click({ button: 'right' })
  await page.locator('.menu-item-select-row').click()

  // move rows
  const offset22 = await getOffsetByLocator(td22)
  const offset32 = await getOffsetByLocator(td32)
  await page.mouse.move(offset22.centerX, offset22.centerY, { steps: 10 })
  await page.mouse.down()
  // step @see https://github.com/microsoft/playwright/issues/22856#issuecomment-1538765230
  await page.mouse.move(offset32.centerX, offset32.centerY + 1, { steps: 10 })
  await page.mouse.up()

  await expect(td32).toHaveText(text)
})

test('drag the selected row to other row top half', async ({ page }) => {
  const td22 = page.locator('.table tbody tr:nth-child(1) td:nth-child(2)')
  const td32 = page.locator('.table tbody tr:nth-child(2) td:nth-child(2)')
  const text = new Date().getTime() + ''
  // console.log({ offset22, offset32 })

  // edit
  await td22.dblclick()
  await td22.clear()
  await td22.fill(text)
  await page.keyboard.press('Escape')
  await expect(td22).toHaveText(text)
  // select row
  await td32.click({ button: 'right' })
  await page.locator('.menu-item-select-row').click()

  // replace td22 and td32
  const offset22 = await getOffsetByLocator(td22)
  const offset32 = await getOffsetByLocator(td32)
  await page.mouse.move(offset32.centerX, offset32.centerY, { steps: 10 })
  await page.mouse.down()
  // step @see https://github.com/microsoft/playwright/issues/22856#issuecomment-1538765230
  await page.mouse.move(offset22.centerX, offset22.centerY - 1, { steps: 10 })
  await page.mouse.up()

  await expect(td32).toHaveText(text)
})

test('can not drag the selected row to thead section', async ({ page }) => {
  const th12 = page.locator('.table thead tr:nth-child(1) th:nth-child(2)')
  const td22 = page.locator('.table tbody tr:nth-child(1) td:nth-child(2)')
  const text = new Date().getTime() + ''
  // console.log({ offset22, offset32 })

  // edit
  await td22.dblclick()
  await td22.clear()
  await td22.fill(text)
  await page.keyboard.press('Escape')
  await expect(td22).toHaveText(text)
  // select row
  await td22.click({ button: 'right' })
  await page.locator('.menu-item-select-row').click()

  // replace td22 and td32
  const offset12 = await getOffsetByLocator(th12)
  const offset22 = await getOffsetByLocator(td22)
  await page.mouse.move(offset22.centerX, offset22.centerY, { steps: 10 })
  await page.mouse.down()
  // step @see https://github.com/microsoft/playwright/issues/22856#issuecomment-1538765230
  await page.mouse.move(offset12.centerX, offset12.centerY - 1, { steps: 10 })
  await page.mouse.up()

  await expect(page.locator('.table thead tr:nth-child(1) td:nth-child(2)')).not.toBeAttached()
})


test('can not drag the row with any unselected cells', async ({ page }) => {
  const td22 = page.locator('.table tbody tr:nth-child(1) td:nth-child(2)')
  const td32 = page.locator('.table tbody tr:nth-child(2) td:nth-child(2)')
  const text = new Date().getTime() + ''

  // edit
  await td22.dblclick()
  await td22.clear()
  await td22.fill(text)
  await page.keyboard.press('Escape')
  await expect(td22).toHaveText(text)
  await expect(td22).toHaveClass(/selected/i)

  // move rows
  const offset22 = await getOffsetByLocator(td22)
  const offset32 = await getOffsetByLocator(td32)
  await page.mouse.move(offset22.centerX, offset22.centerY, { steps: 10 })
  await page.mouse.down()
  // step @see https://github.com/microsoft/playwright/issues/22856#issuecomment-1538765230
  await page.mouse.move(offset32.centerX, offset32.centerY + 1, { steps: 10 })
  await page.mouse.up()

  await expect(td32).not.toHaveText(text)
  await expect(td22).toHaveText(text)
})