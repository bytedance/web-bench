const { test, expect } = require('@playwright/test');

test.describe('Task 11: Memory Function Buttons', () => {
  test('Test case 1: Memory buttons should be present with correct class and styling', async ({ page }) => {
    await page.goto('/index.html');
    
    // Ensure scientific mode is active to see memory buttons
    await page.evaluate(() => {
      document.querySelector('.calculator').classList.add('scientific');
    });
    
    // Check for memory function buttons and their styling
    const memoryButtons = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('.buttons button.memory-btn'));
      return buttons.map(btn => ({
        text: btn.textContent.trim(),
        hasMemoryClass: btn.classList.contains('memory-btn'),
        backgroundColor: window.getComputedStyle(btn).backgroundColor,
        color: window.getComputedStyle(btn).color
      }));
    });
    
    const expectedButtons = ['MR', 'M+', 'M-', 'MC'];
    expect(memoryButtons.length).toBe(4);
    
    memoryButtons.forEach((btn, index) => {
      expect(btn.text).toBe(expectedButtons[index]);
      expect(btn.hasMemoryClass).toBe(true);
      expect(btn.backgroundColor).toBe('rgb(76, 175, 80)'); // #4caf50
      expect(btn.color).toBe('rgb(255, 255, 255)'); // white
    });
  });

  test('Test case 2: Memory buttons should have proper hover effects in light mode', async ({ page }) => {
    await page.goto('/index.html');
    
    // Remove dark mode to test light mode
    await page.evaluate(() => {
      const calculator = document.querySelector('.calculator');
      calculator.classList.remove('dark-mode');
      calculator.classList.add('scientific');
    });
    
    const memoryButton = page.locator('.memory-btn').first();
    await memoryButton.hover();
    await page.waitForTimeout(100);
    
    const hoverColor = await page.evaluate(() => {
      const btn = document.querySelector('.memory-btn');
      return window.getComputedStyle(btn).backgroundColor;
    });
    
    expect(hoverColor).toBe('rgb(69, 160, 73)'); // #45a049
  });

  test('Test case 3: Memory buttons should have dark mode styling and hover effects', async ({ page }) => {
    await page.goto('/index.html');
    
    // Ensure dark mode and scientific mode are active
    await page.evaluate(() => {
      const calculator = document.querySelector('.calculator');
      calculator.classList.add('dark-mode');
      calculator.classList.add('scientific');
    });
    
    // Check dark mode styling
    const darkModeStyles = await page.evaluate(() => {
      const btn = document.querySelector('.memory-btn');
      return {
        backgroundColor: window.getComputedStyle(btn).backgroundColor,
        color: window.getComputedStyle(btn).color
      };
    });
    
    expect(darkModeStyles.backgroundColor).toBe('rgb(46, 125, 50)'); // #2e7d32
    expect(darkModeStyles.color).toBe('rgb(255, 255, 255)'); // white
    
    // Test hover effect in dark mode
    const memoryButton = page.locator('.memory-btn').first();
    await memoryButton.hover();
    await page.waitForTimeout(100);
    
    const hoverColor = await page.evaluate(() => {
      const btn = document.querySelector('.memory-btn');
      return window.getComputedStyle(btn).backgroundColor;
    });
    
    expect(hoverColor).toBe('rgb(56, 142, 60)'); // #388e3c
  });
});
