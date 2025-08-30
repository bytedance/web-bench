// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
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
const { pan, readNum, isTouch } = require('./utils/pan')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test.use({ ...devices['Pixel 7'] })

test(`pan gesture to move the loading ui`, async ({ page }) => {
  await page.goto('index.html');
  const met = await page.locator('#content');
  await pan(met, 0, -400, 5);  // 触发滑动

  // 检查transform属性是否发生变化
  const transform = await met.evaluate(el => getComputedStyle(el).transform)
  expect(transform).not.toBe('none')

  // 检查是否有特定的class或属性变化（如有）
  // expect(await met.getAttribute('class')).toContain('loading-active')
});





// We recommend installing an extension to run vitest tests.

    // await expect(met).toHaveCSS('transform','/matrix/',{timeout:1000});

      // await expect(met).toHaveScreenshot(); 
    // expect(noticeTxt).toHaveText('释放切换到下一屏');



