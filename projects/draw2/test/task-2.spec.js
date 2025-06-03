import { test, expect } from '@playwright/test';

test.describe('Task 2: Build toolbar interface', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
  });

  test('should have shape tools section with line, rect, and ellipse', async ({ page }) => {
    // Check for shape tool inputs
    const lineInput = await page.locator('input[type="radio"][name="operation"][value="line"]');
    const rectInput = await page.locator('input[type="radio"][name="operation"][value="rect"]');
    const ellipseInput = await page.locator('input[type="radio"][name="operation"][value="ellipse"]');
    
    await expect(lineInput).toHaveCount(1);
    await expect(rectInput).toHaveCount(1);
    await expect(ellipseInput).toHaveCount(1);
  });

  test('should have property controls for line width and color', async ({ page }) => {
    // Check for line width slider
    const lineWidthSlider = await page.locator('input[type="range"][name="line-width"]');
    await expect(lineWidthSlider).toHaveCount(1);
    
    // Check for color picker
    const colorPicker = await page.locator('input[type="color"][name="color"]');
    await expect(colorPicker).toHaveCount(1);
  });

  test('should have operation tools section', async ({ page }) => {
    // Check for all operation tools
    const operations = ['move', 'rotate', 'zoom', 'copy', 'delete', 'fill'];
    
    for (const op of operations) {
      const input = await page.locator(`input[type="radio"][name="operation"][value="${op}"]`);
      await expect(input).toHaveCount(1);
    }
  });

  test('radio inputs should be hidden inside labels', async ({ page }) => {
    // Check that radio inputs are hidden
    const radioInputs = await page.locator('input[type="radio"][name="operation"]');
    const count = await radioInputs.count();
    
    for (let i = 0; i < count; i++) {
      const input = radioInputs.nth(i);
      const isHidden = await input.evaluate(el => {
        const style = window.getComputedStyle(el);
        return style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0';
      });
      expect(isHidden).toBe(true);
      
      // Check that input is inside a label
      const parent = await input.locator('..');
      const tagName = await parent.evaluate(el => el.tagName.toLowerCase());
      expect(tagName).toBe('label');
    }
  });

  test('clicking labels should select corresponding radio inputs', async ({ page }) => {
    // Test clicking on move label
    const moveLabel = await page.locator('label:has(input[value="move"])');
    await moveLabel.click();
    
    const moveInput = await page.locator('input[value="move"]');
    await expect(moveInput).toBeChecked();
    
    // Test clicking on rect label
    const rectLabel = await page.locator('label:has(input[value="rect"])');
    await rectLabel.click();
    
    const rectInput = await page.locator('input[value="rect"]');
    await expect(rectInput).toBeChecked();
    await expect(moveInput).not.toBeChecked();
  });
});
