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

const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html');
  await page.waitForTimeout(100);
  await page.click('canvas');
});

// Add modular test
test('modules should be properly loaded', async ({ page }) => {
  const modulesLoaded = await page.evaluate(() => {
    return {
      storeInitialized: typeof window.store === 'object' 
        && window.store.hasOwnProperty('score')
        && window.store.hasOwnProperty('bird'),
      
      constantsApplied: window.store.bird.x === 30, 
      
      canvasInitialized: document.querySelector('canvas') instanceof HTMLCanvasElement,
    };
  });

  expect(modulesLoaded.storeInitialized).toBe(true);
  expect(modulesLoaded.constantsApplied).toBe(true);
  expect(modulesLoaded.canvasInitialized).toBe(true);
});


test('render module should handle all drawing operations', async ({ page }) => {
  await page.waitForSelector('canvas');
  
  const renderOperations = await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    
    const imageData1 = ctx.getImageData(0, 0, canvas.clientWidth, canvas.clientHeight);
    
    window.store.score = 10;
    
    const imageData2 = ctx.getImageData(0, 0, canvas.clientWidth, canvas.clientHeight);
    
    return {
      hasChanged: imageData1.data.some((pixel, index) => pixel !== imageData2.data[index])
    };
  });

  expect(renderOperations.hasChanged).toBe(true);
});

test('events module should handle user interactions', async ({ page }) => {
  await page.waitForSelector('canvas');
  
  await page.keyboard.press('Enter');
  
  const keyboardEventResult = await page.evaluate(() => {
    return window.store.isAnimating;
  });
  
  expect(keyboardEventResult).toBe(true);
  
  await page.click('canvas');
  
  const clickEventResult = await page.evaluate(() => {
    return window.store.bird.velocity < 0;
  });
  
  expect(clickEventResult).toBe(true);
});


test('constants should be properly imported and used', async ({ page }) => {
  const constantsTest = await page.evaluate(() => {
    const jumpResult = window.store.bird.velocity;
    
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    window.dispatchEvent(event);
    
    const afterJumpVelocity = window.store.bird.velocity;
    
    return {
      hasExpectedJumpVelocity: afterJumpVelocity === -6, 
    };
  });

  expect(constantsTest.hasExpectedJumpVelocity).toBe(true);
});

test('game assets should load correctly', async ({ page }) => {
  const assetsLoaded = await page.evaluate(() => {
    return new Promise(resolve => {
      setTimeout(() => {
        const canvas = document.querySelector('canvas');
        const ctx = canvas.getContext('2d');
        
        const computedStyle = window.getComputedStyle(canvas);
        const hasBackground = computedStyle.backgroundImage.includes('bg.png');
        
        resolve({
          hasBackground,
          canvasInitialized: !!ctx,
        });
      }, 100);
    });
  });

  expect(assetsLoaded.hasBackground).toBe(true);
  expect(assetsLoaded.canvasInitialized).toBe(true);
});