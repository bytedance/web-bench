const { test, expect } = require('@playwright/test');

test.describe('Task 1: Basic grid layout with header, footer, content', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('file://' + __dirname + '/../src/index.html');
    // await page.goto('file://' + __dirname + '/../src/index.html');
  });

  test('should display header, content, and footer elements', async ({ page }) => {
    await expect(page.locator('.header')).toBeVisible();
    await expect(page.locator('.content')).toBeVisible();
    await expect(page.locator('.footer')).toBeVisible();
  });

  test('should have header at top of viewport', async ({ page }) => {
    const header = page.locator('.header');
    const headerBox = await header.boundingBox();
    expect(headerBox.y).toBeLessThan(10);
  });

  test('should have footer at bottom of viewport', async ({ page }) => {
    const footer = page.locator('.footer');
    const footerBox = await footer.boundingBox();
    const viewportHeight = await page.evaluate(() => window.innerHeight);
    expect(footerBox.y + footerBox.height).toBeGreaterThan(viewportHeight - 10);
  });

  test('should have content occupy remaining space between header and footer', async ({ page }) => {
    const header = page.locator('.header');
    const content = page.locator('.content');
    const footer = page.locator('.footer');
    
    const headerBox = await header.boundingBox();
    const contentBox = await content.boundingBox();
    const footerBox = await footer.boundingBox();
    
    expect(contentBox.y).toBeGreaterThan(headerBox.y + headerBox.height - 5);
    expect(contentBox.y + contentBox.height).toBeLessThan(footerBox.y + 5);
  });

  test('should occupy full viewport dimensions', async ({ page }) => {
    const root = page.locator('.root');
    const rootBox = await root.boundingBox();
    const viewportSize = await page.viewportSize();
    
    expect(rootBox.width).toBeCloseTo(viewportSize.width, 5);
    expect(rootBox.height).toBeCloseTo(viewportSize.height, 5);
  });
});