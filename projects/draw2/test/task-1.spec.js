import { test, expect } from '@playwright/test';

test.describe('Task 1: Create drawing canvas with SVG', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
  });

  test('should have an SVG element with class canvas', async ({ page }) => {
    const canvas = await page.locator('svg.canvas');
    await expect(canvas).toBeVisible();
    await expect(canvas).toHaveCount(1);
  });

  test('canvas should fill available space', async ({ page }) => {
    const canvas = await page.locator('svg.canvas');
    const box = await canvas.boundingBox();
    
    // Canvas should have substantial size
    expect(box.width).toBeGreaterThan(100);
    expect(box.height).toBeGreaterThan(100);
  });

  test('canvas should have light gray background', async ({ page }) => {
    const canvas = await page.locator('svg.canvas');
    const backgroundColor = await canvas.evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    );
    
    // Should be a light gray color (#eee converts to rgb(238, 238, 238))
    expect(backgroundColor).toMatch(/rgb\(238,\s*238,\s*238\)/);
  });

  test('canvas should be in a flex container', async ({ page }) => {
    const canvas = await page.locator('svg.canvas');
    const parent = await canvas.locator('..');
    const display = await parent.evaluate(el => 
      window.getComputedStyle(el).display
    );
    
    // Parent should use flexbox
    expect(display).toBe('flex');
  });

  test('canvas should expand to fill remaining space', async ({ page }) => {
    const canvas = await page.locator('svg.canvas');
    const flexGrow = await canvas.evaluate(el => 
      window.getComputedStyle(el).flexGrow
    );
    
    // Canvas should grow to fill space
    expect(Number(flexGrow)).toBeGreaterThan(0);
  });
});
