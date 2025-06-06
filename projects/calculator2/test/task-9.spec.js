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

test('toggle button position', async ({ page }) => {
  const toggleOffset = await (
    await page.locator('button#toggle')
  ).evaluate((element) => {
    /** @see https://stackoverflow.com/a/28222246/1835843 */
    function getOffset(el) {
      const rect = el.getBoundingClientRect()
      return {
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY,
      }
    }
    return getOffset(element)
  })

  // https://playwright.dev/docs/api/class-browser#browser-new-context-option-viewport
  // default viewport is { width: 1280, height: 720 }
  const bodyStyle = await (
    await page.locator('body')
  ).evaluate((element) => window.getComputedStyle(element))
  const bodyWidth = parseFloat(bodyStyle.width)
  const bodyHeight = parseFloat(bodyStyle.height)

  // console.log('toggleOffset', toggleOffset)
  // console.log('body.width/height', bodyWidth, bodyHeight)
  await expect(toggleOffset.top / bodyHeight > 0.5).toBeTruthy()
})
