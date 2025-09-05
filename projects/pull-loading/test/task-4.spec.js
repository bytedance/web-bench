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

const { test, expect ,devices} = require('@playwright/test')
const { getOffset } = require('@web-bench/test-util')
const { getOffsetByLocator ,getViewport } = require('../../../libraries/test-util/src')


test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})
test.use({ ...devices['Pixel 7'] })

console.log(getViewport)

test('noticeTxt at bottom', async ({ page }) => {
  
    // Check if the pull loading element is present
    const noticeTxt = page.locator('#noticeTxt')

    const offset = await getOffsetByLocator(noticeTxt)

    expect(offset.width).toBeGreaterThan(5)
    expect(offset.height).toBe(50)  
 
    await noticeTxt.scrollIntoViewIfNeeded({behavior: 'smooth'})

    // const rectNotice = await getOffset(page,'#noticeTxt');
    const isDelta =  await ( await page.locator('#noticeTxt'))
    .evaluate((noticeTxt) => {
      rectNotice = noticeTxt.getBoundingClientRect();
      const delta = window.scrollY +rectNotice.bottom - noticeTxt.offsetTop  -noticeTxt.offsetHeight
      console.log(delta)
      return delta;    
    })
    expect(isDelta).toBeLessThanOrEqual(5); // at bottom
})
