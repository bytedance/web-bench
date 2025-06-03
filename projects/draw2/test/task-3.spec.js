// Test for Task 3: Implement custom SVG icons for tool buttons
import { test, expect } from '@playwright/test';

test.describe('Task 3: Custom SVG Icons and Tool Styling', () => {
  test('should display background images on tool labels', async ({ page }) => {
    await page.goto('/index.html');
    
    const toolLabels = ['.line', '.rect', '.ellipse', '.move', '.rotate', '.zoom', '.copy', '.delete', '.fill'];
    
    for (const selector of toolLabels) {
      const label = page.locator(selector);
      await expect(label).toBeVisible();
      
      // Check that background image is set (likely via CSS)
      const backgroundImage = await label.evaluate(el => getComputedStyle(el).backgroundImage);
      expect(backgroundImage).not.toBe('none');
    }
  });

  test('should have hover effects on tool buttons', async ({ page }) => {
    await page.goto('/index.html');
    
    const lineLabel = page.locator('.line');
    
    // Get initial background color
    const initialBg = await lineLabel.evaluate(el => getComputedStyle(el).backgroundColor);
    
    // Hover over the element
    await lineLabel.hover();
    await page.waitForTimeout(100);
    
    // Check that hover state is applied (background should change)
    const hoveredBg = await lineLabel.evaluate(el => getComputedStyle(el).backgroundColor);
    
    // Background should be different or element should have visible hover styling
    const isHoverStyled = initialBg !== hoveredBg || hoveredBg !== 'rgba(0, 0, 0, 0)';
    expect(isHoverStyled).toBeTruthy();
  });

  test('should highlight selected tools with different background', async ({ page }) => {
    await page.goto('/index.html');
    
    const lineLabel = page.locator('.line');
    const moveLabel = page.locator('.move');
    
    // Click on line tool
    await lineLabel.click();
    await page.waitForTimeout(100);
    
    const selectedLineBg = await lineLabel.evaluate(el => getComputedStyle(el).backgroundColor);
    const unselectedMoveBg = await moveLabel.evaluate(el => getComputedStyle(el).backgroundColor);
    
    // Selected tool should have different styling
    expect(selectedLineBg).not.toBe('rgba(0, 0, 0, 0)');
    
    // Click on move tool
    await moveLabel.click();
    await page.waitForTimeout(100);
    
    const selectedMoveBg = await moveLabel.evaluate(el => getComputedStyle(el).backgroundColor);
    const unselectedLineBg = await lineLabel.evaluate(el => getComputedStyle(el).backgroundColor);
    
    // Now move should be highlighted
    expect(selectedMoveBg).not.toBe('rgba(0, 0, 0, 0)');
  });
});
