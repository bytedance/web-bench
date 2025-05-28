const { test, expect } = require('@playwright/test');

test.describe('Task 17: Footer with logo and info', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('file://' + __dirname + '/../src/index.html');
    await page.setViewportSize({ width: 1200, height: 800 });
  });

  test('should display footer logo and info', async ({ page }) => {
    const footerLogo = page.locator('.footer-logo');
    const footerInfo = page.locator('.footer-info');
    
    await expect(footerLogo).toBeVisible();
    await expect(footerInfo).toBeVisible();
  });

  test('should display footer logo text', async ({ page }) => {
    const footerLogo = page.locator('.footer-logo');
    const logoText = await footerLogo.textContent();
    
    expect(logoText).toBe('Logo');
  });

  test('should display footer info text', async ({ page }) => {
    const footerInfo = page.locator('.footer-info');
    const infoText = await footerInfo.textContent();
    
    expect(infoText).toContain('Footer information');
  });

  test('should show ellipsis for footer info when space is insufficient', async ({ page }) => {
    await page.setViewportSize({ width: 400, height: 600 });
    
    const footerInfo = page.locator('.footer-info');
    const computedStyle = await footerInfo.evaluate(el => {
      const style = getComputedStyle(el);
      return {
        overflow: style.overflow,
        textOverflow: style.textOverflow,
        whiteSpace: style.whiteSpace
      };
    });
    
    expect(computedStyle.textOverflow).toBe('ellipsis');
    expect(computedStyle.whiteSpace).toBe('nowrap');
  });

  test('should position footer elements horizontally', async ({ page }) => {
    const footerLogo = page.locator('.footer-logo');
    const footerInfo = page.locator('.footer-info');
    
    const logoBox = await footerLogo.boundingBox();
    const infoBox = await footerInfo.boundingBox();
    
    expect(Math.abs(logoBox.y - infoBox.y)).toBeLessThan(10);
    expect(infoBox.x).toBeGreaterThan(logoBox.x + logoBox.width);
  });
});