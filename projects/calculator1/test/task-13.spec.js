const { test, expect } = require('@playwright/test');

test.describe('Task 13: Info panels container', () => {
  test('Test case 1: Info panels container exists with correct class', async ({ page }) => {
    await page.goto('/index.html');
    
    const infoPanels = page.locator('.info-panels');
    await expect(infoPanels).toBeAttached();
    await expect(infoPanels).toHaveClass('info-panels');
  });

  test('Test case 2: Info panels are visible only in scientific mode', async ({ page }) => {
    await page.goto('/index.html');
    
    const infoPanels = page.locator('.info-panels');
    
    // Should be visible in scientific mode (initial state)
    await expect(infoPanels).toBeVisible();
    
    // Toggle to basic mode - should be hidden
    await page.locator('#mode').click();
    await expect(infoPanels).not.toBeVisible();
    
    // Toggle back to scientific mode - should be visible again
    await page.locator('#mode').click();
    await expect(infoPanels).toBeVisible();
  });

  test('Test case 3: Info panels have visual separation from calculator buttons', async ({ page }) => {
    await page.goto('/index.html');
    
    const infoPanels = page.locator('.info-panels');
    
    // Check that info panels have border-top for visual separation
    await expect(infoPanels).toHaveCSS('border-top-width', '1px');
    await expect(infoPanels).toHaveCSS('border-top-style', 'solid');
    
    // Check that it's positioned below buttons (has margin-top)
    await expect(infoPanels).toHaveCSS('margin-top', '15px');
  });
});
