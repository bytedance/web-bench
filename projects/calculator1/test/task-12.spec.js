const { test, expect } = require('@playwright/test');

test.describe('Task 12: Memory display panel', () => {
  test('should have memory panel with proper layout', async ({ page }) => {
    await page.goto('/index.html');
    
    const memoryPanel = page.locator('.memory-panel');
    await expect(memoryPanel).toBeVisible();
    
    const styles = await memoryPanel.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        display: computed.display,
        justifyContent: computed.justifyContent,
        alignItems: computed.alignItems,
        padding: computed.padding
      };
    });
    
    expect(styles.display).toBe('flex');
    expect(styles.justifyContent).toBe('space-between');
    expect(styles.alignItems).toBe('center');
    expect(styles.padding).toBe('10px');
  });

  test('should display memory label and value correctly', async ({ page }) => {
    await page.goto('/index.html');
    
    const memoryPanel = page.locator('.memory-panel');
    const memoryLabel = memoryPanel.locator('span').first();
    const memoryValue = page.locator('#memory');
    
    // Check memory label
    const labelText = await memoryLabel.textContent();
    expect(labelText).toBe('Memory');
    
    // Check initial memory value
    const initialValue = await memoryValue.textContent();
    expect(initialValue).toBe('0');
    
    // Check memory value styling
    const memoryStyles = await memoryValue.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        fontFamily: computed.fontFamily,
        textAlign: computed.textAlign,
        backgroundColor: computed.backgroundColor
      };
    });
    
    expect(memoryStyles.fontFamily).toContain('monospace');
    expect(memoryStyles.textAlign).toBe('right');
  });

  test('should update memory display when memory operations are performed', async ({ page }) => {
    await page.goto('/index.html');
    
    const display = page.locator('#display');
    const memoryValue = page.locator('#memory');
    const numberButton = page.locator('button:has-text("5")');
    const memoryAddButton = page.locator('button:has-text("M+")');
    
    // Enter a number and add to memory
    await numberButton.click();
    await memoryAddButton.click();
    
    // Check that memory value changed
    const updatedValue = await memoryValue.textContent();
    expect(updatedValue).toBe('5');
  });
});
