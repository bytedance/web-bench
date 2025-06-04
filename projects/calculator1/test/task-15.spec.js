const { test, expect } = require('@playwright/test');

test.describe('Task 15: Scientific/basic mode toggle button', () => {
  test('should have mode button with proper positioning', async ({ page }) => {
    await page.goto('/index.html');
    
    const modeButton = page.locator('#mode');
    await expect(modeButton).toBeVisible();
    
    const styles = await modeButton.evaluate(el => {
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
    expect(styles.left).toBe('65%');
    expect(styles.transform).toContain('translateX(-50%)');
    expect(styles.borderRadius).toBe('20px');
    expect(styles.boxShadow).toContain('rgba');
  });

  test('should display correct text based on current mode', async ({ page }) => {
    await page.goto('/index.html');
    
    const modeButton = page.locator('#mode');
    
    // Initially in scientific mode, should show "Basic"
    let buttonText = await modeButton.textContent();
    expect(buttonText).toBe('Basic');
    
    // Click to switch to basic mode
    await modeButton.click();
    await page.waitForTimeout(100);
    
    // Should now show "Scientific"
    buttonText = await modeButton.textContent();
    expect(buttonText).toBe('Scientific');
  });

  test('should toggle scientific mode when clicked', async ({ page }) => {
    await page.goto('/index.html');
    
    const calculator = page.locator('.calculator');
    const modeButton = page.locator('#mode');
    
    // Initially in scientific mode
    let hasScientificMode = await calculator.evaluate(el => {
      return el.classList.contains('scientific');
    });
    expect(hasScientificMode).toBe(true);
    
    // Click to toggle mode
    await modeButton.click();
    await page.waitForTimeout(100);
    
    // Should no longer have scientific mode
    hasScientificMode = await calculator.evaluate(el => {
      return el.classList.contains('scientific');
    });
    expect(hasScientificMode).toBe(false);
    
    // Click again
    await modeButton.click();
    await page.waitForTimeout(100);
    
    // Should have scientific mode again
    hasScientificMode = await calculator.evaluate(el => {
      return el.classList.contains('scientific');
    });
    expect(hasScientificMode).toBe(true);
  });
});
