const { test, expect } = require('@playwright/test');

test.describe('Task 5: Toggle Button Positioning and Styling', () => {
  test('Test case 1: Toggle button should have fixed positioning at bottom left', async ({ page }) => {
    await page.goto('/index.html');
    
    const toggleStyles = await page.evaluate(() => {
      const toggle = document.getElementById('toggle');
      const styles = window.getComputedStyle(toggle);
      return {
        position: styles.position,
        bottom: styles.bottom,
        left: styles.left,
        transform: styles.transform
      };
    });
    
    expect(toggleStyles.position).toBe('fixed');
    expect(toggleStyles.bottom).toBe('20px');
    expect(toggleStyles.left).toBe('35%');
    expect(toggleStyles.transform).toContain('translateX(-50%)');
  });

  test('Test case 2: Toggle button should have proper styling with padding and border-radius', async ({ page }) => {
    await page.goto('/index.html');
    
    const toggleStyles = await page.evaluate(() => {
      const toggle = document.getElementById('toggle');
      const styles = window.getComputedStyle(toggle);
      return {
        padding: styles.padding,
        fontSize: styles.fontSize,
        borderRadius: styles.borderRadius,
        boxShadow: styles.boxShadow,
        zIndex: styles.zIndex
      };
    });
    
    expect(toggleStyles.padding).toBe('10px 20px');
    expect(toggleStyles.fontSize).toBe('16px');
    expect(toggleStyles.borderRadius).toBe('20px');
    expect(toggleStyles.boxShadow).toContain('rgba(0, 0, 0, 0.2)');
    expect(toggleStyles.zIndex).toBe('1000');
  });

  test('Test case 3: Toggle button should be properly centered using transform', async ({ page }) => {
    await page.goto('/index.html');
    
    // Check if button is properly positioned and centered
    const togglePosition = await page.locator('#toggle').boundingBox();
    const viewportSize = page.viewportSize();
    
    expect(togglePosition).not.toBeNull();
    
    // Calculate expected position (35% from left, centered with transform)
    const expectedLeft = viewportSize.width * 0.35;
    const buttonCenterX = togglePosition.x + togglePosition.width / 2;
    
    // Allow small tolerance for positioning
    expect(Math.abs(buttonCenterX - expectedLeft)).toBeLessThan(5);
    
    // Check that button is at bottom
    const expectedBottom = viewportSize.height - 20;
    const buttonBottom = togglePosition.y + togglePosition.height;
    expect(Math.abs(buttonBottom - expectedBottom)).toBeLessThan(5);
  });
});
