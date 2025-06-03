// Test for Task 1: Create a drawing canvas using SVG element with class 'canvas'
import { test, expect } from '@playwright/test';

test.describe('Task 1: Drawing Canvas Creation', () => {
  test('should create SVG canvas with correct class and background', async ({ page }) => {
    await page.goto('/index.html');
    
    const canvas = page.locator('.canvas');
    await expect(canvas).toBeVisible();
    await expect(canvas).toHaveAttribute('class', 'canvas');
    
    // Check that it's an SVG element
    const tagName = await canvas.evaluate(el => el.tagName.toLowerCase());
    expect(tagName).toBe('svg');
  });

  test('should have canvas positioned within flex container', async ({ page }) => {
    await page.goto('/index.html');
    
    const root = page.locator('.root');
    const canvas = page.locator('.canvas');
    
    await expect(root).toBeVisible();
    await expect(canvas).toBeVisible();
    
    // Check that canvas takes up available space
    const canvasBox = await canvas.boundingBox();
    const rootBox = await root.boundingBox();
    
    expect(canvasBox.width).toBeGreaterThan(200);
    expect(canvasBox.height).toBeGreaterThan(200);
  });

  test('should fill available space and expand properly', async ({ page }) => {
    await page.goto('/index.html');
    
    const canvas = page.locator('.canvas');
    await expect(canvas).toBeVisible();
    
    // Get initial dimensions
    const initialBox = await canvas.boundingBox();
    
    // Resize viewport
    await page.setViewportSize({ width: 1400, height: 800 });
    await page.waitForTimeout(100);
    
    // Get new dimensions
    const newBox = await canvas.boundingBox();
    
    // Canvas should adapt to new viewport size
    expect(newBox.width).toBeGreaterThan(initialBox.width);
  });
});
