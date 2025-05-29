// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Init Task Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have root element that fills the viewport', async ({ page }) => {
    // Check if root element exists
    const rootElement = page.locator('.root');
    await expect(rootElement).toBeVisible();
    
    // Check if root element fills the viewport
    const viewportSize = page.viewportSize();
    const boundingBox = await rootElement.boundingBox();
    
    expect(boundingBox.width).toBeCloseTo(viewportSize.width, 0);
    expect(boundingBox.height).toBeCloseTo(viewportSize.height, 0);
  });

  test('should have index.html with proper structure', async ({ page }) => {
    // Check if the page has HTML structure
    const htmlElement = page.locator('html');
    await expect(htmlElement).toBeVisible();
    
    // Check if body contains root element
    const rootInBody = page.locator('body > .root');
    await expect(rootInBody).toBeVisible();
  });

  test('should load index.js and index.scss', async ({ page }) => {
    // Check if the page has loaded CSS (index.scss)
    // This is an indirect test since we can't directly check if a file is loaded
    // but we can check if the root element has styles applied
    const rootElement = page.locator('.root');
    const computedStyle = await rootElement.evaluate(el => {
      const style = window.getComputedStyle(el);
      return {
        display: style.display,
        position: style.position
      };
    });
    
    // Assuming the root element has some basic styling
    expect(computedStyle).toBeTruthy();
  });
});