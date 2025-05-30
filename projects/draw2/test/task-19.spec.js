import { test, expect } from '@playwright/test';

test.describe('Task 19: SVG icon backgrounds', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
  });

  test('all toolkit labels should have background images', async ({ page }) => {
    const labels = [
      '.shape .line',
      '.shape .rect', 
      '.shape .ellipse',
      '.operation .move',
      '.operation .rotate',
      '.operation .zoom',
      '.operation .copy',
      '.operation .delete',
      '.operation .fill'
    ];
    
    for (const selector of labels) {
      const label = await page.$(selector);
      const backgroundImage = await label.evaluate(el => 
        window.getComputedStyle(el).backgroundImage
      );
      
      expect(backgroundImage).toContain('url');
      expect(backgroundImage).toContain('data:image/svg+xml');
    }
  });

  test('shape tool icons should be visible', async ({ page }) => {
    // Check that shape icons render properly
    const shapeLabels = await page.$$('.shape label');
    
    for (const label of shapeLabels) {
      const size = await label.evaluate(el => ({
        width: el.offsetWidth,
        height: el.offsetHeight
      }));
      
      expect(size.width).toBe(32);
      expect(size.height).toBe(32);
      
      const bgSize = await label.evaluate(el => 
        window.getComputedStyle(el).backgroundSize
      );
      expect(bgSize).toBe('contain');
    }
  });

  test('operation tool icons should be visible', async ({ page }) => {
    // Check that operation icons render properly
    const operationLabels = await page.$$('.operation label');
    
    for (const label of operationLabels) {
      const bgPosition = await label.evaluate(el => 
        window.getComputedStyle(el).backgroundPosition
      );
      expect(bgPosition).toContain('center');
      
      const bgRepeat = await label.evaluate(el => 
        window.getComputedStyle(el).backgroundRepeat
      );
      expect(bgRepeat).toBe('no-repeat');
    }
  });

  test('cursor should change based on selected operation', async ({ page }) => {
    // Test cursor changes for different operations
    const operations = ['move', 'zoom', 'rotate', 'copy', 'delete', 'fill'];
    
    for (const op of operations) {
      await page.click(`.operation .${op}`);
      
      // Check cursor on canvas shapes
      const cursor = await page.$eval('.canvas', el => 
        window.getComputedStyle(el).cursor
      );
      
      // Should have custom cursor or pointer
      expect(cursor).not.toBe('auto');
    }
  });

  test('icons should be distinguishable from each other', async ({ page }) => {
    // Get all background images
    const backgroundImages = await page.$$eval('.toolkit label', labels => 
      labels.map(label => {
        const bg = window.getComputedStyle(label).backgroundImage;
        // Extract the SVG content between url(" and ")
        const match = bg.match(/url\("(.+)"\)/);
        return match ? match[1] : '';
      })
    );
    
    // All should be unique
    const uniqueImages = new Set(backgroundImages);
    expect(uniqueImages.size).toBe(backgroundImages.length);
    
    // All should be SVG data URIs
    backgroundImages.forEach(img => {
      expect(img).toContain('data:image/svg+xml');
    });
  });
});
