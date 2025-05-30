import { test, expect } from '@playwright/test';

test.describe('Task 8: Canvas styling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
  });

  test('canvas should have flex 1', async ({ page }) => {
    const flex = await page.$eval('.canvas', el => 
      window.getComputedStyle(el).flex
    );
    // flex: 1 expands to "1 1 0%" or similar
    expect(flex).toContain('1');
  });

  test('canvas should have light gray background', async ({ page }) => {
    const bgColor = await page.$eval('.canvas', el => 
      window.getComputedStyle(el).backgroundColor
    );
    
    // #eee converts to rgb(238, 238, 238)
    expect(bgColor).toBe('rgb(238, 238, 238)');
  });

  test('canvas should fill remaining space', async ({ page }) => {
    const rootHeight = await page.$eval('.root', el => el.offsetHeight);
    const toolkitHeight = await page.$eval('.toolkit', el => el.offsetHeight);
    const canvasHeight = await page.$eval('.canvas', el => el.offsetHeight);
    
    // Canvas height should be approximately root height minus toolkit height
    expect(Math.abs(canvasHeight - (rootHeight - toolkitHeight))).toBeLessThan(5);
  });

  test('canvas should stretch full width', async ({ page }) => {
    const rootWidth = await page.$eval('.root', el => el.offsetWidth);
    const canvasWidth = await page.$eval('.canvas', el => el.offsetWidth);
    
    expect(canvasWidth).toBe(rootWidth);
  });

  test('canvas should be an SVG element', async ({ page }) => {
    const isCanvas = await page.$eval('.canvas', el => 
      el.tagName.toLowerCase() === 'svg'
    );
    expect(isCanvas).toBe(true);
  });
});
