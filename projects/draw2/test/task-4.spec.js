import { test, expect } from '@playwright/test';

test.describe('Task 4: Operation tools', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
  });

  test('should have operation container with six tools', async ({ page }) => {
    const operationContainer = await page.$('.toolkit .operation');
    expect(operationContainer).toBeTruthy();
    
    const labels = await operationContainer.$$('label');
    expect(labels.length).toBe(6);
  });

  test('should have all operation tools with correct values', async ({ page }) => {
    const operations = ['move', 'rotate', 'zoom', 'copy', 'delete', 'fill'];
    
    for (const op of operations) {
      const label = await page.$(`.operation .${op}`);
      expect(label).toBeTruthy();
      
      const input = await label.$('input[type="radio"]');
      expect(input).toBeTruthy();
      
      const value = await input.getAttribute('value');
      expect(value).toBe(op);
    }
  });

  test('all operation inputs should have same radio group', async ({ page }) => {
    const inputs = await page.$$('.operation input[type="radio"]');
    
    for (const input of inputs) {
      const name = await input.getAttribute('name');
      expect(name).toBe('operation');
    }
  });

  test('clicking operation labels should select them', async ({ page }) => {
    const moveLabel = await page.$('.operation .move');
    await moveLabel.click();
    
    const moveInput = await moveLabel.$('input[type="radio"]');
    const isChecked = await moveInput.isChecked();
    expect(isChecked).toBe(true);
  });

  test('selecting one operation should deselect others', async ({ page }) => {
    // Click move
    await page.click('.operation .move');
    let moveChecked = await page.$eval('.operation .move input', el => el.checked);
    expect(moveChecked).toBe(true);
    
    // Click rotate
    await page.click('.operation .rotate');
    moveChecked = await page.$eval('.operation .move input', el => el.checked);
    const rotateChecked = await page.$eval('.operation .rotate input', el => el.checked);
    
    expect(moveChecked).toBe(false);
    expect(rotateChecked).toBe(true);
  });
});
