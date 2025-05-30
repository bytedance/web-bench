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

test.describe('Task 14: Zoom/Scale Operation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // Helper function to create a rectangle for testing
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

  test('should scale shapes uniformly from their center', async ({ page }) => {
    // Create a rectangle
    const rect = await createRect(page);
    await expect(rect).toBeVisible();
    
    // Get initial transform
    const initialTransform = await rect.evaluate(el => el.style.transform);
    
    // Select zoom tool
    await page.click('.zoom');
    
    // Perform scaling (move away from center to enlarge)
    await page.mouse.move(150, 150); // Move to center of rectangle
    await page.mouse.down();
    await page.mouse.move(200, 200); // Move diagonally outward
    await page.mouse.up();
    
    // Get final transform
    const finalTransform = await rect.evaluate(el => el.style.transform);
    
    // Verify the transform has changed and includes scale
    expect(finalTransform).not.toEqual(initialTransform);
    expect(finalTransform).toContain('scale');
    
    // Extract scale values
    const scaleValues = await rect.evaluate(el => {
      const match = el.style.transform.match(/scale\(([\d.-]+),\s*([\d.-]+)\)/);
      return match ? { x: parseFloat(match[1]), y: parseFloat(match[2]) } : { x: 1, y: 1 };
    });
    
    // Verify scale is greater than 1 (enlargement)
    expect(scaleValues.x).toBeGreaterThan(1);
    expect(scaleValues.y).toBeGreaterThan(1);
    
    // Verify x and y scales are equal (uniform scaling)
    expect(scaleValues.x).toBeCloseTo(scaleValues.y, 2);
  });

  test('should calculate scale factor as ratio of distances', async ({ page }) => {
    // Create a rectangle
    const rect = await createRect(page);
    
    // Select zoom tool
    await page.click('.zoom');
    
    // Perform scaling with a specific ratio (approximately double the distance)
    await page.mouse.move(150, 150); // Move to center of rectangle
    await page.mouse.down();
    await page.mouse.move(175, 175); // Initial position (25px from center)
    await page.mouse.move(200, 200); // Final position (50px from center - double the distance)
    await page.mouse.up();
    
    // Get scale values
    const scaleValues = await rect.evaluate(el => {
      const match = el.style.transform.match(/scale\(([\d.-]+),\s*([\d.-]+)\)/);
      return match ? { x: parseFloat(match[1]), y: parseFloat(match[2]) } : { x: 1, y: 1 };
    });
    
    // Verify scale is approximately 2 (allowing for some imprecision)
    expect(scaleValues.x).toBeGreaterThan(1.5);
    expect(scaleValues.x).toBeLessThan(2.5);
    expect(scaleValues.y).toBeGreaterThan(1.5);
    expect(scaleValues.y).toBeLessThan(2.5);
  });

  test('should handle shrinking (scale factor < 1)', async ({ page }) => {
    // Create a rectangle
    const rect = await createRect(page);
    
    // Select zoom tool
    await page.click('.zoom');
    
    // Perform scaling (move toward center to shrink)
    await page.mouse.move(150, 150); // Move to center of rectangle
    await page.mouse.down();
    await page.mouse.move(200, 200); // Move away from center first
    await page.mouse.move(175, 175); // Move back toward center
    await page.mouse.up();
    
    // Get scale values
    const scaleValues = await rect.evaluate(el => {
      const match = el.style.transform.match(/scale\(([\d.-]+),\s*([\d.-]+)\)/);
      return match ? { x: parseFloat(match[1]), y: parseFloat(match[2]) } : { x: 1, y: 1 };
    });
    
    // Verify scale is less than 1 (shrinking)
    expect(scaleValues.x).toBeLessThan(1);
    expect(scaleValues.y).toBeLessThan(1);
  });

  test('should preserve existing transformations while updating scale', async ({ page }) => {
    // Create a rectangle
    const rect = await createRect(page);
    
    // First move the shape
    await page.click('.move');
    await page.mouse.move(150, 150); // Move to center of rectangle
    await page.mouse.down();
    await page.mouse.move(250, 250); // Move 100px right and down
    await page.mouse.up();
    
    // Then rotate the shape
    await page.click('.rotate');
    await page.mouse.move(250, 250); // Move to new center of rectangle
    await page.mouse.down();
    await page.mouse.move(300, 200); // Move to rotate
    await page.mouse.up();
    
    // Get transform after moving and rotating
    const transformBeforeScale = await rect.evaluate(el => el.style.transform);
    
    // Extract translation and rotation values
    const translateBefore = await rect.evaluate(el => {
      const match = el.style.transform.match(/translate\(([\d.-]+)px,\s*([\d.-]+)px\)/);
      return match ? { x: parseFloat(match[1]), y: parseFloat(match[2]) } : { x: 0, y: 0 };
    });
    
    const rotateBefore = await rect.evaluate(el => {
      const match = el.style.transform.match(/rotate\(([\d.-]+)deg\)/);
      return match ? parseFloat(match[1]) : 0;
    });
    
    // Now scale the shape
    await page.click('.zoom');
    await page.mouse.move(250, 250); // Move to new center of rectangle
    await page.mouse.down();
    await page.mouse.move(300, 300); // Move to scale
    await page.mouse.up();
    
    // Get final transform
    const finalTransform = await rect.evaluate(el => el.style.transform);
    
    // Extract final values
    const translateAfter = await rect.evaluate(el => {
      const match = el.style.transform.match(/translate\(([\d.-]+)px,\s*([\d.-]+)px\)/);
      return match ? { x: parseFloat(match[1]), y: parseFloat(match[2]) } : { x: 0, y: 0 };
    });
    
    const rotateAfter = await rect.evaluate(el => {
      const match = el.style.transform.match(/rotate\(([\d.-]+)deg\)/);
      return match ? parseFloat(match[1]) : 0;
    });
    
    // Verify that translation and rotation are preserved
    expect(finalTransform).toContain('translate');
    expect(finalTransform).toContain('rotate');
    expect(finalTransform).toContain('scale');
    
    // Verify values are preserved
    expect(translateAfter.x).toBeCloseTo(translateBefore.x, 0);
    expect(translateAfter.y).toBeCloseTo(translateBefore.y, 0);
    expect(rotateAfter).toBeCloseTo(rotateBefore, 0);
  });

  test('should handle edge cases like zero distance from center', async ({ page }) => {
    // Create a rectangle
    const rect = await createRect(page);
    
    // Select zoom tool
    await page.click('.zoom');
    
    // Perform scaling with cursor at center (zero distance)
    await page.mouse.move(150, 150); // Move to center of rectangle
    await page.mouse.down();
    await page.mouse.move(150, 150); // Stay at center (zero distance)
    await page.mouse.up();
    
    // Get scale values
    const scaleValues = await rect.evaluate(el => {
      const match = el.style.transform.match(/scale\(([\d.-]+),\s*([\d.-]+)\)/);
      return match ? { x: parseFloat(match[1]), y: parseFloat(match[2]) } : { x: 1, y: 1 };
    });
    
    // Verify scale is handled gracefully (should be 1 or very close to it)
    expect(scaleValues.x).toBeCloseTo(1, 1);
    expect(scaleValues.y).toBeCloseTo(1, 1);
  });
});