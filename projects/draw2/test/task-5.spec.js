import { test, expect } from '@playwright/test';

test.describe('Task 5: Root container styling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
  });

  test('body should have no margin', async ({ page }) => {
    const bodyMargin = await page.$eval('body', el => 
      window.getComputedStyle(el).margin
    );
    expect(bodyMargin).toBe('0px');
  });

  test('root should fill viewport', async ({ page }) => {
    const viewport = page.viewportSize();
    const rootSize = await page.$eval('.root', el => ({
      width: el.offsetWidth,
      height: el.offsetHeight
    }));
    
    expect(rootSize.width).toBe(viewport.width);
    expect(rootSize.height).toBe(viewport.height);
  });

  test('root should use flexbox column layout', async ({ page }) => {
    const rootStyles = await page.$eval('.root', el => ({
      display: window.getComputedStyle(el).display,
      flexDirection: window.getComputedStyle(el).flexDirection
    }));
    
    expect(rootStyles.display).toBe('flex');
    expect(rootStyles.flexDirection).toBe('column');
  });

  test('root should hide overflow', async ({ page }) => {
    const overflow = await page.$eval('.root', el => 
      window.getComputedStyle(el).overflow
    );
    expect(overflow).toBe('hidden');
  });

  test('root children should stack vertically', async ({ page }) => {
    const positions = await page.$$eval('.root > *', elements => 
      elements.map(el => ({
        top: el.offsetTop,
        left: el.offsetLeft
      }))
    );
    
    // All children should have same left position
    const leftPositions = positions.map(p => p.left);
    console.log(new Set(leftPositions));
    expect(new Set(leftPositions).size).toBe(1);
    
    // Children should stack vertically
    if (positions.length > 1) {
      expect(positions[1].top).toBeGreaterThan(positions[0].top);
    }
  });
});
