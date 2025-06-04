const { test, expect } = require('@playwright/test');

test.describe('Task 17: Create information panels container for memory and history display', () => {
  test('should have info-panels container with proper styling', async ({ page }) => {
    await page.goto('/index.html');
    
    const infoPanels = page.locator('.info-panels');
    const styles = await infoPanels.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return {
        marginTop: style.marginTop,
        borderTop: style.borderTopWidth + ' ' + style.borderTopStyle + ' ' + style.borderTopColor,
        transition: style.transition
      };
    });
    
    expect(styles.marginTop).toBe('15px');
    expect(styles.borderTop).toContain('1px solid');
    expect(styles.transition).toContain('0.3s ease');
  });

  test('should be visible in scientific mode', async ({ page }) => {
    await page.goto('/index.html');
    
    // Calculator starts in scientific mode by default
    const infoPanels = page.locator('.info-panels');
    await expect(infoPanels).toBeVisible();
  });

  test('should have proper dark mode styling', async ({ page }) => {
    await page.goto('/index.html');
    
    // Calculator starts in dark mode by default
    const infoPanels = page.locator('.dark-mode .info-panels');
    const borderColor = await infoPanels.evaluate((el) => {
      return window.getComputedStyle(el).borderTopColor;
    });
    
    expect(borderColor).toBe('rgb(102, 102, 102)'); // #666
  });
});
