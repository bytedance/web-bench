import { test, expect } from '@playwright/test';

test.describe('Task 7: Toolkit labels and inputs styling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
  });

  test('radio inputs should be hidden', async ({ page }) => {
    const radioStyles = await page.$eval('.toolkit input[type="radio"]', el => ({
      width: el.offsetWidth,
      height: el.offsetHeight,
      appearance: window.getComputedStyle(el).appearance
    }));
    
    expect(radioStyles.width).toBe(0);
    expect(radioStyles.height).toBe(0);
    expect(radioStyles.appearance).toBe('none');
  });

  test('labels should be 32x32 squares', async ({ page }) => {
    const labelSizes = await page.$$eval('.toolkit label', elements => 
      elements.map(el => ({
        width: el.offsetWidth,
        height: el.offsetHeight
      }))
    );
    
    labelSizes.forEach(size => {
      expect(size.width).toBe(32);
      expect(size.height).toBe(32);
    });
  });

  test('labels should center content', async ({ page }) => {
    const labelStyles = await page.$eval('.toolkit label', el => ({
      display: window.getComputedStyle(el).display,
      alignItems: window.getComputedStyle(el).alignItems,
      justifyContent: window.getComputedStyle(el).justifyContent
    }));
    
    expect(labelStyles.display).toContain('flex');
    expect(labelStyles.alignItems).toBe('center');
    expect(labelStyles.justifyContent).toBe('center');
  });

  test('labels should have hover effect', async ({ page }) => {
    const label = await page.$('.toolkit label');
    
    // Get initial background
    const initialBg = await label.evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    );
    
    // Hover and check background changes
    await label.hover();
    await page.waitForTimeout(100); // Wait for transition
    
    const hoverBg = await label.evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    );
    
    expect(hoverBg).not.toBe(initialBg);
  });

  test('selected labels should have different background', async ({ page }) => {
    const label = await page.$('.shape .line');
    
    // Get background before selection
    const beforeBg = await label.evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    );
    
    // Click to select
    await label.click();
    
    // Get background after selection
    const afterBg = await label.evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    );
    
    expect(afterBg).not.toBe(beforeBg);
  });
});
