const { test, expect } = require('@playwright/test');

test.describe('Task 7: Scientific operation buttons visibility', () => {
  test('Test case 1: Scientific buttons are visible in scientific mode', async ({ page }) => {
    await page.goto('/index.html');
    
    // Should be in scientific mode by default
    const sqrtButton = page.locator('text=√');
    const squareButton = page.locator('text=^2');
    const reciprocalButton = page.locator('text=1/x');
    const piButton = page.locator('text=π');
    
    await expect(sqrtButton).toBeVisible();
    await expect(squareButton).toBeVisible();
    await expect(reciprocalButton).toBeVisible();
    await expect(piButton).toBeVisible();
  });

  test('Test case 2: Scientific buttons are hidden in basic mode', async ({ page }) => {
    await page.goto('/index.html');
    
    // Toggle to basic mode
    await page.locator('#mode').click();
    
    const sqrtButton = page.locator('text=√');
    const squareButton = page.locator('text=^2');
    const reciprocalButton = page.locator('text=1/x');
    const piButton = page.locator('text=π');
    
    await expect(sqrtButton).not.toBeVisible();
    await expect(squareButton).not.toBeVisible();
    await expect(reciprocalButton).not.toBeVisible();
    await expect(piButton).not.toBeVisible();
  });

  test('Test case 3: Scientific buttons toggle visibility with mode changes', async ({ page }) => {
    await page.goto('/index.html');
    
    const sqrtButton = page.locator('text=√');
    const modeButton = page.locator('#mode');
    
    // Initially in scientific mode - button should be visible
    await expect(sqrtButton).toBeVisible();
    
    // Toggle to basic mode - button should be hidden
    await modeButton.click();
    await expect(sqrtButton).not.toBeVisible();
    
    // Toggle back to scientific mode - button should be visible again
    await modeButton.click();
    await expect(sqrtButton).toBeVisible();
  });
});
