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



  // 阻尼运动大于100(DISTINCE)，释放切换到下一屏，触发loading，调用callback

// 新增：测试滑动后释放，loading文本出现
test(`pan gesture shows loading text more than DISTINCE`, async ({ page }) => {
  await page.goto('index.html');
    await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
    });

  const met = await page.locator('#content');
  await pan(met, 0, -400, 5);

  const noticeTxt = await page.locator('#noticeTxt');
  await expect(noticeTxt).toHaveText(/释放切换到下一屏|loading/i);
});

   // 阻尼运动于原始状态，继续拖动，查看详情
test(`pan gesture shows loading text init`, async ({ page }) => {
  await page.goto('index.html');
    await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
    });
  const met = await page.locator('#content');
  const noticeTxt = await page.locator('#noticeTxt');

  await pan(met, 0, -100, 50);
  await expect(noticeTxt).toHaveText(/继续拖动，查看详情/i);
});

  // 阻尼运动小于100(DISTINCE)，上拉切换到下一屏， 释放，恢复原始状态
test(`pan gesture shows loading text less than DISTINCE`, async ({ page }) => {
  await page.goto('index.html');
    await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
    });
  const met = await page.locator('#content');
  const noticeTxt = await page.locator('#noticeTxt');

  await pan(met, 0, -99, 50);
  await page.waitForTimeout(100);
  await expect(noticeTxt).toHaveText(/上拉切换到下一屏|继续拖动，查看详情/i);

  /// 因为pull之后会回到原味，所以，只能捕捉到最后状态，也就是‘继续拖动，查看详情’状态
  //todo 想个办法捕捉中间流程。

//     await expect.poll(async () => {
//     return await noticeTxt.textContent();
//   }, { timeout: 1000 }).toContain(/上拉切换到下一屏|继续拖动，查看详情/i);
});
