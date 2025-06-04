const { test, expect } = require('@playwright/test');

test.describe('Task 14: Create fixed position toggle buttons for dark/light and basic/scientific mode', () => {
  test('should have toggle buttons with fixed positioning', async ({ page }) => {
    await page.goto('/index.html');
    
    const toggleButton = page.locator('#toggle');
    const modeButton = page.locator('#mode');
    
    const togglePosition = await toggleButton.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return {
        position: style.position,
        bottom: style.bottom,
        left: style.left,
        zIndex: style.zIndex
      };
    });
    
    const modePosition = await modeButton.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return {
        position: style.position,
        bottom: style.bottom,
        left: style.left,
        zIndex: style.zIndex
      };
    });
    
    expect(togglePosition.position).toBe('fixed');
    expect(modePosition.position).toBe('fixed');
    expect(togglePosition.zIndex).toBe('1000');
    expect(modePosition.zIndex).toBe('1000');
  });

  test('should have rounded borders and shadow effects', async ({ page }) => {
    await page.goto('/index.html');
    
    const toggleButton = page.locator('#toggle');
    const styles = await toggleButton.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return {
        borderRadius: style.borderRadius,
        boxShadow: style.boxShadow,
        padding: style.padding
      };
    });
    
    expect(styles.borderRadius).toBe('20px');
    expect(styles.boxShadow).toContain('rgba(0, 0, 0, 0.2)');
    expect(styles.padding).toBe('10px 20px');
  });

  test('should be clickable and functional', async ({ page }) => {
    await page.goto('/index.html');
    
    const toggleButton = page.locator('#toggle');
    const modeButton = page.locator('#mode');
    
    await expect(toggleButton).toBeVisible();
    await expect(modeButton).toBeVisible();
    
    // Test toggle functionality
    const initialText = await toggleButton.textContent();
    await toggleButton.click();
    const afterClickText = await toggleButton.textContent();
    
    expect(initialText).not.toBe(afterClickText);
  });
});
