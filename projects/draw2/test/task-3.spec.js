const { test, expect } = require('@playwright/test');
const coverage = require('../../../libraries/test-util/src/coverage');test.afterEach(coverage);;
test.describe('Task 3: Shape Selection Toolbar', () => {
  test('should have shape tools with radio buttons and proper labels', async ({ page }) => {
    await page.goto('/index.html');
    
    // Check for line tool
    const lineLabel = page.locator('.toolkit .shape .line');
    // const lineInput = page.locator('.toolkit .shape .line input[type="radio"][value="line"]');
    
    await expect(lineLabel).toBeVisible();
    // await expect(lineInput).toBeAttached();
    await expect(lineLabel).toHaveAttribute('title', /Line/i);
    
    // Check for rect tool
    const rectLabel = page.locator('.toolkit .shape .rect');
    // const rectInput = page.locator('.toolkit .shape .rect input[type="radio"][value="rect"]');
    
    await expect(rectLabel).toBeVisible();
    // await expect(rectInput).toBeAttached();
    await expect(rectLabel).toHaveAttribute('title', /Rect/i);
    
    // Check for ellipse tool
    const ellipseLabel = page.locator('.toolkit .shape .ellipse');
    // const ellipseInput = page.locator('.toolkit .shape .ellipse input[type="radio"][value="ellipse"]');
    
    await expect(ellipseLabel).toBeVisible();
    // await expect(ellipseInput).toBeAttached();
    await expect(ellipseLabel).toHaveAttribute('title', /Ellipse/i);
  });

  test('should have radio buttons with name="operation" for shape tools', async ({ page }) => {
    await page.goto('/index.html');
    
    const shapeInputs = page.locator('.toolkit .shape input[type="radio"]');
    const count = await shapeInputs.count();
    
    expect(count).toBe(3);
    
    // Check all have the same name attribute
    for (let i = 0; i < count; i++) {
      const input = shapeInputs.nth(i);
      await expect(input).toHaveAttribute('name', 'operation');
    }
  });

  test('should allow selecting shape tools exclusively', async ({ page }) => {
    await page.goto('/index.html');
    
    const lineInput = page.locator('.toolkit .shape .line');
    const rectInput = page.locator('.toolkit .shape .rect');
    const ellipseInput = page.locator('.toolkit .shape .ellipse');
    
    // Click line tool
    await lineInput.click();
    await expect(lineInput).toBeChecked();
    await expect(rectInput).not.toBeChecked();
    await expect(ellipseInput).not.toBeChecked();
    
    // Click rect tool
    await rectInput.click();
    await expect(lineInput).not.toBeChecked();
    await expect(rectInput).toBeChecked();
    await expect(ellipseInput).not.toBeChecked();
    
    // Click ellipse tool
    await ellipseInput.click();
    await expect(lineInput).not.toBeChecked();
    await expect(rectInput).not.toBeChecked();
    await expect(ellipseInput).toBeChecked();
  });
});
