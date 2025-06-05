const { test, expect } = require('@playwright/test');

test.describe('Task 7: Scientific operation buttons visibility', () => {
  test('Test case 1: Scientific buttons are visible in scientific mode', async ({ page }) => {
    await page.goto('/index.html');
    
    // Should be in scientific mode by default
    const sqrtButton = page.locator('button:has-text("√")');
    const squareButton = page.locator('button:has-text("^2")');
    const reciprocalButton = page.locator('button:has-text("1/x")');
    const piButton = page.locator('button:has-text("π")');
    
    await expect(sqrtButton).toBeVisible();
    await expect(squareButton).toBeVisible();
    await expect(reciprocalButton).toBeVisible();
    await expect(piButton).toBeVisible();
  });

  test('Test case 2: CSS controls scientific button visibility correctly', async ({ page }) => {
    await page.goto('/index.html');
    
    const calculator = page.locator('.calculator');
    
    // Check initial state - should have scientific class
    await expect(calculator).toHaveClass(/scientific/);
    
    // Toggle to basic mode
    await page.locator('#mode').click();
    
    // Should no longer have scientific class
    await expect(calculator).not.toHaveClass(/scientific/);
    
    // The CSS rule .buttons button:nth-of-type(n + 19) { display: none; }
    // applies to buttons at position 19 and beyond when NOT in scientific mode
    // √ is at position 18, ^2 is at position 19, 1/x is at position 20, π is at position 21
    
    const squareButton = page.locator('button:has-text("^2")'); // Position 19
    const reciprocalButton = page.locator('button:has-text("1/x")'); // Position 20
    const piButton = page.locator('button:has-text("π")'); // Position 21
    
    // These buttons (19+) should have display: none in basic mode
    const squareDisplay = await squareButton.evaluate(el => getComputedStyle(el).display);
    const reciprocalDisplay = await reciprocalButton.evaluate(el => getComputedStyle(el).display);
    const piDisplay = await piButton.evaluate(el => getComputedStyle(el).display);
    
    expect(squareDisplay).toBe('none');
    expect(reciprocalDisplay).toBe('none');
    expect(piDisplay).toBe('none');
  });

  test('Test case 3: Scientific buttons toggle with class changes', async ({ page }) => {
    await page.goto('/index.html');
    
    const modeButton = page.locator('#mode');
    const calculator = page.locator('.calculator');
    const squareButton = page.locator('button:has-text("^2")'); // Position 19 - affected by CSS rule
    
    // Initially in scientific mode - button should be visible
    await expect(calculator).toHaveClass(/scientific/);
    await expect(squareButton).toBeVisible();
    
    // Toggle to basic mode
    await modeButton.click();
    await expect(calculator).not.toHaveClass(/scientific/);
    
    // Button 19+ should be hidden
    const displayProperty = await squareButton.evaluate(el => getComputedStyle(el).display);
    expect(displayProperty).toBe('none');
    
    // Toggle back to scientific mode
    await modeButton.click();
    await expect(calculator).toHaveClass(/scientific/);
    await expect(squareButton).toBeVisible();
  });
});
