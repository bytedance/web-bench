import { test, expect } from '@playwright/test';

test.describe('Task 10: Toolkit class functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
  });

  test('toolkit should handle operation radio changes', async ({ page }) => {
    // Click line tool
    await page.click('.shape .line');
    let selectedValue = await page.$eval('input[name="operation"]:checked', el => el.value);
    expect(selectedValue).toBe('line');
    
    // Click move tool
    await page.click('.operation .move');
    selectedValue = await page.$eval('input[name="operation"]:checked', el => el.value);
    expect(selectedValue).toBe('move');
  });

  test('color input should maintain its value', async ({ page }) => {
    const colorInput = await page.$('.prop .color');
    await colorInput.fill('#ff0000');
    
    const value = await colorInput.inputValue();
    expect(value).toBe('#ff0000');
  });

  test('line width input should maintain its value', async ({ page }) => {
    const lineWidthInput = await page.$('.prop .line-width');
    await lineWidthInput.fill('17');
    
    const value = await lineWidthInput.inputValue();
    expect(value).toBe('17');
  });

  test('toolkit controls should be accessible', async ({ page }) => {
    // Test that all controls can be found and interacted with
    const controls = {
      line: '.shape .line',
      rect: '.shape .rect',
      ellipse: '.shape .ellipse',
      move: '.operation .move',
      rotate: '.operation .rotate',
      zoom: '.operation .zoom',
      copy: '.operation .copy',
      delete: '.operation .delete',
      fill: '.operation .fill'
    };
    
    for (const [name, selector] of Object.entries(controls)) {
      const element = await page.$(selector);
      expect(element).toBeTruthy();
      
      await element.click();
      const input = await element.$('input');
      const isChecked = await input.isChecked();
      expect(isChecked).toBe(true);
    }
  });

  test('property controls should be accessible', async ({ page }) => {
    const lineWidth = await page.$('.prop .line-width');
    const color = await page.$('.prop .color');
    
    expect(lineWidth).toBeTruthy();
    expect(color).toBeTruthy();
    
    // Test interaction
    await lineWidth.fill('13');
    await color.fill('#00ff00');
    
    const lineWidthValue = await lineWidth.inputValue();
    const colorValue = await color.inputValue();
    
    expect(lineWidthValue).toBe('13');
    expect(colorValue).toBe('#00ff00');
  });
});
