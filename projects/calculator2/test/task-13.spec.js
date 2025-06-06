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

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('fix display width', async ({ page }) => {
  const displayWidth = await (
    await page.locator('#display')
  ).evaluate((element) => {
    const style = window.getComputedStyle(element)
    return style.boxSizing === 'border-box'
      ? parseFloat(style.width)
      : parseFloat(style.width) +
          parseFloat(style.paddingLeft) +
          parseFloat(style.paddingRight) +
          parseFloat(style.borderLeftWidth) +
          parseFloat(style.borderRightWidth)
  })

  const buttonsWidth = await (
    await page.locator('.buttons')
  ).evaluate((element) => {
    return parseFloat(window.getComputedStyle(element).width)
  })

  // console.log('displayWidth', displayWidth)
  // console.log('buttonsWidth', buttonsWidth)
  await expect(displayWidth).toBe(buttonsWidth)
})
