const { test, expect } = require('@playwright/test');

test.describe('Task 11: Information panels section', () => {
  test('should have info panels container with proper styling', async ({ page }) => {
    await page.goto('/index.html');
    
    const infoPanels = page.locator('.info-panels');
    await expect(infoPanels).toBeVisible();
    
    const styles = await infoPanels.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        marginTop: computed.marginTop,
        borderTopWidth: computed.borderTopWidth,
        borderTopStyle: computed.borderTopStyle,
        transition: computed.transition
      };
    });
    
    expect(styles.marginTop).toBe('15px');
    expect(styles.borderTopWidth).toBe('1px');
    expect(styles.borderTopStyle).toBe('solid');
    expect(styles.transition).toContain('all');
  });

  test('should hide info panels in basic mode', async ({ page }) => {
    await page.goto('/index.html');
    
    const modeButton = page.locator('#mode');
    const infoPanels = page.locator('.info-panels');
    
    // Switch to basic mode
    await modeButton.click();
    await page.waitForTimeout(100);
    
    // Info panels should be hidden
    const isHidden = await infoPanels.isHidden();
    expect(isHidden).toBe(true);
  });

  test('should show info panels in scientific mode with proper dark mode styling', async ({ page }) => {
    await page.goto('/index.html');
    
    // Already in scientific mode and dark mode by default
    const infoPanels = page.locator('.info-panels');
    await expect(infoPanels).toBeVisible();
    
    const borderColor = await infoPanels.evaluate(el => {
      return window.getComputedStyle(el).borderTopColor;
    });
    
    // Should have dark mode border color (#666 = rgb(102, 102, 102))
    expect(borderColor).toBe('rgb(102, 102, 102)');
  });
});
