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

test('filter menu-item', async ({ page }) => {
  const th11 = page.locator('.table thead tr:nth-child(1) th:nth-child(1)')
  await th11.click({ button: 'right' })
  await expect(page.locator('.menu-item-filter')).toBeVisible()
  await page.locator('.menu-item-filter').click()
  await expect(page.locator('.menu-item-filter')).toBeHidden()
})

test('filter menu-item normal', async ({ page }) => {
  const th11 = page.locator('.table thead tr:nth-child(1) th:nth-child(1)')
  // prepare data
  const td21 = page.locator('.table tbody tr:nth-child(1) td:nth-child(1)')
  const td31 = page.locator('.table tbody tr:nth-child(2) td:nth-child(1)')
  await td21.dblclick()
  await td21.clear()
  await td21.fill('2')
  await td31.dblclick()
  await td31.clear()
  await td31.fill('3')
  await page.keyboard.press('Escape')

  page.on('dialog', async (dialog) => {
    if (dialog.type() === 'prompt') {
      await dialog.accept('2')
    }
  })

  // filter
  await th11.click({ button: 'right' })
  await page.locator('.menu-item-filter').click()
  await expect(td21).toBeVisible()
  await expect(td31).not.toBeVisible()
})

test('filter menu-item not found', async ({ page }) => {
  const th11 = page.locator('.table thead tr:nth-child(1) th:nth-child(1)')
  // prepare data
  const td21 = page.locator('.table tbody tr:nth-child(1) td:nth-child(1)')
  const td31 = page.locator('.table tbody tr:nth-child(2) td:nth-child(1)')
  await td21.dblclick()
  await td21.clear()
  await td21.fill('2')
  await td31.dblclick()
  await td31.clear()
  await td31.fill('3')
  await page.keyboard.press('Escape')

  page.on('dialog', async (dialog) => {
    if (dialog.type() === 'prompt') {
      await dialog.accept('xyzxyz')
    }
  })

  // filter
  await th11.click({ button: 'right' })
  await page.locator('.menu-item-filter').click()
  await expect(th11).toBeVisible()
  await expect(td21).not.toBeVisible()
  await expect(td31).not.toBeVisible()
})

test('filter menu-item restore', async ({ page }) => {
  const th11 = page.locator('.table thead tr:nth-child(1) th:nth-child(1)')
  // prepare data
  const td21 = page.locator('.table tbody tr:nth-child(1) td:nth-child(1)')
  const td31 = page.locator('.table tbody tr:nth-child(2) td:nth-child(1)')
  await td21.dblclick()
  await td21.clear()
  await td21.fill('2')
  await td31.dblclick()
  await td31.clear()
  await td31.fill('3')
  await page.keyboard.press('Escape')

  const words = ['2', '']
  let index = 0
  page.on('dialog', async (dialog) => {
    if (dialog.type() === 'prompt') {
      await dialog.accept(words[index++])
    }
  })

  // filter
  await th11.click({ button: 'right' })
  await page.locator('.menu-item-filter').click()
  await expect(td21).toBeVisible()
  await expect(td31).not.toBeVisible()
  await th11.click({ button: 'right' })
  await page.locator('.menu-item-filter').click()
  await expect(td21).toBeVisible()
  await expect(td31).toBeVisible()
})
