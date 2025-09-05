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
import { test, expect, devices, Locator } from '@playwright/test';
const { getOffset, expectTolerance } = require('@web-bench/test-util')
const { pan } = require('./utils/pan')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test.use({...devices['Pixel 7'] })

//https://playwright.dev/docs/api/class-pageassertions#page-assertions-to-have-screenshot-1
// use havescreenshot
// https://playwright.dev/docs/touch-events

test.describe('Scroll Device', () => {
  test(`pullloading init`, async ({ page }) => {
    // Ensure the page is loaded and the web app is ready.
    // page.evaluate(() => {})
  
    const met = page.locator('#content');
    const htmlOffset = await getOffset(page,'body');

    // Using ‘page.mouse’ to trace a 100x100 square.
    
    // scroll to bottom
    await page.mouse.wheel(0, 500)

    console.log('htmlOffset'+htmlOffset)

    const noticeTxtOffset = await getOffset(page,'#noticeTxt')
    
    console.log('noticeTxtOffset'+noticeTxtOffset)
    await expectTolerance(noticeTxtOffset.top,920,5)
  });
})




