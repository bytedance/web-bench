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
  getOffset,
  getComputedStyle,
  getMarginBox,
  expectTolerance,
  expectOneLine,
} = require('@web-bench/test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('footer info one line', async ({ page }) => {
  await expectOneLine(page, '.footer-info')
})

test.describe('page width 399px', () => {
  test.use({ viewport: { width: 399, height: 720 } })

  test('footer info one line', async ({ page }) => {
    await expectOneLine(page, '.footer-info')
  })

  test('footer width', async ({ page }) => {
    const footer = await getOffset(page, '.footer')
    const body = await getOffset(page, 'body')

    expect(footer.width).toBeCloseTo(body.width, 5)
  })
})
