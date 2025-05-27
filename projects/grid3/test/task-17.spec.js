// test/task-17.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Task 17: Footer Logo and Info', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('file://' + process.cwd() + '/src/index.html');
  });

  test('should display footer logo and info', async ({ page }) => {
    const footerLogo = page.locator('.footer-logo');
    const footerInfo = page.locator('.footer-info');
    
    await expect(footerLogo).toBeVisible();
    await expect(footerInfo).toBeVisible();
  });

  test('should show ellipsis when footer info text is too long', async ({ page }) => {
    const footerInfo = page.locator('.footer-info');
    const textOverflow = await footerInfo.evaluate(el => getComputedStyle(el).textOverflow);
    const whiteSpace = await footerInfo.evaluate(el => getComputedStyle(el).whiteSpace);
    const overflow = await footerInfo.evaluate(el => getComputedStyle(el).overflow);
    
    expect(textOverflow).toBe('ellipsis');
    expect(whiteSpace).toBe('nowrap');
    expect(overflow).toBe('hidden');
  });

  test('should use grid layout for footer', async ({ page }) => {
    const footer = page.locator('.footer');
    const display = await footer.evaluate(el => getComputedStyle(el).display);
    expect(display).toBe('grid');
  });

  test('should maintain footer visibility on window resize', async ({ page }) => {
    await page.setViewportSize({ width: 500, height: 600 });
    
    const footerLogo = page.locator('.footer-logo');
    const footerInfo = page.locator('.footer-info');
    
    await expect(footerLogo).toBeVisible();
    await expect(footerInfo).toBeVisible();
  });
});