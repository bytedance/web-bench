const { test, expect } = require('@playwright/test');

test.describe('Task 15: Dynamic Event Listeners Implementation', () => {
  test('Test case 1: Buttons should not have inline onclick handlers', async ({ page }) => {
    await page.goto('/index.html');
    
    // Check that buttons don't have inline onclick attributes
    const hasInlineOnclick = await page.evaluate(() => {
      const buttons = document.querySelectorAll('.buttons button');
      return Array.from(buttons).some(button => button.hasAttribute('onclick'));
    });
    
    expect(hasInlineOnclick).toBe(false);
  });

  test('Test case 2: Calculator functionality should work with event listeners', async ({ page }) => {
    await page.goto('/index.html');
    
    // Test basic calculator functionality to ensure event listeners are working
    await page.click('text=Clear');
    await page.click('text=2');
    await page.click('text=+');
    await page.click('text=3');
    await page.click('text==');
    
    const displayValue = await page.locator('#display').inputValue();
    expect(displayValue).toBe('5');
  });

  test('Test case 3: DOMContentLoaded event should initialize calculator properly', async ({ page }) => {
    await page.goto('/index.html');
    
    // Check if calculator is properly initialized
    const initializationState = await page.evaluate(() => {
      // Check if memory display is initialized
      const memoryElement = document.getElementById('memory');
      const memoryValue = memoryElement ? memoryElement.textContent : null;
      
      // Check if event listeners are attached by trying to access the calculator's internal state
      const buttonsExist = document.querySelectorAll('.buttons button').length > 0;
      
      // Check if toggle and mode buttons have event listeners (by checking their functionality)
      const toggleButton = document.getElementById('toggle');
      const modeButton = document.getElementById('mode');
      
      return {
        memoryInitialized: memoryValue === '0',
        buttonsExist,
        toggleButtonExists: !!toggleButton,
        modeButtonExists: !!modeButton
      };
    });
    
    expect(initializationState.memoryInitialized).toBe(true);
    expect(initializationState.buttonsExist).toBe(true);
    expect(initializationState.toggleButtonExists).toBe(true);
    expect(initializationState.modeButtonExists).toBe(true);
    
    // Test that mode toggle works (which confirms event listeners are attached)
    const initialModeText = await page.locator('#mode').textContent();
    await page.click('#mode');
    const newModeText = await page.locator('#mode').textContent();
    expect(newModeText).not.toBe(initialModeText);
  });
});
