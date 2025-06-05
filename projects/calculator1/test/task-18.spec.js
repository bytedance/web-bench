const { test, expect } = require('@playwright/test');

test.describe('Task 18: Clear button grid layout adjustment', () => {
  test('Test case 1: Clear button spans 3 columns in grid', async ({ page }) => {
    await page.goto('/index.html');
    
    const clearButton = page.locator('button:has-text("Clear")');
    
    // Check that Clear button has correct grid-column span
    await expect(clearButton).toHaveCSS('grid-column', 'span 3');
  });

  test('Test case 2: Button layout uses grid display properly', async ({ page }) => {
    await page.goto('/index.html');
    
    const buttonsContainer = page.locator('.buttons');
    const clearButton = page.locator('button:has-text("Clear")');
    
    // Verify the grid layout
    await expect(buttonsContainer).toHaveCSS('display', 'grid');
    
    // Check that buttons container has grid-template-columns (computed value may differ)
    const gridColumns = await buttonsContainer.evaluate(el => getComputedStyle(el).gridTemplateColumns);
    expect(gridColumns).toBeTruthy(); // Should have some grid column definition
    
    // Clear button should still span 3 columns in scientific mode
    await expect(clearButton).toHaveCSS('grid-column', 'span 3');
  });

  test('Test case 3: Layout remains consistent when toggling modes', async ({ page }) => {
    await page.goto('/index.html');
    
    const clearButton = page.locator('button:has-text("Clear")');
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
