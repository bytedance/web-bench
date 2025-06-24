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
const { getOffset, expectTolerance } = require('@web-bench/test-util')
const { readNum } = require('./utils/pan')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test.use({...devices['Pixel 7']})

// get height of body element
test('html height', async ({ page }) => {
    // Check if the body element has the correct height
    const body = page.locator('html')

    const offset = await getOffset(page,'html');

    console.log(offset.height);

    // get height of body element
    const height = await body.evaluate((el) => window.getComputedStyle(el).height)

    // const tt = await readNum(height);
    // expect(await readNum(height)).toBe(970)

    expectTolerance(await readNum(height), offset.height,5)

    // console.log('tt'+tt);

})
