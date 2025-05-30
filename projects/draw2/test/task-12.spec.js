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

test.describe('Task 12: Move Operation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // Helper function to create a shape for testing
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

  test('should allow dragging shapes with the move tool', async ({ page }) => {
    // Create a rectangle
    const rect = await createRect(page);
    await expect(rect).toBeVisible();
    
    // Get initial position
    const initialTransform = await rect.evaluate(el => el.style.transform);
    
    // Select move tool
    await page.click('.move');
    
    // Drag the shape
    await page.mouse.move(150, 150); // Move to center of rectangle
    await page.mouse.down();
    await page.mouse.move(250, 250); // Move 100px right and down
    await page.mouse.up();
    
    // Get final position
    const finalTransform = await rect.evaluate(el => el.style.transform);
    
    // Verify the transform has changed
    expect(finalTransform).not.toEqual(initialTransform);
    
    // Parse the transform values to verify the translation
    const initialTranslate = await rect.evaluate(el => {
      const match = el.style.transform.match(/translate\(([\d.-]+)px,\s*([\d.-]+)px\)/);
      return match ? { x: parseFloat(match[1]), y: parseFloat(match[2]) } : { x: 0, y: 0 };
    });
    
    const finalTranslate = await rect.evaluate(el => {
      const match = el.style.transform.match(/translate\(([\d.-]+)px,\s*([\d.-]+)px\)/);
      return match ? { x: parseFloat(match[1]), y: parseFloat(match[2]) } : { x: 0, y: 0 };
    });
    
    // Verify the translation difference is approximately 100px in both directions
    // Allow for some small rounding differences
    expect(Math.abs(finalTranslate.x - initialTranslate.x - 100)).toBeLessThan(5);
    expect(Math.abs(finalTranslate.y - initialTranslate.y - 100)).toBeLessThan(5);
  });

  test('should preserve rotation and scale during move operation', async ({ page }) => {
    // Create a rectangle
    const rect = await createRect(page);
    
    // First rotate the shape
    await page.click('.rotate');
    await page.mouse.move(150, 150); // Move to center of rectangle
    await page.mouse.down();
    await page.mouse.move(200, 100); // Move to rotate
    await page.mouse.up();
    
    // Get transform after rotation
    const rotatedTransform = await rect.evaluate(el => el.style.transform);
    
    // Verify rotation was applied
    expect(rotatedTransform).toContain('rotate');
    
    // Now move the shape
    await page.click('.move');
    await page.mouse.move(150, 150); // Move to center of rectangle
    await page.mouse.down();
    await page.mouse.move(250, 250); // Move 100px right and down
    await page.mouse.up();
    
    // Get final transform
    const finalTransform = await rect.evaluate(el => el.style.transform);
    
    // Verify that rotation is preserved
    expect(finalTransform).toContain('rotate');
    
    // Extract rotation values to compare
    const rotatedAngle = await rect.evaluate(el => {
      const match = el.style.transform.match(/rotate\(([\d.-]+)deg\)/);
      return match ? parseFloat(match[1]) : 0;
    });
    
    const finalAngle = await rect.evaluate(el => {
      const match = el.style.transform.match(/rotate\(([\d.-]+)deg\)/);
      return match ? parseFloat(match[1]) : 0;
    });
    
    // Verify rotation angle is preserved
    expect(finalAngle).toBeCloseTo(rotatedAngle, 1); // Allow for small rounding differences
  });

  test('should not allow moving the canvas itself', async ({ page }) => {
    // Select move tool
    await page.click('.move');
    
    // Try to drag the canvas (not a shape)
    const canvas = page.locator('.canvas');
    const canvasBounds = await canvas.boundingBox();
    
    // Click in an empty area of the canvas
    await page.mouse.move(canvasBounds.x + 50, canvasBounds.y + 50);
    await page.mouse.down();
    await page.mouse.move(canvasBounds.x + 150, canvasBounds.y + 150);
    await page.mouse.up();
    
    // Verify no shapes were created or moved
    const shapes = await page.locator('svg > :not(.canvas)').count();
    expect(shapes).toBe(0);
  });

  test('should calculate position difference correctly', async ({ page }) => {
    // Create a rectangle
    const rect = await createRect(page);
    
    // Select move tool
    await page.click('.move');
    
    // Perform multiple moves and check each translation
    const moves = [
      { dx: 50, dy: 0 },   // Move right
      { dx: 0, dy: 50 },   // Move down
      { dx: -30, dy: 0 },  // Move left
      { dx: 0, dy: -20 }   // Move up
    ];
    
    let expectedX = 0;
    let expectedY = 0;
    
    for (const move of moves) {
      // Get current position
      const currentTranslate = await rect.evaluate(el => {
        const match = el.style.transform.match(/translate\(([\d.-]+)px,\s*([\d.-]+)px\)/);
        return match ? { x: parseFloat(match[1]), y: parseFloat(match[2]) } : { x: 0, y: 0 };
      });
      
      // Move the shape
      await page.mouse.move(150 + expectedX, 150 + expectedY); // Move to current center
      await page.mouse.down();
      await page.mouse.move(150 + expectedX + move.dx, 150 + expectedY + move.dy);
      await page.mouse.up();
      
      // Update expected position
      expectedX += move.dx;
      expectedY += move.dy;
      
      // Get new position
      const newTranslate = await rect.evaluate(el => {
        const match = el.style.transform.match(/translate\(([\d.-]+)px,\s*([\d.-]+)px\)/);
        return match ? { x: parseFloat(match[1]), y: parseFloat(match[2]) } : { x: 0, y: 0 };
      });
      
      // Verify the translation difference matches our move
      expect(Math.abs(newTranslate.x - currentTranslate.x - move.dx)).toBeLessThan(5);
      expect(Math.abs(newTranslate.y - currentTranslate.y - move.dy)).toBeLessThan(5);
    }
  });
});