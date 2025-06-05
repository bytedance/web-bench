const { test, expect } = require('@playwright/test');

test.describe('Task 10: Trigonometric function buttons', () => {
  test('Test case 1: Trigonometric buttons are visible in scientific mode', async ({ page }) => {
    await page.goto('/index.html');
    
    // Should be in scientific mode by default
    const sinButton = page.locator('text=sin');
    const cosButton = page.locator('text=cos');
    const tanButton = page.locator('text=tan');
    const sinhButton = page.locator('text=sinh');
    const coshButton = page.locator('text=cosh');
    
    await expect(sinButton).toBeVisible();
    await expect(cosButton).toBeVisible();
    await expect(tanButton).toBeVisible();
    await expect(sinhButton).toBeVisible();
    await expect(coshButton).toBeVisible();
  });

  test('Test case 2: Trigonometric functions calculate correctly', async ({ page }) => {
    await page.goto('/index.html');
    
    const display = page.locator('#display');
    
    // Test sin(0) = 0
    await page.locator('text=0').click();
    await page.locator('text=sin').click();
    const sinResult = await display.inputValue();
    expect(parseFloat(sinResult)).toBeCloseTo(0, 10);
    
    // Test cos(0) = 1
    await page.locator('text=Clear').click();
    await page.locator('text=0').click();
    await page.locator('text=cos').click();
    const cosResult = await display.inputValue();
    expect(parseFloat(cosResult)).toBeCloseTo(1, 10);
    
    // Test tan(0) = 0
    await page.locator('text=Clear').click();
    await page.locator('text=0').click();
    await page.locator('text=tan').click();
    const tanResult = await display.inputValue();
    expect(parseFloat(tanResult)).toBeCloseTo(0, 10);
  });

  test('Test case 3: Hyperbolic functions work correctly', async ({ page }) => {
    await page.goto('/index.html');
    
    const display = page.locator('#display');
    
    // Test sinh(0) = 0
    await page.locator('text=0').click();
    await page.locator('text=sinh').click();
    const sinhResult = await display.inputValue();
    expect(parseFloat(sinhResult)).toBeCloseTo(0, 10);
    
    // Test cosh(0) = 1
    await page.locator('text=Clear').click();
    await page.locator('text=0').click();
    await page.locator('text=cosh').click();
    const coshResult = await display.inputValue();
    expect(parseFloat(coshResult)).toBeCloseTo(1, 10);
  });
});
