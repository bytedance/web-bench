const { test, expect } = require('@playwright/test');

test.describe('Task 20: CSS Organization and Comprehensive Transitions', () => {
  test('Test case 1: All calculator elements should have transition effects', async ({ page }) => {
    await page.goto('/index.html');
    
    // Check transition effects on major calculator elements
    const transitions = await page.evaluate(() => {
      const calculator = document.querySelector('.calculator');
      const display = document.querySelector('.display');
      const buttons = document.querySelectorAll('.buttons button');
      const infoPanels = document.querySelector('.info-panels');
      const memoryPanel = document.querySelector('.memory-panel');
      const clicksPanel = document.querySelector('.clicks-panel');
      
      return {
        calculator: window.getComputedStyle(calculator).transition,
        display: window.getComputedStyle(display).transition,
        button: window.getComputedStyle(buttons[0]).transition,
        infoPanels: window.getComputedStyle(infoPanels).transition,
        memoryPanel: window.getComputedStyle(memoryPanel).transition,
        clicksPanel: window.getComputedStyle(clicksPanel).transition
      };
    });
    
    // All elements should have transition effects
    expect(transitions.calculator).toContain('all');
    expect(transitions.calculator).toContain('0.3s');
    expect(transitions.calculator).toContain('ease');
    
    expect(transitions.display).toContain('all');
    expect(transitions.display).toContain('0.3s');
    expect(transitions.display).toContain('ease');
    
    expect(transitions.button).toContain('all');
    expect(transitions.button).toContain('0.3s');
    expect(transitions.button).toContain('ease');
    
    expect(transitions.infoPanels).toContain('all');
    expect(transitions.infoPanels).toContain('0.3s');
    expect(transitions.infoPanels).toContain('ease');
  });

  test('Test case 2: Fixed positioned elements should have proper z-index management', async ({ page }) => {
    await page.goto('/index.html');
    
    // Check z-index values for fixed positioned elements
    const zIndexValues = await page.evaluate(() => {
      const toggle = document.getElementById('toggle');
      const mode = document.getElementById('mode');
      
      return {
        toggle: window.getComputedStyle(toggle).zIndex,
        mode: window.getComputedStyle(mode).zIndex
      };
    });
    
    expect(zIndexValues.toggle).toBe('1000');
    expect(zIndexValues.mode).toBe('1000');
    
    // Verify buttons are positioned correctly and don't overlap with other content
    const buttonPositions = await page.evaluate(() => {
      const toggle = document.getElementById('toggle');
      const mode = document.getElementById('mode');
      const toggleRect = toggle.getBoundingClientRect();
      const modeRect = mode.getBoundingClientRect();
      
      return {
        toggleAtBottom: toggleRect.bottom > (window.innerHeight - 50),
        modeAtBottom: modeRect.bottom > (window.innerHeight - 50),
        buttonsNotOverlapping: toggleRect.right < modeRect.left || modeRect.right < toggleRect.left
      };
    });
    
    expect(buttonPositions.toggleAtBottom).toBe(true);
    expect(buttonPositions.modeAtBottom).toBe(true);
    expect(buttonPositions.buttonsNotOverlapping).toBe(true);
  });

  test('Test case 3: Dark mode variants should be properly organized and accessible', async ({ page }) => {
    await page.goto('/index.html');
    
    // Test accessibility and proper organization of dark mode
    await page.evaluate(() => {
      document.querySelector('.calculator').classList.add('dark-mode');
      document.querySelector('.calculator').classList.add('scientific');
    });
    
    // Check dark mode box shadows for fixed buttons
    const darkModeBoxShadows = await page.evaluate(() => {
      const toggle = document.getElementById('toggle');
      const mode = document.getElementById('mode');
      
      return {
        toggle: window.getComputedStyle(toggle).boxShadow,
        mode: window.getComputedStyle(mode).boxShadow
      };
    });
    
    // Should have white box shadow in dark mode
    expect(darkModeBoxShadows.toggle).toContain('rgba(255, 255, 255, 0.1)');
    expect(darkModeBoxShadows.mode).toContain('rgba(255, 255, 255, 0.1)');
    
    // Test smooth transitions when toggling modes
    await page.click('#toggle'); // Toggle to light mode
    await page.waitForTimeout(400); // Wait for transition to complete
    
    // Check that transition completed smoothly
    const lightModeStyles = await page.evaluate(() => {
      const calculator = document.querySelector('.calculator');
      const styles = window.getComputedStyle(calculator);
      return {
        backgroundColor: styles.backgroundColor,
        hasTransition: styles.transition.includes('all')
      };
    });
    
    expect(lightModeStyles.backgroundColor).toBe('rgb(255, 255, 255)'); // white
    expect(lightModeStyles.hasTransition).toBe(true);
  });
});
