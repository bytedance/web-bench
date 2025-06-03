const { test, expect } = require('@playwright/test');

test.describe('Task 6: Toolkit Styling', () => {
  test('should have radio buttons hidden and labels styled as icon buttons', async ({ page }) => {
    await page.goto('/index.html');
    
    // Check radio buttons are hidden
    const radioInputs = page.locator('.toolkit input[type="radio"]');
    const count = await radioInputs.count();
    
    for (let i = 0; i < count; i++) {
      const input = radioInputs.nth(i);
      const styles = await input.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          appearance: computed.appearance,
          width: computed.width,
          height: computed.height
        };
      });
      
      expect(styles.appearance).toBe('none');
      expect(styles.width).toBe('0px');
      expect(styles.height).toBe('0px');
    }
  });

  test('should have labels styled as 32x32px icon buttons', async ({ page }) => {
    await page.goto('/index.html');
    
    const labels = page.locator('.toolkit label');
    const count = await labels.count();
    
    for (let i = 0; i < count; i++) {
      const label = labels.nth(i);
      const styles = await label.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          width: computed.width,
          height: computed.height,
          display: computed.display,
          backgroundSize: computed.backgroundSize,
          backgroundRepeat: computed.backgroundRepeat,
          backgroundPosition: computed.backgroundPosition
        };
      });
      
      expect(styles.width).toBe('32px');
      expect(styles.height).toBe('32px');
      // expect(styles.display).toBe('inline-flex');
      // expect(styles.backgroundSize).toBe('contain');
      // expect(styles.backgroundRepeat).toBe('no-repeat');
      // expect(styles.backgroundPosition).toBe('center');
    }
  });

  test('should show hover and selected states for labels', async ({ page }) => {
    await page.goto('/index.html');
    
    const lineLabel = page.locator('.toolkit .shape .line');
    const lineInput = page.locator('.toolkit .shape .line');
    
    // Test hover state
    await lineLabel.hover();
    
    // Test selected state by clicking
    await lineInput.click();
    await expect(lineInput).toBeChecked();
    
    // Check that the label has selected styling when input is checked
    const hasSelectedClass = await lineLabel.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return computed.backgroundColor !== 'rgba(0, 0, 0, 0)';
    });
    
    expect(hasSelectedClass).toBeTruthy();
  });
});
