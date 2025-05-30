import { test, expect } from '@playwright/test';

test.describe('Task 3: Property controls', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
  });

  test('should have prop container with controls', async ({ page }) => {
    const propContainer = await page.$('.toolkit .prop');
    expect(propContainer).toBeTruthy();
    
    const inputs = await propContainer.$$('input');
    expect(inputs.length).toBe(2);
  });

  test('should have line width range input with correct settings', async ({ page }) => {
    const lineWidthInput = await page.$('.prop .line-width');
    expect(lineWidthInput).toBeTruthy();
    
    const type = await lineWidthInput.getAttribute('type');
    expect(type).toBe('range');
    
    const value = await lineWidthInput.inputValue();
    expect(value).toBe('9');
  });

  test('line width input should have correct range', async ({ page }) => {
    const lineWidthInput = await page.$('.prop .line-width');
    
    const min = await lineWidthInput.getAttribute('min');
    const max = await lineWidthInput.getAttribute('max');
    const step = await lineWidthInput.getAttribute('step');
    
    expect(min).toBe('1');
    expect(max).toBe('21');
    expect(step).toBe('4');
  });

  test('should have color input with default black', async ({ page }) => {
    const colorInput = await page.$('.prop .color');
    expect(colorInput).toBeTruthy();
    
    const type = await colorInput.getAttribute('type');
    expect(type).toBe('color');
    
    const value = await colorInput.inputValue();
    expect(value).toBe('#000000');
  });

  test('changing controls should update their values', async ({ page }) => {
    const lineWidthInput = await page.$('.prop .line-width');
    await lineWidthInput.fill('13');
    const newValue = await lineWidthInput.inputValue();
    expect(newValue).toBe('13');
    
    const colorInput = await page.$('.prop .color');
    await colorInput.fill('#ff0000');
    const newColor = await colorInput.inputValue();
    expect(newColor).toBe('#ff0000');
  });
});
