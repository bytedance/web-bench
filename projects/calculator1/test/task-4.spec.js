const { test, expect } = require('@playwright/test');

test.describe('Task 4: Page and calculator background styling', () => {
  test('Test case 1: Page background is gray (#aaa)', async ({ page }) => {
    await page.goto('/index.html');
    
    // Check body background color
    const body = page.locator('body');
    await expect(body).toHaveCSS('background-color', 'rgb(170, 170, 170)'); // #aaa
  });

  test('Test case 2: Calculator container has white background in light mode', async ({ page }) => {
    await page.goto('/index.html');
    
    const calculator = page.locator('.calculator');
    
    // Toggle to light mode first
    await page.locator('#toggle').click();
    
    // Check calculator background is white
    await expect(calculator).toHaveCSS('background-color', 'rgb(255, 255, 255)'); // #fff
  });

  test('Test case 3: Visual separation between page and calculator is apparent', async ({ page }) => {
    await page.goto('/index.html');
    
    const body = page.locator('body');
    const calculator = page.locator('.calculator');
    
    // Toggle to light mode to see contrast
    await page.locator('#toggle').click();
    
    // Get computed styles
    const bodyBgColor = await body.evaluate(el => getComputedStyle(el).backgroundColor);
    const calcBgColor = await calculator.evaluate(el => getComputedStyle(el).backgroundColor);
    
    // Ensure they are different for visual separation
    expect(bodyBgColor).not.toBe(calcBgColor);
    
    // Check that calculator has border for additional separation
    await expect(calculator).toHaveCSS('border-width', '1px');
  });
});
