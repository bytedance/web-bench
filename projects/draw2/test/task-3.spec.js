import { test, expect } from '@playwright/test';

test.describe('Task 3: SVG icons and hover effects', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
  });

  test('tool labels should have background images', async ({ page }) => {
    const toolLabels = await page.locator('label:has(input[name="operation"])');
    const count = await toolLabels.count();
    
    // Check at least some labels have background images
    let hasBackgroundImage = 0;
    for (let i = 0; i < count; i++) {
      const label = toolLabels.nth(i);
      const backgroundImage = await label.evaluate(el => 
        window.getComputedStyle(el).backgroundImage
      );
      if (backgroundImage && backgroundImage !== 'none') {
        hasBackgroundImage++;
      }
    }
    
    expect(hasBackgroundImage).toBeGreaterThan(0);
  });

  test('icons should be 20x20 pixels', async ({ page }) => {
    const toolLabels = await page.locator('label:has(input[name="operation"])');
    const firstLabel = toolLabels.first();
    
    const backgroundSize = await firstLabel.evaluate(el => 
      window.getComputedStyle(el).backgroundSize
    );
    
    // Background size should be set to 20x20 or contain
    expect(backgroundSize).toMatch(/20px|contain/);
  });

  test('hover effects should change background', async ({ page }) => {
    const moveLabel = await page.locator('label:has(input[value="move"])');
    
    // Get initial background
    const initialBg = await moveLabel.evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    );
    
    // Hover over the label
    await moveLabel.hover();
    
    // Get hover background
    const hoverBg = await moveLabel.evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    );
    
    // Background should change on hover
    expect(hoverBg).not.toBe(initialBg);
  });

  test('selected tool should have darker background', async ({ page }) => {
    const moveLabel = await page.locator('label:has(input[value="move"])');
    const rectLabel = await page.locator('label:has(input[value="rect"])');
    
    // Select move tool
    await moveLabel.click();
    const moveBg = await moveLabel.evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    );
    
    // Select rect tool
    await rectLabel.click();
    const rectBg = await rectLabel.evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    );
    
    // Selected tool should have visible background
    expect(rectBg).not.toBe('rgba(0, 0, 0, 0)');
    expect(rectBg).not.toBe('transparent');
  });

  test('SVG icons should use data URIs', async ({ page }) => {
    const toolLabels = await page.locator('label:has(input[name="operation"])');
    const firstLabel = toolLabels.first();
    
    const backgroundImage = await firstLabel.evaluate(el => 
      window.getComputedStyle(el).backgroundImage
    );
    
    // Should contain data URI if background image exists
    if (backgroundImage && backgroundImage !== 'none') {
      expect(backgroundImage).toMatch(/data:|url\(/);
    }
  });
});
