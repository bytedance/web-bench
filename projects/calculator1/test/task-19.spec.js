const { test, expect } = require('@playwright/test');

test.describe('Task 19: Advanced Number Formatting and Responsive Styling', () => {
  test('Test case 1: Memory display should use toLocaleString with proper fraction digits', async ({ page }) => {
    await page.goto('/index.html');
    
    // Ensure scientific mode is active
    await page.evaluate(() => {
      document.querySelector('.calculator').classList.add('scientific');
    });
    
    // Test memory formatting with decimal values
    await page.click('text=MC'); // Clear memory
    await page.click('text=Clear');
    await page.click('text=1');
    await page.click('text=.');
    await page.click('text=2');
    await page.click('text=3');
    await page.click('text=4');
    await page.click('text=5');
    await page.click('text=6');
    await page.click('text=7');
    await page.click('text=8');
    await page.click('text=9');
    await page.click('text=M+');
    
    // Check memory display formatting
    const memoryDisplay = await page.locator('#memory').textContent();
    
    // Should use proper number formatting (with appropriate decimal places)
    expect(memoryDisplay).toMatch(/^[\d,]+\.?\d*$/); // Should match number format
    
    // Test with large numbers
    await page.click('text=MC');
    await page.click('text=Clear');
    await page.click('text=1');
    await page.click('text=2');
    await page.click('text=3');
    await page.click('text=4');
    await page.click('text=5');
    await page.click('text=M+');
    
    const largeMemoryDisplay = await page.locator('#memory').textContent();
    expect(largeMemoryDisplay).toBe('12,345'); // Should include comma formatting
  });

  test('Test case 2: History panel should have proper spacing and wrapping', async ({ page }) => {
    await page.goto('/index.html');
    
    // Ensure scientific mode is active
    await page.evaluate(() => {
      document.querySelector('.calculator').classList.add('scientific');
    });
    
    // Check history panel styling
    const historyStyles = await page.evaluate(() => {
      const clicksHistory = document.querySelector('.clicks-history');
      const styles = window.getComputedStyle(clicksHistory);
      
      return {
        display: styles.display,
        gap: styles.gap,
        justifyContent: styles.justifyContent,
        flexWrap: styles.flexWrap,
        textAlign: styles.textAlign
      };
    });
    
    expect(historyStyles.display).toBe('flex');
    expect(historyStyles.gap).toBe('8px');
    expect(historyStyles.justifyContent).toBe('flex-end');
    expect(historyStyles.flexWrap).toBe('wrap');
    expect(historyStyles.textAlign).toBe('right');
  });

  test('Test case 3: Interactive elements should have consistent styling across modes', async ({ page }) => {
    await page.goto('/index.html');
    
    // Test dark mode consistency
    await page.evaluate(() => {
      document.querySelector('.calculator').classList.add('dark-mode');
      document.querySelector('.calculator').classList.add('scientific');
    });
    
    // Check consistent dark mode styling across panels
    const darkModeStyles = await page.evaluate(() => {
      const memoryPanel = document.querySelector('.memory-panel');
      const clicksPanel = document.querySelector('.clicks-panel');
      const infoPanels = document.querySelector('.info-panels');
      
      const memoryStyles = window.getComputedStyle(memoryPanel);
      const clicksStyles = window.getComputedStyle(clicksPanel);
      const infoPanelsStyles = window.getComputedStyle(infoPanels);
      
      return {
        memoryColor: memoryStyles.color,
        clicksColor: clicksStyles.color,
        infoPanelsBorder: infoPanelsStyles.borderColor
      };
    });
    
    expect(darkModeStyles.memoryColor).toBe('rgb(255, 255, 255)'); // white
    expect(darkModeStyles.clicksColor).toBe('rgb(255, 255, 255)'); // white
    expect(darkModeStyles.infoPanelsBorder).toBe('rgb(102, 102, 102)'); // #666
    
    // Test light mode consistency
    await page.evaluate(() => {
      document.querySelector('.calculator').classList.remove('dark-mode');
    });
    
    const lightModeStyles = await page.evaluate(() => {
      const infoPanels = document.querySelector('.info-panels');
      const infoPanelsStyles = window.getComputedStyle(infoPanels);
      
      return {
        infoPanelsBorder: infoPanelsStyles.borderColor
      };
    });
    
    expect(lightModeStyles.infoPanelsBorder).toBe('rgb(204, 204, 204)'); // #ccc
  });
});
