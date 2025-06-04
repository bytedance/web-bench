const { test, expect } = require('@playwright/test');

test.describe('Task 14: Dark mode toggle button', () => {
  test('should have toggle button with proper positioning', async ({ page }) => {
    await page.goto('/index.html');
    
    const toggleButton = page.locator('#toggle');
    await expect(toggleButton).toBeVisible();
    
    const styles = await toggleButton.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        position: computed.position,
        bottom: computed.bottom,
        left: computed.left,
        transform: computed.transform,
        borderRadius: computed.borderRadius,
        boxShadow: computed.boxShadow
      };
    });
    
    expect(styles.position).toBe('fixed');
    expect(styles.bottom).toBe('20px');
    expect(styles.left).toBe('35%');
    expect(styles.transform).toContain('translateX(-50%)');
    expect(styles.borderRadius).toBe('20px');
    expect(styles.boxShadow).toContain('rgba');
  });

  test('should display correct text based on current mode', async ({ page }) => {
    await page.goto('/index.html');
    
    const toggleButton = page.locator('#toggle');
    
    // Initially in dark mode, should show "Light"
    let buttonText = await toggleButton.textContent();
    expect(buttonText).toBe('Light');
    
    // Click to switch to light mode
    await toggleButton.click();
    await page.waitForTimeout(100);
    
    // Should now show "Dark"
    buttonText = await toggleButton.textContent();
    expect(buttonText).toBe('Dark');
  });

  test('should toggle dark mode when clicked', async ({ page }) => {
    await page.goto('/index.html');
    
    const calculator = page.locator('.calculator');
    const toggleButton = page.locator('#toggle');
    
    // Initially in dark mode
    let hasDarkMode = await calculator.evaluate(el => {
      return el.classList.contains('dark-mode');
    });
    expect(hasDarkMode).toBe(true);
    
    // Click toggle
    await toggleButton.click();
    await page.waitForTimeout(100);
    
    // Should no longer have dark mode
    hasDarkMode = await calculator.evaluate(el => {
      return el.classList.contains('dark-mode');
    });
    expect(hasDarkMode).toBe(false);
    
    // Click again
    await toggleButton.click();
    await page.waitForTimeout(100);
    
    // Should have dark mode again
    hasDarkMode = await calculator.evaluate(el => {
      return el.classList.contains('dark-mode');
    });
    expect(hasDarkMode).toBe(true);
  });
});
