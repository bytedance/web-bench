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

test.describe('Task 20: Undo/Redo Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // Helper function to create a rectangle
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

  // Helper function to create a line
  async function createLine(page) {
    // Select line tool
    await page.click('.line');
    
    // Draw a line
    await page.mouse.move(150, 150);
    await page.mouse.down();
    await page.mouse.move(250, 250);
    await page.mouse.up();
    
    // Return the created line element
    return page.locator('line');
  }

  // Helper function to create an ellipse
  async function createEllipse(page) {
    // Select ellipse tool
    await page.click('.ellipse');
    
    // Draw an ellipse
    await page.mouse.move(300, 150);
    await page.mouse.down();
    await page.mouse.move(350, 200);
    await page.mouse.up();
    
    // Return the created ellipse element
    return page.locator('ellipse');
  }

  test('should undo shape creation', async ({ page }) => {
    // Create a rectangle
    const rect = await createRect(page);
    await expect(rect).toBeVisible();
    
    // Press Ctrl+Z to undo
    await page.keyboard.press('Control+z');
    
    // Verify rectangle is no longer visible
    await expect(rect).not.toBeVisible();
  });

  test('should redo shape creation after undo', async ({ page }) => {
    // Create a rectangle
    const rect = await createRect(page);
    await expect(rect).toBeVisible();
    
    // Press Ctrl+Z to undo
    await page.keyboard.press('Control+z');
    await expect(rect).not.toBeVisible();
    
    // Press Ctrl+Y to redo
    await page.keyboard.press('Control+y');
    
    // Verify rectangle is visible again
    await expect(rect).toBeVisible();
  });

  test('should undo multiple shape creations in reverse order', async ({ page }) => {
    // Create three shapes
    const rect = await createRect(page);
    const line = await createLine(page);
    const ellipse = await createEllipse(page);
    
    // Verify all shapes are visible
    await expect(rect).toBeVisible();
    await expect(line).toBeVisible();
    await expect(ellipse).toBeVisible();
    
    // Undo ellipse creation (last shape)
    await page.keyboard.press('Control+z');
    await expect(ellipse).not.toBeVisible();
    await expect(rect).toBeVisible();
    await expect(line).toBeVisible();
    
    // Undo line creation (second shape)
    await page.keyboard.press('Control+z');
    await expect(ellipse).not.toBeVisible();
    await expect(line).not.toBeVisible();
    await expect(rect).toBeVisible();
    
    // Undo rectangle creation (first shape)
    await page.keyboard.press('Control+z');
    await expect(ellipse).not.toBeVisible();
    await expect(line).not.toBeVisible();
    await expect(rect).not.toBeVisible();
  });

  test('should redo multiple shape creations in original order', async ({ page }) => {
    // Create three shapes
    const rect = await createRect(page);
    const line = await createLine(page);
    const ellipse = await createEllipse(page);
    
    // Undo all three shapes
    await page.keyboard.press('Control+z');
    await page.keyboard.press('Control+z');
    await page.keyboard.press('Control+z');
    
    // Verify no shapes are visible
    await expect(rect).not.toBeVisible();
    await expect(line).not.toBeVisible();
    await expect(ellipse).not.toBeVisible();
    
    // Redo rectangle creation (first shape)
    await page.keyboard.press('Control+y');
    await expect(rect).toBeVisible();
    await expect(line).not.toBeVisible();
    await expect(ellipse).not.toBeVisible();
    
    // Redo line creation (second shape)
    await page.keyboard.press('Control+y');
    await expect(rect).toBeVisible();
    await expect(line).toBeVisible();
    await expect(ellipse).not.toBeVisible();
    
    // Redo ellipse creation (third shape)
    await page.keyboard.press('Control+y');
    await expect(rect).toBeVisible();
    await expect(line).toBeVisible();
    await expect(ellipse).toBeVisible();
  });

  test('should undo shape movement', async ({ page }) => {
    // Create a rectangle
    const rect = await createRect(page);
    await expect(rect).toBeVisible();
    
    // Get initial transform
    const initialTransform = await rect.getAttribute('style');
    
    // Select move tool
    await page.click('.move');
    
    // Move the rectangle
    await page.mouse.move(150, 150); // Center of rectangle
    await page.mouse.down();
    await page.mouse.move(250, 250); // Move 100px right and down
    await page.mouse.up();
    
    // Get new transform
    const newTransform = await rect.getAttribute('style');
    
    // Verify transform has changed
    expect(newTransform).not.toEqual(initialTransform);
    
    // Press Ctrl+Z to undo
    await page.keyboard.press('Control+z');
    
    // Get transform after undo
    const undoTransform = await rect.getAttribute('style');
    
    // Verify transform is back to initial state
    expect(undoTransform).toEqual(initialTransform);
  });

  test('should undo shape rotation', async ({ page }) => {
    // Create a rectangle
    const rect = await createRect(page);
    await expect(rect).toBeVisible();
    
    // Get initial transform
    const initialTransform = await rect.getAttribute('style');
    
    // Select rotate tool
    await page.click('.rotate');
    
    // Rotate the rectangle
    await page.mouse.move(150, 150); // Center of rectangle
    await page.mouse.down();
    await page.mouse.move(200, 100); // Move to rotate
    await page.mouse.up();
    
    // Get new transform
    const newTransform = await rect.getAttribute('style');
    
    // Verify transform has changed
    expect(newTransform).not.toEqual(initialTransform);
    
    // Press Ctrl+Z to undo
    await page.keyboard.press('Control+z');
    
    // Get transform after undo
    const undoTransform = await rect.getAttribute('style');
    
    // Verify transform is back to initial state
    expect(undoTransform).toEqual(initialTransform);
  });

  test('should undo shape scaling', async ({ page }) => {
    // Create a rectangle
    const rect = await createRect(page);
    await expect(rect).toBeVisible();
    
    // Get initial transform
    const initialTransform = await rect.getAttribute('style');
    
    // Select zoom tool
    await page.click('.zoom');
    
    // Scale the rectangle
    await page.mouse.move(150, 150); // Center of rectangle
    await page.mouse.down();
    await page.mouse.move(200, 200); // Move to scale
    await page.mouse.up();
    
    // Get new transform
    const newTransform = await rect.getAttribute('style');
    
    // Verify transform has changed
    expect(newTransform).not.toEqual(initialTransform);
    
    // Press Ctrl+Z to undo
    await page.keyboard.press('Control+z');
    
    // Get transform after undo
    const undoTransform = await rect.getAttribute('style');
    
    // Verify transform is back to initial state
    expect(undoTransform).toEqual(initialTransform);
  });

  test('should undo shape deletion', async ({ page }) => {
    // Create a rectangle
    const rect = await createRect(page);
    await expect(rect).toBeVisible();
    
    // Select delete tool
    await page.click('.delete');
    
    // Delete the rectangle
    await page.mouse.move(150, 150); // Center of rectangle
    await page.mouse.click();
    
    // Verify rectangle is no longer visible
    await expect(rect).not.toBeVisible();
    
    // Press Ctrl+Z to undo
    await page.keyboard.press('Control+z');
    
    // Verify rectangle is visible again
    await expect(rect).toBeVisible();
  });

  test('should undo shape fill color change', async ({ page }) => {
    // Create a rectangle
    const rect = await createRect(page);
    await expect(rect).toBeVisible();
    
    // Get initial fill color
    const initialFill = await rect.getAttribute('fill');
    
    // Change color in the color picker
    await page.fill('.color', '#ff0000'); // Set to red
    
    // Select fill tool
    await page.click('.fill');
    
    // Fill the rectangle
    await page.mouse.move(150, 150); // Center of rectangle
    await page.mouse.click();
    
    // Get new fill color
    const newFill = await rect.getAttribute('fill');
    
    // Verify fill color has changed
    expect(newFill.toLowerCase()).toBe('#ff0000');
    
    // Press Ctrl+Z to undo
    await page.keyboard.press('Control+z');
    
    // Get fill color after undo
    const undoFill = await rect.getAttribute('fill');
    
    // Verify fill color is back to initial state
    expect(undoFill).toEqual(initialFill);
  });

  test('should undo shape copy', async ({ page }) => {
    // Create a rectangle
    const rect = await createRect(page);
    await expect(rect).toBeVisible();
    
    // Select copy tool
    await page.click('.copy');
    
    // Copy the rectangle
    await page.mouse.move(150, 150); // Center of rectangle
    await page.mouse.click();
    
    // Wait for the copy to be created
    await page.waitForTimeout(100);
    
    // Verify there are now two rectangles
    const rects = page.locator('rect');
    await expect(rects).toHaveCount(2);
    
    // Press Ctrl+Z to undo
    await page.keyboard.press('Control+z');
    
    // Verify there is only one rectangle again
    await expect(rects).toHaveCount(1);
  });

  test('should clear redo stack after new action', async ({ page }) => {
    // Create a rectangle
    const rect = await createRect(page);
    await expect(rect).toBeVisible();
    
    // Undo rectangle creation
    await page.keyboard.press('Control+z');
    await expect(rect).not.toBeVisible();
    
    // Create a new shape (line)
    const line = await createLine(page);
    await expect(line).toBeVisible();
    
    // Try to redo rectangle creation (should not work because redo stack was cleared)
    await page.keyboard.press('Control+y');
    
    // Verify rectangle is still not visible
    await expect(rect).not.toBeVisible();
    
    // Verify line is still visible
    await expect(line).toBeVisible();
  });

  test('should handle undo/redo with keyboard shortcuts', async ({ page }) => {
    // Create a rectangle
    const rect = await createRect(page);
    await expect(rect).toBeVisible();
    
    // Test different keyboard shortcuts for undo
    // Ctrl+Z
    await page.keyboard.press('Control+z');
    await expect(rect).not.toBeVisible();
    
    // Ctrl+Y for redo
    await page.keyboard.press('Control+y');
    await expect(rect).toBeVisible();
    
    // Meta+Z (Command+Z on Mac)
    await page.keyboard.press('Meta+z');
    await expect(rect).not.toBeVisible();
    
    // Meta+Shift+Z for redo on Mac
    await page.keyboard.press('Meta+Shift+z');
    await expect(rect).toBeVisible();
  });
});