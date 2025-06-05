const { test, expect } = require('@playwright/test');

test.describe('Task 11: Memory buttons visibility and styling', () => {
  test('Test case 1: Memory buttons are visible in scientific mode', async ({ page }) => {
    await page.goto('/index.html');
    
    // Should be in scientific mode by default
    const mrButton = page.locator('text=MR');
    const mplusButton = page.locator('text=M+');
    const mminusButton = page.locator('text=M-');
    const mcButton = page.locator('text=MC');
    
    await expect(mrButton).toBeVisible();
    await expect(mplusButton).toBeVisible();
    await expect(mminusButton).toBeVisible();
    await expect(mcButton).toBeVisible();
  });

  test('Test case 2: Memory buttons have green background styling', async ({ page }) => {
    await page.goto('/index.html');
    
    const mrButton = page.locator('text=MR');
    const mplusButton = page.locator('text=M+');
    
    // Check that memory buttons have green background
    await expect(mrButton).toHaveCSS('background-color', 'rgb(76, 175, 80)'); // #4caf50
    await expect(mplusButton).toHaveCSS('background-color', 'rgb(76, 175, 80)');
    
    // Check that they have the memory-btn class
    await expect(mrButton).toHaveClass(/memory-btn/);
    await expect(mplusButton).toHaveClass(/memory-btn/);
  });

  test('Test case 3: Memory buttons are hidden in basic mode', async ({ page }) => {
    await page.goto('/index.html');
    
    // Toggle to basic mode
    await page.locator('#mode').click();
    
    const mrButton = page.locator('text=MR');
    const mplusButton = page.locator('text=M+');
    const mminusButton = page.locator('text=M-');
    const mcButton = page.locator('text=MC');
    
    await expect(mrButton).not.toBeVisible();
    await expect(mplusButton).not.toBeVisible();
    await expect(mminusButton).not.toBeVisible();
    await expect(mcButton).not.toBeVisible();
  });
});
