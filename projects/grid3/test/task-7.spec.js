const { test, expect } = require('@playwright/test');

test.describe('Task 7: Content and rightbar layout below 400px', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('file://' + __dirname + '/../src/index.html');
  });

  test('should make content occupy full width when width < 400px', async ({ page }) => {
    await page.setViewportSize({ width: 350, height: 600 });
    
    const content = page.locator('.content');
    const contentBox = await content.boundingBox();
    
    expect(contentBox.width).toBeCloseTo(350, 20);
    expect(contentBox.x).toBeLessThan(10);
  });

  test('should position rightbar below content when width < 400px', async ({ page }) => {
    await page.setViewportSize({ width: 350, height: 600 });
    
    const content = page.locator('.content');
    const rightbar = page.locator('.rightbar');
    
    const contentBox = await content.boundingBox();
    const rightbarBox = await rightbar.boundingBox();
    
    expect(rightbarBox.y).toBeGreaterThan(contentBox.y + contentBox.height - 10);
  });

  test('should make rightbar occupy full width when width < 400px', async ({ page }) => {
    await page.setViewportSize({ width: 350, height: 600 });
    
    const rightbar = page.locator('.rightbar');
    const rightbarBox = await rightbar.boundingBox();
    
    expect(rightbarBox.width).toBeCloseTo(350, 20);
    expect(rightbarBox.x).toBeLessThan(10);
  });

  test('should maintain side-by-side layout when width >= 400px', async ({ page }) => {
    await page.setViewportSize({ width: 500, height: 600 });
    
    const content = page.locator('.content');
    const rightbar = page.locator('.rightbar');
    
    const contentBox = await content.boundingBox();
    const rightbarBox = await rightbar.boundingBox();
    
    expect(rightbarBox.x).toBeGreaterThan(contentBox.x + contentBox.width - 10);
    expect(Math.abs(contentBox.y - rightbarBox.y)).toBeLessThan(20);
  });

  test('should stack elements vertically in correct order when width < 400px', async ({ page }) => {
    await page.setViewportSize({ width: 350, height: 800 });
    
    const header = page.locator('.header');
    const content = page.locator('.content');
    const rightbar = page.locator('.rightbar');
    const footer = page.locator('.footer');
    
    const headerBox = await header.boundingBox();
    const contentBox = await content.boundingBox();
    const rightbarBox = await rightbar.boundingBox();
    const footerBox = await footer.boundingBox();
    
    expect(contentBox.y).toBeGreaterThan(headerBox.y + headerBox.height - 5);
    expect(rightbarBox.y).toBeGreaterThan(contentBox.y + contentBox.height - 5);
    expect(footerBox.y).toBeGreaterThan(rightbarBox.y + rightbarBox.height - 5);
  });
});