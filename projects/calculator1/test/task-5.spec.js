const { test, expect } = require('@playwright/test');

test.describe('Task 5: Operator button styling', () => {
  test('Test case 1: Operator buttons have golden background in light mode', async ({ page }) => {
    await page.goto('/index.html');
    
    // Toggle to light mode
    await page.locator('#toggle').click();
    
    // Test operator buttons based on CSS nth-child selectors: 4, 8, 12, 16, 18
    const divideButton = page.locator('.buttons button:nth-child(4)'); // /
    const multiplyButton = page.locator('.buttons button:nth-child(8)'); // *
    const minusButton = page.locator('.buttons button:nth-child(12)'); // -
    const plusButton = page.locator('.buttons button:nth-child(16)'); // +
    const sqrtButton = page.locator('.buttons button:nth-child(18)'); // √ (this gets operator styling per CSS)
    
    await expect(divideButton).toHaveCSS('background-color', 'rgb(255, 215, 0)'); // #ffd700
    await expect(multiplyButton).toHaveCSS('background-color', 'rgb(255, 215, 0)');
    await expect(minusButton).toHaveCSS('background-color', 'rgb(255, 215, 0)');
    await expect(plusButton).toHaveCSS('background-color', 'rgb(255, 215, 0)');
    await expect(sqrtButton).toHaveCSS('background-color', 'rgb(255, 215, 0)');
  });

  test('Test case 2: Operator buttons have orange background in dark mode', async ({ page }) => {
    await page.goto('/index.html');
    
    // Should be in dark mode by default
    const divideButton = page.locator('.buttons button:nth-child(4)'); // /
    const multiplyButton = page.locator('.buttons button:nth-child(8)'); // *
    const minusButton = page.locator('.buttons button:nth-child(12)'); // -
    
    await expect(divideButton).toHaveCSS('background-color', 'rgb(255, 140, 0)'); // #ff8c00
    await expect(multiplyButton).toHaveCSS('background-color', 'rgb(255, 140, 0)');
    await expect(minusButton).toHaveCSS('background-color', 'rgb(255, 140, 0)');
  });

  test('Test case 3: Operator buttons have hover states', async ({ page }) => {
    await page.goto('/index.html');
    
    const divideButton = page.locator('.buttons button:nth-child(4)'); // /
    
    // Test hover in dark mode
    await divideButton.hover();
    // Hover color should be different from default
    await expect(divideButton).toHaveCSS('background-color', 'rgb(255, 165, 0)'); // #ffa500 (hover in dark mode)
    
    // Toggle to light mode and test hover
    await page.locator('#toggle').click();
    await divideButton.hover();
    await expect(divideButton).toHaveCSS('background-color', 'rgb(255, 237, 74)'); // #ffed4a (hover in light mode)
  });
});
