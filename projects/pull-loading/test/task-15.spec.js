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

test('swipe horizontal and not shake', async ({ page }) => {

    const body =  page.locator('body')
    await pan(body,{deltaX:100,debug:true})

    const bodyOffset = await getOffset(page,'body')
    await expectTolerance(bodyOffset.left,0,1)

    await pan(body,{deltaX:-100,debug:true})
    const bodyOffset2 = await getOffset(page,'body')
    await expectTolerance(bodyOffset2.left,0,1)
})



