import { test, expect } from '@playwright/test';

test.describe('Task 6: Toolkit layout styling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
  });

  test('toolkit should use flexbox with space-between', async ({ page }) => {
    const toolkitStyles = await page.$eval('.toolkit', el => ({
      display: window.getComputedStyle(el).display,
      justifyContent: window.getComputedStyle(el).justifyContent,
      alignItems: window.getComputedStyle(el).alignItems
    }));
    
    expect(toolkitStyles.display).toBe('flex');
    expect(toolkitStyles.justifyContent).toBe('space-between');
    expect(toolkitStyles.alignItems).toBe('center');
  });

  test('toolkit should have 4px padding', async ({ page }) => {
    const padding = await page.$eval('.toolkit', el => 
      window.getComputedStyle(el).padding
    );
    expect(padding).toBe('4px');
  });

  test('shape and operation containers should use flexbox', async ({ page }) => {
    const shapeDisplay = await page.$eval('.toolkit .shape', el => 
      window.getComputedStyle(el).display
    );
    const operationDisplay = await page.$eval('.toolkit .operation', el => 
      window.getComputedStyle(el).display
    );
    
    expect(shapeDisplay).toBe('flex');
    expect(operationDisplay).toBe('flex');
  });

  test('shape and operation containers should have 8px gap', async ({ page }) => {
    const shapeGap = await page.$eval('.toolkit .shape', el => 
      window.getComputedStyle(el).gap
    );
    const operationGap = await page.$eval('.toolkit .operation', el => 
      window.getComputedStyle(el).gap
    );
    
    expect(shapeGap).toBe('8px');
    expect(operationGap).toBe('8px');
  });

  test('toolkit sections should be properly spaced', async ({ page }) => {
    const sections = await page.$$eval('.toolkit > div', elements => 
      elements.map(el => ({
        left: el.offsetLeft,
        width: el.offsetWidth
      }))
    );
    
    // Should have at least 3 sections
    expect(sections.length).toBeGreaterThanOrEqual(3);
    
    // First section should be at left, last at right
    const toolkitWidth = await page.$eval('.toolkit', el => el.offsetWidth);
    expect(sections[0].left).toBeLessThan(toolkitWidth / 3);
    expect(sections[sections.length - 1].left + sections[sections.length - 1].width)
      .toBeGreaterThan(toolkitWidth * 2 / 3);
  });
});
