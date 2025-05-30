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

test.describe('Task 17: Fill Operation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // Helper functions to create shapes for testing
  async function createRect(page) {
    // Select rectangle tool
    await page.click('.rect');
    
    // Draw a rectangle
    await page.mouse.move(100, 100);
    await page.mouse.down();
    await page.mouse.move(200, 200);
    await page.mouse.up();
    
    // Return the created rectangle element
    return page.locator('rect');
  }

  async function createEllipse(page) {
    // Select ellipse tool
    await page.click('.ellipse');
    
    // Draw an ellipse
    await page.mouse.move(150, 150);
    await page.mouse.down();
    await page.mouse.move(200, 180);
    await page.mouse.up();
    
    // Return the created ellipse element
    return page.locator('ellipse');
  }

  test('should change rectangle fill color when using fill tool', async ({ page }) => {
    // Create a rectangle
    const rect = await createRect(page);
    await expect(rect).toBeVisible();
    
    // Get initial fill color
    const initialFill = await rect.getAttribute('fill');
    
    // Change color in the color picker
    await page.fill('.color', '#ff0000'); // Set to red
    
    // Select fill tool
    await page.click('.fill');
    
    // Click on the rectangle to fill it
    await page.mouse.move(150, 150); // Center of rectangle
    await page.mouse.click();
    
    // Get new fill color
    const newFill = await rect.getAttribute('fill');
    
    // Verify fill color has changed to red
    expect(newFill.toLowerCase()).toBe('#ff0000');
    expect(newFill).not.toEqual(initialFill);
  });

  test('should change ellipse fill color when using fill tool', async ({ page }) => {
    // Create an ellipse
    const ellipse = await createEllipse(page);
    await expect(ellipse).toBeVisible();
    
    // Get initial fill color
    const initialFill = await ellipse.getAttribute('fill');
    
    // Change color in the color picker
    await page.fill('.color', '#00ff00'); // Set to green
    
    // Select fill tool
    await page.click('.fill');
    
    // Click on the ellipse to fill it
    const ellipseAttrs = await ellipse.evaluate(el => ({
      cx: parseFloat(el.getAttribute('cx')),
      cy: parseFloat(el.getAttribute('cy'))
    }));
    
    await page.mouse.move(ellipseAttrs.cx, ellipseAttrs.cy); // Center of ellipse
    await page.mouse.click();
    
    // Get new fill color
    const newFill = await ellipse.getAttribute('fill');
    
    // Verify fill color has changed to green
    expect(newFill.toLowerCase()).toBe('#00ff00');
    expect(newFill).not.toEqual(initialFill);
  });

  test('should use current color from color picker for fill', async ({ page }) => {
    // Create a rectangle
    const rect = await createRect(page);
    
    // Test multiple colors
    const testColors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00'];
    
    for (const color of testColors) {
      // Change color in the color picker
      await page.fill('.color', color);
      
      // Select fill tool
      await page.click('.fill');
      
      // Click on the rectangle to fill it
      await page.mouse.move(150, 150); // Center of rectangle
      await page.mouse.click();
      
      // Get new fill color
      const newFill = await rect.getAttribute('fill');
      
      // Verify fill color has changed to the selected color
      expect(newFill.toLowerCase()).toBe(color.toLowerCase());
    }
  });

  test('should not change stroke color when using fill tool', async ({ page }) => {
    // Create a rectangle
    const rect = await createRect(page);
    
    // Get initial stroke color
    const initialStroke = await rect.getAttribute('stroke');
    
    // Change color in the color picker
    await page.fill('.color', '#ff0000'); // Set to red
    
    // Select fill tool
    await page.click('.fill');
    
    // Click on the rectangle to fill it
    await page.mouse.move(150, 150); // Center of rectangle
    await page.mouse.click();
    
    // Get new stroke color
    const newStroke = await rect.getAttribute('stroke');
    
    // Verify stroke color has not changed
    expect(newStroke).toEqual(initialStroke);
  });

  test('should not fill the canvas itself', async ({ page }) => {
    // Change color in the color picker
    await page.fill('.color', '#ff0000'); // Set to red
    
    // Select fill tool
    await page.click('.fill');
    
    // Try to fill the canvas (not a shape)
    const canvas = page.locator('.canvas');
    const canvasBounds = await canvas.boundingBox();
    
    // Click in an empty area of the canvas
    await page.mouse.move(canvasBounds.x + 50, canvasBounds.y + 50);
    await page.mouse.click();
    
    // Wait a moment
    await page.waitForTimeout(100);
    
    // Create a shape to verify canvas is still functional and has not changed color
    await createRect(page);
    
    // Get the background color of the canvas
    const canvasColor = await canvas.evaluate(el => {
      return window.getComputedStyle(el).backgroundColor;
    });
    
    // Verify canvas background is still light gray (#eee) and not red
    // Convert rgb to hex for comparison
    const rgbToHex = (rgb) => {
      // Extract the r, g, b values
      const rgbValues = rgb.match(/\d+/g);
      if (!rgbValues || rgbValues.length < 3) return '';
      
      // Convert to hex
      return '#' + rgbValues.slice(0, 3).map(x => {
        const hex = parseInt(x).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      }).join('');
    };
    
    const canvasHexColor = rgbToHex(canvasColor);
    expect(canvasHexColor.toLowerCase()).not.toBe('#ff0000');
  });

  test('should fill multiple shapes independently', async ({ page }) => {
    // Create a rectangle
    await createRect(page);
    
    // Create an ellipse
    await createEllipse(page);
    
    // Verify both shapes exist
    const rect = page.locator('rect');
    const ellipse = page.locator('ellipse');
    await expect(rect).toBeVisible();
    await expect(ellipse).toBeVisible();
    
    // Fill rectangle with red
    await page.fill('.color', '#ff0000');
    await page.click('.fill');
    await page.mouse.move(150, 150); // Center of rectangle
    await page.mouse.click();
    
    // Fill ellipse with blue
    await page.fill('.color', '#0000ff');
    await page.click('.fill');
    const ellipseAttrs = await ellipse.evaluate(el => ({
      cx: parseFloat(el.getAttribute('cx')),
      cy: parseFloat(el.getAttribute('cy'))
    }));
    await page.mouse.move(ellipseAttrs.cx, ellipseAttrs.cy); // Center of ellipse
    await page.mouse.click();
    
    // Verify rectangle is red
    const rectFill = await rect.getAttribute('fill');
    expect(rectFill.toLowerCase()).toBe('#ff0000');
    
    // Verify ellipse is blue
    const ellipseFill = await ellipse.getAttribute('fill');
    expect(ellipseFill.toLowerCase()).toBe('#0000ff');
  });
});