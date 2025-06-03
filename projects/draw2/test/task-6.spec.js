// Test for Task 6: Add keyboard shortcut functionality with spacebar for move tool
import { test, expect } from '@playwright/test';

test.describe('Task 6: Keyboard Shortcut for Move Tool', () => {
  test('should temporarily switch to move tool when spacebar is pressed', async ({ page }) => {
    await page.goto('/index.html');
    
    // Select line tool initially
    await page.locator('.line').click();
    await expect(page.locator('input[value="line"]')).toBeChecked();
    
    // Press and hold spacebar
    await page.keyboard.down(' ');
    await page.waitForTimeout(100);
    
    // Should switch to move tool
    await expect(page.locator('input[value="move"]')).toBeChecked();
    await expect(page.locator('input[value="line"]')).not.toBeChecked();
  });

  test('should return to previous tool when spacebar is released', async ({ page }) => {
    await page.goto('/index.html');
    
    // Select rect tool initially
    await page.locator('.rect').click();
    await expect(page.locator('input[value="rect"]')).toBeChecked();
    
    // Press spacebar
    await page.keyboard.down(' ');
    await page.waitForTimeout(100);
    await expect(page.locator('input[value="move"]')).toBeChecked();
    
    // Release spacebar
    await page.keyboard.up(' ');
    await page.waitForTimeout(100);
    
    // Should return to rect tool
    await expect(page.locator('input[value="rect"]')).toBeChecked();
    await expect(page.locator('input[value="move"]')).not.toBeChecked();
  });

  test('should handle multiple spacebar press/release cycles correctly', async ({ page }) => {
    await page.goto('/index.html');
    
    // Select ellipse tool
    await page.locator('.ellipse').click();
    await expect(page.locator('input[value="ellipse"]')).toBeChecked();
    
    // First cycle: press and release spacebar
    await page.keyboard.down(' ');
    await page.waitForTimeout(50);
    await expect(page.locator('input[value="move"]')).toBeChecked();
    
    await page.keyboard.up(' ');
    await page.waitForTimeout(50);
    await expect(page.locator('input[value="ellipse"]')).toBeChecked();
    
    // Switch to different tool
    await page.locator('.zoom').click();
    await expect(page.locator('input[value="zoom"]')).toBeChecked();
    
    // Second cycle: press and release spacebar
    await page.keyboard.down(' ');
    await page.waitForTimeout(50);
    await expect(page.locator('input[value="move"]')).toBeChecked();
    
    await page.keyboard.up(' ');
    await page.waitForTimeout(50);
    await expect(page.locator('input[value="zoom"]')).toBeChecked();
  });
});
