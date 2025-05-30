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

test.describe('Task 13: Rotate Operation', () => {
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

  test('should rotate shapes around their center point', async ({ page }) => {
    // Create a rectangle
    const rect = await createRect(page);
    await expect(rect).toBeVisible();
    
    // Get initial transform
    const initialTransform = await rect.evaluate(el => el.style.transform);
    
    // Select rotate tool
    await page.click('.rotate');
    
    // Perform rotation
    await page.mouse.move(150, 150); // Move to center of rectangle
    await page.mouse.down();
    await page.mouse.move(200, 100); // Move to rotate
    await page.mouse.up();
    
    // Get final transform
    const finalTransform = await rect.evaluate(el => el.style.transform);
    
    // Verify the transform has changed and includes rotation
    expect(finalTransform).not.toEqual(initialTransform);
    expect(finalTransform).toContain('rotate');
    
    // Extract rotation value
    const rotationAngle = await rect.evaluate(el => {
      const match = el.style.transform.match(/rotate\(([\d.-]+)deg\)/);
      return match ? parseFloat(match[1]) : 0;
    });
    
    // Verify rotation angle is non-zero
    expect(Math.abs(rotationAngle)).toBeGreaterThan(0);
  });

  test('should calculate rotation angle correctly between vectors', async ({ page }) => {
    // Create a rectangle
    const rect = await createRect(page);
    
    // Select rotate tool
    await page.click('.rotate');
    
    // Perform a specific rotation (90 degrees clockwise)
    await page.mouse.move(150, 150); // Move to center of rectangle
    await page.mouse.down();
    await page.mouse.move(200, 150); // Move right (0 degrees)
    await page.mouse.move(150, 200); // Move down (90 degrees clockwise)
    await page.mouse.up();
    
    // Get rotation angle
    const rotationAngle = await rect.evaluate(el => {
      const match = el.style.transform.match(/rotate\(([\d.-]+)deg\)/);
      return match ? parseFloat(match[1]) : 0;
    });
    
    // Verify rotation is approximately 90 degrees
    // Note: The angle might not be exactly 90 due to mouse movement precision
    expect(Math.abs(rotationAngle)).toBeGreaterThan(80);
    expect(Math.abs(rotationAngle)).toBeLessThan(100);
  });

  test('should handle multiple rotation operations cumulatively', async ({ page }) => {
    // Create a rectangle
    const rect = await createRect(page);
    
    // Select rotate tool
    await page.click('.rotate');
    
    // Perform first rotation (approximately 45 degrees)
    await page.mouse.move(150, 150); // Move to center of rectangle
    await page.mouse.down();
    await page.mouse.move(200, 150); // Move right
    await page.mouse.move(185, 185); // Move diagonally (approx 45 degrees)
    await page.mouse.up();
    
    // Get first rotation angle
    const firstRotationAngle = await rect.evaluate(el => {
      const match = el.style.transform.match(/rotate\(([\d.-]+)deg\)/);
      return match ? parseFloat(match[1]) : 0;
    });
    
    // Perform second rotation (approximately another 45 degrees)
    await page.mouse.move(150, 150); // Move to center of rectangle
    await page.mouse.down();
    await page.mouse.move(185, 185); // Start from current position
    await page.mouse.move(150, 200); // Move down (another ~45 degrees)
    await page.mouse.up();
    
    // Get final rotation angle
    const finalRotationAngle = await rect.evaluate(el => {
      const match = el.style.transform.match(/rotate\(([\d.-]+)deg\)/);
      return match ? parseFloat(match[1]) : 0;
    });
    
    // Verify the final angle is approximately the sum of the two rotations
    // Allow for some imprecision due to mouse movements
    expect(Math.abs(finalRotationAngle)).toBeGreaterThan(Math.abs(firstRotationAngle));
    expect(Math.abs(finalRotationAngle)).toBeGreaterThan(70); // Should be close to 90 degrees total
  });

  test('should handle edge cases like zero-length vectors', async ({ page }) => {
    // Create a rectangle
    const rect = await createRect(page);
    
    // Select rotate tool
    await page.click('.rotate');
    
    // Perform a rotation with a zero-length vector (clicking at the center)
    await page.mouse.move(150, 150); // Move to center of rectangle
    await page.mouse.down();
    await page.mouse.move(150, 150); // Stay at the same point (zero-length vector)
    await page.mouse.up();
    
    // Get rotation angle
    const rotationAngle = await rect.evaluate(el => {
      const match = el.style.transform.match(/rotate\(([\d.-]+)deg\)/);
      return match ? parseFloat(match[1]) : 0;
    });
    
    // Verify rotation is handled gracefully (should be 0 or very close to it)
    expect(Math.abs(rotationAngle)).toBeLessThan(5);
  });

  test('should preserve translation and scale during rotation', async ({ page }) => {
    // Create a rectangle
    const rect = await createRect(page);
    
    // First move the shape
    await page.click('.move');
    await page.mouse.move(150, 150); // Move to center of rectangle
    await page.mouse.down();
    await page.mouse.move(250, 250); // Move 100px right and down
    await page.mouse.up();
    
    // Get transform after moving
    const movedTransform = await rect.evaluate(el => el.style.transform);
    const movedTranslate = await rect.evaluate(el => {
      const match = el.style.transform.match(/translate\(([\d.-]+)px,\s*([\d.-]+)px\)/);
      return match ? { x: parseFloat(match[1]), y: parseFloat(match[2]) } : { x: 0, y: 0 };
    });
    
    // Now rotate the shape
    await page.click('.rotate');
    await page.mouse.move(250, 250); // Move to new center of rectangle
    await page.mouse.down();
    await page.mouse.move(300, 200); // Move to rotate
    await page.mouse.up();
    
    // Get final transform
    const finalTransform = await rect.evaluate(el => el.style.transform);
    const finalTranslate = await rect.evaluate(el => {
      const match = el.style.transform.match(/translate\(([\d.-]+)px,\s*([\d.-]+)px\)/);
      return match ? { x: parseFloat(match[1]), y: parseFloat(match[2]) } : { x: 0, y: 0 };
    });
    
    // Verify that translation is preserved
    expect(finalTransform).toContain('translate');
    expect(finalTransform).toContain('rotate');
    
    // Verify translation values are preserved
    expect(finalTranslate.x).toBeCloseTo(movedTranslate.x, 0); // Allow for small rounding differences
    expect(finalTranslate.y).toBeCloseTo(movedTranslate.y, 0);
  });
});