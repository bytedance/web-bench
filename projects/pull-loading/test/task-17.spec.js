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

// 新增：测试短距离滑动不会触发loading
test(`short pan gesture does not trigger loading`, async ({ page }) => {
  await page.goto('index.html');
  const met = await page.locator('#content');
  await pan(met, 0, -1, 5); // 短距离滑动



  const transform = await met.evaluate(el => getComputedStyle(el).transform);

  // 解析matrix，判断Y轴偏移是否接近0
  let y = 0;
  const match = transform.match(/matrix\([^\)]+\)/);
  if (match) {
    const parts = transform.replace('matrix(', '').replace(')', '').split(',');
    console.log("parts"+parts);
    y = parseFloat(parts[5]);
  }

  // 期望transform为none或初始状态
  expect(Math.abs(y)).toBeLessThan(1); // 允许极小误差

  // 阻尼运动小于50，上拉切换到下一屏， 释放，恢复原始状态

  // 阻尼运动大于50，释放切换到下一屏，触发loading，调用callback

  // 阻尼运动于原始状态，继续拖动，查看详情



}
//   expect(transform === 'none' || transform === 'matrix(1, 0, 0, 1, 0, 0)').toBeTruthy()
);