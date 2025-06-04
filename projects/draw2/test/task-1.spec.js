const { test, expect } = require('@playwright/test');
require('../../../libraries/test-util/src/coverage');
test.describe('Task 1: Basic HTML Structure', () => {
  test('should have root container with toolkit and canvas', async ({ page }) => {
    await page.goto('/index.html');
    
    // Check if .root exists
    const root = page.locator('.root');
    await expect(root).toBeAttached();
    
    // Check if .toolkit exists inside .root
    const toolkit = page.locator('.root .toolkit');
    await expect(toolkit).toBeAttached();
    
    // Check if .canvas (SVG) exists inside .root
    const canvas = page.locator('.root .canvas');
    await expect(canvas).toBeAttached();
    await expect(canvas).toHaveAttribute('xmlns', 'http://www.w3.org/2000/svg');
  });

  test('should have proper toolkit structure with shape, prop, and operation sections', async ({ page }) => {
    await page.goto('/index.html');
    
    // Check toolkit sections exist
    const shapeSection = page.locator('.toolkit .shape');
    const propSection = page.locator('.toolkit .prop');
    const operationSection = page.locator('.toolkit .operation');
    
    await expect(shapeSection).toBeAttached();
    await expect(propSection).toBeAttached();
    await expect(operationSection).toBeAttached();
  });

  test('should have SVG canvas element with correct namespace', async ({ page }) => {
    await page.goto('/index.html');
    
    const canvas = page.locator('.canvas');
    await expect(canvas).toBeAttached();
    
    // Verify it's an SVG element
    const tagName = await canvas.evaluate(el => el.tagName.toLowerCase());
    expect(tagName).toBe('svg');
    
    // Check SVG namespace
    await expect(canvas).toHaveAttribute('xmlns', 'http://www.w3.org/2000/svg');
  });
});
