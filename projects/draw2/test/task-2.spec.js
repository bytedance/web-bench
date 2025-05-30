import { test, expect } from '@playwright/test';

test.describe('Task 2: Shape selection tools', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
  });

  test('should have shape container with three shape tools', async ({ page }) => {
    const shapeContainer = await page.$('.toolkit .shape');
    expect(shapeContainer).toBeTruthy();
    
    const labels = await shapeContainer.$$('label');
    expect(labels.length).toBe(3);
  });

  test('should have line tool with proper structure', async ({ page }) => {
    const lineLabel = await page.$('.shape .line');
    expect(lineLabel).toBeTruthy();
    
    const input = await lineLabel.$('input[type="radio"]');
    expect(input).toBeTruthy();
    
    const name = await input.getAttribute('name');
    const value = await input.getAttribute('value');
    expect(name).toBe('operation');
    expect(value).toBe('line');
  });

  test('should have rect tool with proper structure', async ({ page }) => {
    const rectLabel = await page.$('.shape .rect');
    expect(rectLabel).toBeTruthy();
    
    const input = await rectLabel.$('input[type="radio"]');
    expect(input).toBeTruthy();
    
    const value = await input.getAttribute('value');
    expect(value).toBe('rect');
  });

  test('should have ellipse tool with proper structure', async ({ page }) => {
    const ellipseLabel = await page.$('.shape .ellipse');
    expect(ellipseLabel).toBeTruthy();
    
    const input = await ellipseLabel.$('input[type="radio"]');
    expect(input).toBeTruthy();
    
    const value = await input.getAttribute('value');
    expect(value).toBe('ellipse');
  });

  test('clicking shape labels should select the radio input', async ({ page }) => {
    const lineLabel = await page.$('.shape .line');
    await lineLabel.click();
    
    const lineInput = await lineLabel.$('input[type="radio"]');
    const isChecked = await lineInput.isChecked();
    expect(isChecked).toBe(true);
  });
});
