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

import { test, expect } from '@playwright/test';

test.describe('Task 18: Custom Cursor System', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display default cursor on canvas initially', async ({ page }) => {
    // Get the canvas element
    const canvas = page.locator('.canvas');
    
    // Check the cursor style
    const cursorStyle = await canvas.evaluate(el => {
      return window.getComputedStyle(el).cursor;
    });
    
    // Default cursor should be auto or default
    expect(['auto', 'default'].some(style => cursorStyle.includes(style))).toBeTruthy();
  });

  test('should change cursor to crosshair for line tool', async ({ page }) => {
    // Select line tool
    await page.click('.line');
    
    // Get the canvas element
    const canvas = page.locator('.canvas');
    
    // Check the cursor style
    const cursorStyle = await canvas.evaluate(el => {
      return window.getComputedStyle(el).cursor;
    });
    
    // Cursor should be crosshair for drawing tools
    expect(cursorStyle).toBe('crosshair');
  });

  test('should change cursor to crosshair for rectangle tool', async ({ page }) => {
    // Select rectangle tool
    await page.click('.rect');
    
    // Get the canvas element
    const canvas = page.locator('.canvas');
    
    // Check the cursor style
    const cursorStyle = await canvas.evaluate(el => {
      return window.getComputedStyle(el).cursor;
    });
    
    // Cursor should be crosshair for drawing tools
    expect(cursorStyle).toBe('crosshair');
  });

  test('should change cursor to crosshair for ellipse tool', async ({ page }) => {
    // Select ellipse tool
    await page.click('.ellipse');
    
    // Get the canvas element
    const canvas = page.locator('.canvas');
    
    // Check the cursor style
    const cursorStyle = await canvas.evaluate(el => {
      return window.getComputedStyle(el).cursor;
    });
    
    // Cursor should be crosshair for drawing tools
    expect(cursorStyle).toBe('crosshair');
  });

  test('should change cursor to move for move tool', async ({ page }) => {
    // Select move tool
    await page.click('.move');
    
    // Get the canvas element
    const canvas = page.locator('.canvas');
    
    // Check the cursor style
    const cursorStyle = await canvas.evaluate(el => {
      return window.getComputedStyle(el).cursor;
    });
    
    // Cursor should be move for move tool
    expect(cursorStyle).toBe('move');
  });

  test('should change cursor to pointer for rotate tool', async ({ page }) => {
    // Select rotate tool
    await page.click('.rotate');
    
    // Get the canvas element
    const canvas = page.locator('.canvas');
    
    // Check the cursor style
    const cursorStyle = await canvas.evaluate(el => {
      return window.getComputedStyle(el).cursor;
    });
    
    // Cursor should be pointer for rotate tool
    expect(cursorStyle).toBe('pointer');
  });

  test('should change cursor to zoom-in for zoom tool', async ({ page }) => {
    // Select zoom tool
    await page.click('.zoom');
    
    // Get the canvas element
    const canvas = page.locator('.canvas');
    
    // Check the cursor style
    const cursorStyle = await canvas.evaluate(el => {
      return window.getComputedStyle(el).cursor;
    });
    
    // Cursor should be zoom-in for zoom tool
    expect(['zoom-in', 'pointer'].some(style => cursorStyle.includes(style))).toBeTruthy();
  });

  test('should change cursor to copy for copy tool', async ({ page }) => {
    // Select copy tool
    await page.click('.copy');
    
    // Get the canvas element
    const canvas = page.locator('.canvas');
    
    // Check the cursor style
    const cursorStyle = await canvas.evaluate(el => {
      return window.getComputedStyle(el).cursor;
    });
    
    // Cursor should be copy for copy tool
    expect(['copy', 'pointer'].some(style => cursorStyle.includes(style))).toBeTruthy();
  });

  test('should change cursor to not-allowed for delete tool', async ({ page }) => {
    // Select delete tool
    await page.click('.delete');
    
    // Get the canvas element
    const canvas = page.locator('.canvas');
    
    // Check the cursor style
    const cursorStyle = await canvas.evaluate(el => {
      return window.getComputedStyle(el).cursor;
    });
    
    // Cursor should be not-allowed for delete tool
    expect(['not-allowed', 'no-drop', 'pointer'].some(style => cursorStyle.includes(style))).toBeTruthy();
  });

  test('should change cursor to fill for fill tool', async ({ page }) => {
    // Select fill tool
    await page.click('.fill');
    
    // Get the canvas element
    const canvas = page.locator('.canvas');
    
    // Check the cursor style
    const cursorStyle = await canvas.evaluate(el => {
      return window.getComputedStyle(el).cursor;
    });
    
    // Cursor should be cell or pointer for fill tool
    expect(['cell', 'pointer', 'crosshair'].some(style => cursorStyle.includes(style))).toBeTruthy();
  });

  test('should temporarily change cursor to move when spacebar is pressed', async ({ page }) => {
    // Select line tool first
    await page.click('.line');
    
    // Get the canvas element
    const canvas = page.locator('.canvas');
    
    // Check initial cursor style
    let cursorStyle = await canvas.evaluate(el => {
      return window.getComputedStyle(el).cursor;
    });
    
    // Initial cursor should be crosshair
    expect(cursorStyle).toBe('crosshair');
    
    // Press spacebar
    await page.keyboard.down(' ');
    
    // Check cursor style after spacebar press
    cursorStyle = await canvas.evaluate(el => {
      return window.getComputedStyle(el).cursor;
    });
    
    // Cursor should temporarily change to move
    expect(cursorStyle).toBe('move');
    
    // Release spacebar
    await page.keyboard.up(' ');
    
    // Check cursor style after spacebar release
    cursorStyle = await canvas.evaluate(el => {
      return window.getComputedStyle(el).cursor;
    });
    
    // Cursor should return to crosshair
    expect(cursorStyle).toBe('crosshair');
  });

  test('should update cursor when switching between tools', async ({ page }) => {
    // Test sequence of tool selections
    const toolTests = [
      { selector: '.line', expectedCursor: 'crosshair' },
      { selector: '.move', expectedCursor: 'move' },
      { selector: '.rotate', expectedCursor: 'pointer' },
      { selector: '.rect', expectedCursor: 'crosshair' },
      { selector: '.delete', expectedCursor: ['not-allowed', 'no-drop', 'pointer'] },
      { selector: '.ellipse', expectedCursor: 'crosshair' }
    ];
    
    const canvas = page.locator('.canvas');
    
    for (const { selector, expectedCursor } of toolTests) {
      // Select the tool
      await page.click(selector);
      
      // Check the cursor style
      const cursorStyle = await canvas.evaluate(el => {
        return window.getComputedStyle(el).cursor;
      });
      
      // Verify cursor matches expected style
      if (Array.isArray(expectedCursor)) {
        expect(expectedCursor.some(style => cursorStyle.includes(style))).toBeTruthy();
      } else {
        expect(cursorStyle).toBe(expectedCursor);
      }
    }
  });
});