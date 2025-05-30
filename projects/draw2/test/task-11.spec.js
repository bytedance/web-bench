import { test, expect } from '@playwright/test';

test.describe('Task 11: Spacebar functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
  });

  test('spacebar should temporarily switch to move tool', async ({ page }) => {
    // Select line tool first
    await page.click('.shape .line');
    let selectedValue = await page.$eval('input[name="operation"]:checked', el => el.value);
    expect(selectedValue).toBe('line');
    
    // Press spacebar
    await page.keyboard.down(' ');
    selectedValue = await page.$eval('input[name="operation"]:checked', el => el.value);
    expect(selectedValue).toBe('move');
    
    // Release spacebar
    await page.keyboard.up(' ');
    selectedValue = await page.$eval('input[name="operation"]:checked', el => el.value);
    expect(selectedValue).toBe('line');
  });

  test('spacebar should work from any tool', async ({ page }) => {
    // Test from rect tool
    await page.click('.shape .rect');
    await page.keyboard.down(' ');
    let selectedValue = await page.$eval('input[name="operation"]:checked', el => el.value);
    expect(selectedValue).toBe('move');
    
    await page.keyboard.up(' ');
    selectedValue = await page.$eval('input[name="operation"]:checked', el => el.value);
    expect(selectedValue).toBe('rect');
  });

  test('spacebar should work from operation tools', async ({ page }) => {
    // Select rotate tool
    await page.click('.operation .rotate');
    let selectedValue = await page.$eval('input[name="operation"]:checked', el => el.value);
    expect(selectedValue).toBe('rotate');
    
    // Press and release spacebar
    await page.keyboard.down(' ');
    selectedValue = await page.$eval('input[name="operation"]:checked', el => el.value);
    expect(selectedValue).toBe('move');
    
    await page.keyboard.up(' ');
    selectedValue = await page.$eval('input[name="operation"]:checked', el => el.value);
    expect(selectedValue).toBe('rotate');
  });

  test('multiple spacebar presses should not break functionality', async ({ page }) => {
    await page.click('.shape .ellipse');
    
    // Press spacebar multiple times
    await page.keyboard.down(' ');
    await page.keyboard.up(' ');
    await page.keyboard.down(' ');
    
    let selectedValue = await page.$eval('input[name="operation"]:checked', el => el.value);
    expect(selectedValue).toBe('move');
    
    await page.keyboard.up(' ');
    selectedValue = await page.$eval('input[name="operation"]:checked', el => el.value);
    expect(selectedValue).toBe('ellipse');
  });
});
