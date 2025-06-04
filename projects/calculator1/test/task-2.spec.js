const { test, expect } = require('@playwright/test');

test.describe('Task 2: Smooth transitions for calculator container', () => {
  test('should have transition property on calculator element', async ({ page }) => {
    await page.goto('/index.html');
    
    const calculator = page.locator('.calculator');
    const transitionProperty = await calculator.evaluate(el => {
      return window.getComputedStyle(el).transition;
    });
    
    // Check that transition includes 'all' and duration
    expect(transitionProperty).toContain('all');
    expect(transitionProperty).toContain('0.3s');
    expect(transitionProperty).toContain('ease');
  });

  test('should smoothly transition when toggling dark mode', async ({ page }) => {
    await page.goto('/index.html');
    
    const calculator = page.locator('.calculator');
    const toggleButton = page.locator('#toggle');
    
    // Get initial background color
    const initialBgColor = await calculator.evaluate(el => {
      return window.getComputedStyle(el).backgroundColor;
    });
    
    // Click toggle to change mode
    await toggleButton.click();
    
    // Wait a bit for transition
    await page.waitForTimeout(100);
    
    // Get new background color
    const newBgColor = await calculator.evaluate(el => {
      return window.getComputedStyle(el).backgroundColor;
    });
    
    // Colors should be different after toggle
    expect(initialBgColor).not.toBe(newBgColor);
  });

  test('should have smooth transition during theme switching animation', async ({ page }) => {
    await page.goto('/index.html');
    
    const calculator = page.locator('.calculator');
    const toggleButton = page.locator('#toggle');
    
    // Record background color changes during transition
    const colorChanges = [];
    
    // Start monitoring color changes
    const checkColor = async () => {
      const color = await calculator.evaluate(el => {
        return window.getComputedStyle(el).backgroundColor;
      });
      colorChanges.push(color);
    };
    
    await checkColor(); // Initial color
    await toggleButton.click();
    
    // Check color at multiple points during transition
    for (let i = 0; i < 5; i++) {
      await page.waitForTimeout(50);
      await checkColor();
    }
    
    // Should have captured different colors during transition
    const uniqueColors = [...new Set(colorChanges)];
    expect(uniqueColors.length).toBeGreaterThan(1);
  });
});
