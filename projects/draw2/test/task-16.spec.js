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

test.describe('Task 16: Delete Operation', () => {
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

  test('should remove rectangle from canvas when deleted', async ({ page }) => {
    // Create a rectangle
    const rect = await createRect(page);
    await expect(rect).toBeVisible();
    
    // Verify rectangle exists
    expect(await page.locator('rect').count()).toBe(1);
    
    // Select delete tool
    await page.click('.delete');
    
    // Click on the rectangle to delete it
    await page.mouse.move(150, 150); // Center of rectangle
    await page.mouse.click();
    
    // Wait for the deletion to complete
    await page.waitForTimeout(100);
    
    // Verify rectangle is removed
    expect(await page.locator('rect').count()).toBe(0);
  });

  test('should remove line from canvas when deleted', async ({ page }) => {
    // Create a line
    const line = await createLine(page);
    await expect(line).toBeVisible();
    
    // Verify line exists
    expect(await page.locator('line').count()).toBe(1);
    
    // Select delete tool
    await page.click('.delete');
    
    // Click on the line to delete it
    const lineAttrs = await line.evaluate(el => ({
      x1: parseFloat(el.getAttribute('x1')),
      y1: parseFloat(el.getAttribute('y1')),
      x2: parseFloat(el.getAttribute('x2')),
      y2: parseFloat(el.getAttribute('y2'))
    }));
    
    // Click at the center of the line
    await page.mouse.move(
      (lineAttrs.x1 + lineAttrs.x2) / 2,
      (lineAttrs.y1 + lineAttrs.y2) / 2
    );
    await page.mouse.click();
    
    // Wait for the deletion to complete
    await page.waitForTimeout(100);
    
    // Verify line is removed
    expect(await page.locator('line').count()).toBe(0);
  });

  test('should remove ellipse from canvas when deleted', async ({ page }) => {
    // Create an ellipse
    const ellipse = await createEllipse(page);
    await expect(ellipse).toBeVisible();
    
    // Verify ellipse exists
    expect(await page.locator('ellipse').count()).toBe(1);
    
    // Select delete tool
    await page.click('.delete');
    
    // Click on the ellipse to delete it
    const ellipseAttrs = await ellipse.evaluate(el => ({
      cx: parseFloat(el.getAttribute('cx')),
      cy: parseFloat(el.getAttribute('cy'))
    }));
    
    // Click at the center of the ellipse
    await page.mouse.move(ellipseAttrs.cx, ellipseAttrs.cy);
    await page.mouse.click();
    
    // Wait for the deletion to complete
    await page.waitForTimeout(100);
    
    // Verify ellipse is removed
    expect(await page.locator('ellipse').count()).toBe(0);
  });

  test('should remove shape from shapes registry when deleted', async ({ page }) => {
    // Create a rectangle
    await createRect(page);
    
    // Create a second shape (line)
    await createLine(page);
    
    // Verify both shapes exist
    expect(await page.locator('rect, line').count()).toBe(2);
    
    // Select delete tool
    await page.click('.delete');
    
    // Delete the rectangle
    await page.mouse.move(150, 150); // Center of rectangle
    await page.mouse.click();
    
    // Wait for the deletion to complete
    await page.waitForTimeout(100);
    
    // Verify rectangle is removed but line remains
    expect(await page.locator('rect').count()).toBe(0);
    expect(await page.locator('line').count()).toBe(1);
    
    // Verify the remaining shape (line) can still be manipulated
    // Select move tool
    await page.click('.move');
    
    // Try to move the line
    await page.mouse.move(150, 150); // Position of the line
    await page.mouse.down();
    await page.mouse.move(200, 200); // Move 50px right and down
    await page.mouse.up();
    
    // Get the line
    const line = page.locator('line');
    
    // Verify the transform has been applied (indicating the shape is still registered)
    const transform = await line.evaluate(el => el.style.transform);
    expect(transform).toContain('translate');
  });

  test('should not delete the canvas itself', async ({ page }) => {
    // Select delete tool
    await page.click('.delete');
    
    // Try to delete the canvas (not a shape)
    const canvas = page.locator('.canvas');
    const canvasBounds = await canvas.boundingBox();
    
    // Click in an empty area of the canvas
    await page.mouse.move(canvasBounds.x + 50, canvasBounds.y + 50);
    await page.mouse.click();
    
    // Wait a moment
    await page.waitForTimeout(100);
    
    // Verify canvas still exists
    await expect(canvas).toBeVisible();
    
    // Create a shape to verify canvas is still functional
    await createRect(page);
    expect(await page.locator('rect').count()).toBe(1);
  });

  test('should handle deleting multiple shapes sequentially', async ({ page }) => {
    // Create multiple shapes
    await createRect(page);
    await createLine(page);
    await createEllipse(page);
    
    // Verify all shapes exist
    expect(await page.locator('rect, line, ellipse').count()).toBe(3);
    
    // Select delete tool
    await page.click('.delete');
    
    // Delete rectangle
    await page.mouse.move(150, 150); // Center of rectangle
    await page.mouse.click();
    await page.waitForTimeout(100);
    
    // Delete line
    await page.mouse.move(150, 150); // Approximate center of line
    await page.mouse.click();
    await page.waitForTimeout(100);
    
    // Delete ellipse
    await page.mouse.move(150, 150); // Approximate center of ellipse
    await page.mouse.click();
    await page.waitForTimeout(100);
    
    // Verify all shapes are removed
    expect(await page.locator('rect, line, ellipse').count()).toBe(0);
  });
});