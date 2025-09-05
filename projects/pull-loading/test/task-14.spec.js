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

const { test, expect,devices } = require('@playwright/test')
const { getOffset ,getComputedStyle, expectTolerance} = require('@web-bench/test-util')
const { pan, readNum } = require('./utils/pan')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test.use({...devices['Pixel 7'] })

test('tap and not shake', async ({ page }) => {

    // touchStart on some random points
    await page.touchscreen.tap(50,50)
    await page.touchscreen.tap(150,150)
    await page.touchscreen.tap(250,250)
    await page.touchscreen.tap(350,350)
    const bodyOffset = await getOffset(page,'body')

    await expectTolerance(bodyOffset.bottom,970,1)
})

