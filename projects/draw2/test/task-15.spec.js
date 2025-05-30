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

test.describe('Task 15: Copy Operation', () => {
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

  async function createLine(page) {
    // Select line tool
    await page.click('.line');
    
    // Draw a line
    await page.mouse.move(100, 100);
    await page.mouse.down();
    await page.mouse.move(200, 200);
    await page.mouse.up();
    
    // Return the created line element
    return page.locator('line');
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

  test('should duplicate rectangle with all attributes preserved', async ({ page }) => {
    // Create a rectangle
    const rect = await createRect(page);
    await expect(rect).toBeVisible();
    
    // Get original attributes
    const originalAttrs = await rect.evaluate(el => ({
      x: parseFloat(el.getAttribute('x')),
      y: parseFloat(el.getAttribute('y')),
      width: parseFloat(el.getAttribute('width')),
      height: parseFloat(el.getAttribute('height')),
      fill: el.getAttribute('fill'),
      stroke: el.getAttribute('stroke'),
      strokeWidth: parseFloat(el.getAttribute('stroke-width'))
    }));
    
    // Select copy tool
    await page.click('.copy');
    
    // Click on the rectangle to copy it
    await page.mouse.move(150, 150); // Center of rectangle
    await page.mouse.click();
    
    // Wait for the copy to be created
    await page.waitForTimeout(100);
    
    // Get all rectangles
    const rects = page.locator('rect');
    const count = await rects.count();
    
    // Verify there are now 2 rectangles
    expect(count).toBe(2);
    
    // Get the second (copied) rectangle
    const copiedRect = rects.nth(1);
    
    // Get copied attributes
    const copiedAttrs = await copiedRect.evaluate(el => ({
      x: parseFloat(el.getAttribute('x')),
      y: parseFloat(el.getAttribute('y')),
      width: parseFloat(el.getAttribute('width')),
      height: parseFloat(el.getAttribute('height')),
      fill: el.getAttribute('fill'),
      stroke: el.getAttribute('stroke'),
      strokeWidth: parseFloat(el.getAttribute('stroke-width'))
    }));
    
    // Verify attributes are preserved except position (which should be offset)
    expect(copiedAttrs.width).toEqual(originalAttrs.width);
    expect(copiedAttrs.height).toEqual(originalAttrs.height);
    expect(copiedAttrs.fill).toEqual(originalAttrs.fill);
    expect(copiedAttrs.stroke).toEqual(originalAttrs.stroke);
    expect(copiedAttrs.strokeWidth).toEqual(originalAttrs.strokeWidth);
    
    // Verify position is offset by Shape.offset (20px in both directions)
    expect(copiedAttrs.x).toBeCloseTo(originalAttrs.x + 20, 0);
    expect(copiedAttrs.y).toBeCloseTo(originalAttrs.y + 20, 0);
  });

  test('should duplicate line with all attributes preserved', async ({ page }) => {
    // Create a line
    const line = await createLine(page);
    await expect(line).toBeVisible();
    
    // Get original attributes
    const originalAttrs = await line.evaluate(el => ({
      x1: parseFloat(el.getAttribute('x1')),
      y1: parseFloat(el.getAttribute('y1')),
      x2: parseFloat(el.getAttribute('x2')),
      y2: parseFloat(el.getAttribute('y2')),
      stroke: el.getAttribute('stroke'),
      strokeWidth: parseFloat(el.getAttribute('stroke-width'))
    }));
    
    // Select copy tool
    await page.click('.copy');
    
    // Click on the line to copy it
    await page.mouse.move((originalAttrs.x1 + originalAttrs.x2) / 2, 
                          (originalAttrs.y1 + originalAttrs.y2) / 2); // Center of line
    await page.mouse.click();
    
    // Wait for the copy to be created
    await page.waitForTimeout(100);
    
    // Get all lines
    const lines = page.locator('line');
    const count = await lines.count();
    
    // Verify there are now 2 lines
    expect(count).toBe(2);
    
    // Get the second (copied) line
    const copiedLine = lines.nth(1);
    
    // Get copied attributes
    const copiedAttrs = await copiedLine.evaluate(el => ({
      x1: parseFloat(el.getAttribute('x1')),
      y1: parseFloat(el.getAttribute('y1')),
      x2: parseFloat(el.getAttribute('x2')),
      y2: parseFloat(el.getAttribute('y2')),
      stroke: el.getAttribute('stroke'),
      strokeWidth: parseFloat(el.getAttribute('stroke-width'))
    }));
    
    // Verify attributes are preserved except position (which should be offset)
    expect(copiedAttrs.stroke).toEqual(originalAttrs.stroke);
    expect(copiedAttrs.strokeWidth).toEqual(originalAttrs.strokeWidth);
    
    // Verify position is offset by Shape.offset (20px in both directions)
    expect(copiedAttrs.x1).toBeCloseTo(originalAttrs.x1 + 20, 0);
    expect(copiedAttrs.y1).toBeCloseTo(originalAttrs.y1 + 20, 0);
    expect(copiedAttrs.x2).toBeCloseTo(originalAttrs.x2 + 20, 0);
    expect(copiedAttrs.y2).toBeCloseTo(originalAttrs.y2 + 20, 0);
  });

  test('should duplicate ellipse with all attributes preserved', async ({ page }) => {
    // Create an ellipse
    const ellipse = await createEllipse(page);
    await expect(ellipse).toBeVisible();
    
    // Get original attributes
    const originalAttrs = await ellipse.evaluate(el => ({
      cx: parseFloat(el.getAttribute('cx')),
      cy: parseFloat(el.getAttribute('cy')),
      rx: parseFloat(el.getAttribute('rx')),
      ry: parseFloat(el.getAttribute('ry')),
      fill: el.getAttribute('fill'),
      stroke: el.getAttribute('stroke'),
      strokeWidth: parseFloat(el.getAttribute('stroke-width'))
    }));
    
    // Select copy tool
    await page.click('.copy');
    
    // Click on the ellipse to copy it
    await page.mouse.move(originalAttrs.cx, originalAttrs.cy); // Center of ellipse
    await page.mouse.click();
    
    // Wait for the copy to be created
    await page.waitForTimeout(100);
    
    // Get all ellipses
    const ellipses = page.locator('ellipse');
    const count = await ellipses.count();
    
    // Verify there are now 2 ellipses
    expect(count).toBe(2);
    
    // Get the second (copied) ellipse
    const copiedEllipse = ellipses.nth(1);
    
    // Get copied attributes
    const copiedAttrs = await copiedEllipse.evaluate(el => ({
      cx: parseFloat(el.getAttribute('cx')),
      cy: parseFloat(el.getAttribute('cy')),
      rx: parseFloat(el.getAttribute('rx')),
      ry: parseFloat(el.getAttribute('ry')),
      fill: el.getAttribute('fill'),
      stroke: el.getAttribute('stroke'),
      strokeWidth: parseFloat(el.getAttribute('stroke-width'))
    }));
    
    // Verify attributes are preserved except position (which should be offset)
    expect(copiedAttrs.rx).toEqual(originalAttrs.rx);
    expect(copiedAttrs.ry).toEqual(originalAttrs.ry);
    expect(copiedAttrs.fill).toEqual(originalAttrs.fill);
    expect(copiedAttrs.stroke).toEqual(originalAttrs.stroke);
    expect(copiedAttrs.strokeWidth).toEqual(originalAttrs.strokeWidth);
    
    // Verify position is offset by Shape.offset (20px in both directions)
    expect(copiedAttrs.cx).toBeCloseTo(originalAttrs.cx + 20, 0);
    expect(copiedAttrs.cy).toBeCloseTo(originalAttrs.cy + 20, 0);
  });

  test('should register the copied shape in the shapes array', async ({ page }) => {
    // Create a rectangle
    await createRect(page);
    
    // Select copy tool
    await page.click('.copy');
    
    // Click on the rectangle to copy it
    await page.mouse.move(150, 150); // Center of rectangle
    await page.mouse.click();
    
    // Wait for the copy to be created
    await page.waitForTimeout(100);
    
    // Verify the copy is registered by checking if it can be manipulated
    // Select move tool
    await page.click('.move');
    
    // Try to move the copied rectangle
    await page.mouse.move(170, 170); // Position of the copied rectangle
    await page.mouse.down();
    await page.mouse.move(220, 220); // Move 50px right and down
    await page.mouse.up();
    
    // Get the second (copied) rectangle
    const copiedRect = page.locator('rect').nth(1);
    
    // Verify the transform has been applied (indicating the shape is registered)
    const transform = await copiedRect.evaluate(el => el.style.transform);
    expect(transform).toContain('translate');
  });

  test('should not copy the canvas itself', async ({ page }) => {
    // Select copy tool
    await page.click('.copy');
    
    // Try to copy the canvas (not a shape)
    const canvas = page.locator('.canvas');
    const canvasBounds = await canvas.boundingBox();
    
    // Click in an empty area of the canvas
    await page.mouse.move(canvasBounds.x + 50, canvasBounds.y + 50);
    await page.mouse.click();
    
    // Wait a moment
    await page.waitForTimeout(100);
    
    // Verify no shapes were created
    const shapes = await page.locator('svg > :not(.canvas)').count();
    expect(shapes).toBe(0);
  });
});