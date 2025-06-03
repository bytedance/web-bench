// Test for Task 19: Implement automatic tool switching after operations
import { test, expect } from '@playwright/test';

test.describe('Task 19: Automatic Tool Switching', () => {
  test('should switch to move tool after shape creation', async ({ page }) => {
    await page.goto('/index.html');
    
    const canvas = page.locator('.canvas');
    
    // Create a line
    await page.locator('.line').click();
    await expect(page.locator('input[value="line"]')).toBeChecked();
    
    const canvasBox = await canvas.boundingBox();
    const startX = canvasBox.x + 100;
    const startY = canvasBox.y + 100;
    
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 100, startY + 50);
    await page.mouse.up();
    
    // Should automatically switch to move tool after line creation
    await page.waitForTimeout(100);
    await expect(page.locator('input[value="move"]')).toBeChecked();
    await expect(page.locator('input[value="line"]')).not.toBeChecked();
  });

  test('should switch to move tool after rectangle creation', async ({ page }) => {
    await page.goto('/index.html');
    
    const canvas = page.locator('.canvas');
    
    // Create a rectangle
    await page.locator('.rect').click();
    await expect(page.locator('input[value="rect"]')).toBeChecked();
    
    const canvasBox = await canvas.boundingBox();
    const startX = canvasBox.x + 150;
    const startY = canvasBox.y + 150;
    
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 80, startY + 60);
    await page.mouse.up();
    
    // Should automatically switch to move tool
    await page.waitForTimeout(100);
    await expect(page.locator('input[value="move"]')).toBeChecked();
    await expect(page.locator('input[value="rect"]')).not.toBeChecked();
  });

  test('should switch to move tool after copy operations', async ({ page }) => {
    await page.goto('/index.html');
    
    const canvas = page.locator('.canvas');
    
    // First create an ellipse
    await page.locator('.ellipse').click();
    const canvasBox = await canvas.boundingBox();
    const centerX = canvasBox.x + 200;
    const centerY = canvasBox.y + 200;
    
    await page.mouse.move(centerX - 40, centerY - 30);
    await page.mouse.down();
    await page.mouse.move(centerX + 40, centerY + 30);
    await page.mouse.up();
    
    // Wait for auto-switch to move tool after creation
    await page.waitForTimeout(100);
    await expect(page.locator('input[value="move"]')).toBeChecked();
    
    const ellipseElement = canvas.locator('ellipse').first();
    await expect(ellipseElement).toBeVisible();
    
    // Now switch to copy tool and copy the ellipse
    await page.locator('.copy').click();
    await expect(page.locator('input[value="copy"]')).toBeChecked();
    
    await ellipseElement.click();
    
    // Should automatically switch to move tool after copy operation
    await page.waitForTimeout(100);
    await expect(page.locator('input[value="move"]')).toBeChecked();
    await expect(page.locator('input[value="copy"]')).not.toBeChecked();
  });

  test('should not switch to move tool for non-whitelisted operations', async ({ page }) => {
    await page.goto('/index.html');
    
    const canvas = page.locator('.canvas');
    
    // First create a rectangle
    await page.locator('.rect').click();
    const canvasBox = await canvas.boundingBox();
    const startX = canvasBox.x + 150;
    const startY = canvasBox.y + 150;
    
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 80, startY + 60);
    await page.mouse.up();
    
    // Wait for auto-switch after creation
    await page.waitForTimeout(100);
    await expect(page.locator('input[value="move"]')).toBeChecked();
    
    const rectElement = canvas.locator('rect');
    
    // Test delete operation - should not auto-switch
    await page.locator('.delete').click();
    await expect(page.locator('input[value="delete"]')).toBeChecked();
    
    await rectElement.click();
    
    // Should remain on delete tool
    await page.waitForTimeout(100);
    await expect(page.locator('input[value="delete"]')).toBeChecked();
    
    // Create another shape for fill test
    await page.locator('.ellipse').click();
    await page.mouse.move(startX + 100, startY + 100);
    await page.mouse.down();
    await page.mouse.move(startX + 150, startY + 140);
    await page.mouse.up();
    
    // Wait for auto-switch after ellipse creation
    await page.waitForTimeout(100);
    await expect(page.locator('input[value="move"]')).toBeChecked();
    
    // Test fill operation - should not auto-switch
    await page.locator('.fill').click();
    await expect(page.locator('input[value="fill"]')).toBeChecked();
    
    const ellipseElement = canvas.locator('ellipse');
    await ellipseElement.click();
    
    // Should remain on fill tool
    await page.waitForTimeout(100);
    await expect(page.locator('input[value="fill"]')).toBeChecked();
  });
});
