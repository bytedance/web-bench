const { test, expect } = require('@playwright/test');

test.describe('Task 18: Clear button grid layout adjustment', () => {
  test('Test case 1: Clear button spans 3 columns in grid', async ({ page }) => {
    await page.goto('/index.html');
    
    const clearButton = page.locator('text=Clear');
    
    // Check that Clear button has correct grid-column span
    await expect(clearButton).toHaveCSS('grid-column', 'span 3');
  });

  test('Test case 2: Button layout adjusts properly in scientific mode', async ({ page }) => {
    await page.goto('/index.html');
    
    const buttonsContainer = page.locator('.buttons');
    const clearButton = page.locator('text=Clear');
    
    // Verify the grid layout accommodates the Clear button properly
    await expect(buttonsContainer).toHaveCSS('display', 'grid');
    await expect(buttonsContainer).toHaveCSS('grid-template-columns', 'repeat(4, 1fr)');
    
    // Clear button should still span 3 columns in scientific mode
    await expect(clearButton).toHaveCSS('grid-column', 'span 3');
  });

  test('Test case 3: Layout remains consistent when toggling modes', async ({ page }) => {
    await page.goto('/index.html');
    
    const clearButton = page.locator('text=Clear');
    const modeButton = page.locator('#mode');
    
    // Check Clear button span in scientific mode
    await expect(clearButton).toHaveCSS('grid-column', 'span 3');
    
    // Toggle to basic mode
    await modeButton.click();
    
    // Clear button should still span 3 columns
    await expect(clearButton).toHaveCSS('grid-column', 'span 3');
    
    // Toggle back to scientific mode
    await modeButton.click();
    
    // Should still span 3 columns
    await expect(clearButton).toHaveCSS('grid-column', 'span 3');
  });
});
