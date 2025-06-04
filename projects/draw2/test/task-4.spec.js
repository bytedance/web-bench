const { test, expect } = require('@playwright/test');
const coverage = require('../../../libraries/test-util/src/coverage');test.afterEach(coverage);;
test.describe('Task 4: Property Controls', () => {
  test('should have line width range input with correct attributes', async ({ page }) => {
    await page.goto('/index.html');
    
    const lineWidthInput = page.locator('.toolkit .prop .line-width');
    
    await expect(lineWidthInput).toBeVisible();
    await expect(lineWidthInput).toHaveAttribute('type', 'range');
    await expect(lineWidthInput).toHaveAttribute('min', '1');
    await expect(lineWidthInput).toHaveAttribute('max', '21');
    await expect(lineWidthInput).toHaveAttribute('step', '4');
    await expect(lineWidthInput).toHaveAttribute('value', '9');
  });

  test('should have color input with correct type and default value', async ({ page }) => {
    await page.goto('/index.html');
    
    const colorInput = page.locator('.toolkit .prop .color');
    
    await expect(colorInput).toBeVisible();
    await expect(colorInput).toHaveAttribute('type', 'color');
    await expect(colorInput).toHaveAttribute('value', '#000000');
  });

  test('should allow changing line width and color values', async ({ page }) => {
    await page.goto('/index.html');
    
    const lineWidthInput = page.locator('.toolkit .prop .line-width');
    const colorInput = page.locator('.toolkit .prop .color');
    
    // Test line width change
    await lineWidthInput.fill('13');
    await expect(lineWidthInput).toHaveValue('13');
    
    await lineWidthInput.fill('21');
    await expect(lineWidthInput).toHaveValue('21');
    
    // Test color change
    await colorInput.fill('#ff0000');
    await expect(colorInput).toHaveValue('#ff0000');
    
    await colorInput.fill('#00ff00');
    await expect(colorInput).toHaveValue('#00ff00');
  });
});
