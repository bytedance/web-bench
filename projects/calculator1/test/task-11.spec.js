const { test, expect } = require('@playwright/test');

test.describe('Task 11: Memory buttons visibility and styling', () => {
  test('Test case 1: Memory buttons are visible in scientific mode', async ({ page }) => {
    await page.goto('/index.html');
    
    // Should be in scientific mode by default
    const mrButton = page.locator('button:has-text("MR")');
    const mplusButton = page.locator('button:has-text("M+")');
    const mminusButton = page.locator('button:has-text("M-")');
    const mcButton = page.locator('button:has-text("MC")');
    
    await expect(mrButton).toBeVisible();
    await expect(mplusButton).toBeVisible();
    await expect(mminusButton).toBeVisible();
    await expect(mcButton).toBeVisible();
  });

  test('Test case 2: Memory buttons have green background styling', async ({ page }) => {
    await page.goto('/index.html');
    
    const mrButton = page.locator('button:has-text("MR")');
    const mplusButton = page.locator('button:has-text("M+")');
    
    // Check that memory buttons have green background (in dark mode, it's darker green)
    // Based on the CSS, in dark mode memory buttons should be #2e7d32
    await expect(mrButton).toHaveCSS('background-color', 'rgb(46, 125, 50)'); // #2e7d32
    await expect(mplusButton).toHaveCSS('background-color', 'rgb(46, 125, 50)');
    
    // Check that they have the memory-btn class
    await expect(mrButton).toHaveClass(/memory-btn/);
    await expect(mplusButton).toHaveClass(/memory-btn/);
  });

  test('Test case 3: Memory buttons visibility changes in basic mode', async ({ page }) => {
    await page.goto('/index.html');
    
    // Toggle to basic mode
    await page.locator('#mode').click();
    
    const mrButton = page.locator('button:has-text("MR")');
    const mplusButton = page.locator('button:has-text("M+")');
    const mminusButton = page.locator('button:has-text("M-")');
    const mcButton = page.locator('button:has-text("MC")');
    
    // Check if CSS display property is set to none
    await expect(mrButton).toHaveCSS('display', 'none');
    await expect(mplusButton).toHaveCSS('display', 'none');
    await expect(mminusButton).toHaveCSS('display', 'none');
    await expect(mcButton).toHaveCSS('display', 'none');
  });
});
