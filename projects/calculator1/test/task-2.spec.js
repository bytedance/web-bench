const { test, expect } = require('@playwright/test');

test.describe('Task 2: Dark mode styling', () => {
  test('Test case 1: Calculator background changes in dark mode', async ({ page }) => {
    await page.goto('/index.html');
    
    const calculator = page.locator('.calculator');
    
    // Test dark mode styling (initial state)
    await expect(calculator).toHaveCSS('background-color', 'rgb(51, 51, 51)'); // #333
    
    // Toggle to light mode
    await page.locator('#toggle').click();
    await expect(calculator).toHaveCSS('background-color', 'rgb(255, 255, 255)'); // #fff
  });

  test('Test case 2: Display background changes appropriately', async ({ page }) => {
    await page.goto('/index.html');
    
    const display = page.locator('.display');
    
    // Test dark mode display styling (initial state)
    await expect(display).toHaveCSS('background-color', 'rgb(68, 68, 68)'); // #444
    await expect(display).toHaveCSS('color', 'rgb(255, 255, 255)'); // white text
    
    // Toggle to light mode
    await page.locator('#toggle').click();
    await expect(display).toHaveCSS('background-color', 'rgb(255, 255, 255)'); // #fff
    await expect(display).toHaveCSS('color', 'rgb(0, 0, 0)'); // black text
  });

  test('Test case 3: Button colors change in dark mode', async ({ page }) => {
    await page.goto('/index.html');
    
    // Get a regular button (not operator)
    const regularButton = page.locator('.buttons button').first();
    
    // Test dark mode button styling (initial state)
    await expect(regularButton).toHaveCSS('background-color', 'rgb(68, 68, 68)'); // #444
    await expect(regularButton).toHaveCSS('color', 'rgb(255, 255, 255)'); // white text
    
    // Toggle to light mode
    await page.locator('#toggle').click();
    await expect(regularButton).toHaveCSS('background-color', 'rgb(255, 255, 255)'); // #fff
    await expect(regularButton).toHaveCSS('color', 'rgb(0, 0, 0)'); // black text
  });
});
