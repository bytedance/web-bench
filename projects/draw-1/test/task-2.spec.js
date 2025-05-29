// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Task 2 Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have radio buttons with labels in shape container', async ({ page }) => {
    // Check if all shape radio labels exist
    const lineLabel = page.locator('.shape > .line');
    const rectLabel = page.locator('.shape > .rect');
    const ellipseLabel = page.locator('.shape > .ellipse');
    
    await expect(lineLabel).toBeVisible();
    await expect(rectLabel).toBeVisible();
    await expect(ellipseLabel).toBeVisible();
    
    // Check if radio buttons exist inside labels
    const lineRadio = page.locator('.shape > .line > input[type="radio"][name="operation"]');
    const rectRadio = page.locator('.shape > .rect > input[type="radio"][name="operation"]');
    const ellipseRadio = page.locator('.shape > .ellipse > input[type="radio"][name="operation"]');
    
    await expect(lineRadio).toBeAttached();
    await expect(rectRadio).toBeAttached();
    await expect(ellipseRadio).toBeAttached();
  });

  test('should have radio buttons with labels in operation container', async ({ page }) => {
    // Check if all operation radio labels exist
    const moveLabel = page.locator('.operation > .move');
    const rotateLabel = page.locator('.operation > .rotate');
    const zoomLabel = page.locator('.operation > .zoom');
    const copyLabel = page.locator('.operation > .copy');
    const deleteLabel = page.locator('.operation > .delete');
    const fillLabel = page.locator('.operation > .fill');
    
    await expect(moveLabel).toBeVisible();
    await expect(rotateLabel).toBeVisible();
    await expect(zoomLabel).toBeVisible();
    await expect(copyLabel).toBeVisible();
    await expect(deleteLabel).toBeVisible();
    await expect(fillLabel).toBeVisible();
    
    // Check if radio buttons exist inside labels
    const moveRadio = page.locator('.operation > .move > input[type="radio"][name="operation"]');
    const rotateRadio = page.locator('.operation > .rotate > input[type="radio"][name="operation"]');
    const zoomRadio = page.locator('.operation > .zoom > input[type="radio"][name="operation"]');
    const copyRadio = page.locator('.operation > .copy > input[type="radio"][name="operation"]');
    const deleteRadio = page.locator('.operation > .delete > input[type="radio"][name="operation"]');
    const fillRadio = page.locator('.operation > .fill > input[type="radio"][name="operation"]');
    
    await expect(moveRadio).toBeAttached();
    await expect(rotateRadio).toBeAttached();
    await expect(zoomRadio).toBeAttached();
    await expect(copyRadio).toBeAttached();
    await expect(deleteRadio).toBeAttached();
    await expect(fillRadio).toBeAttached();
  });

  test('radio buttons should have zero width/height but be functional', async ({ page }) => {
    // Check if radio buttons have zero width/height
    const radio = page.locator('input[type="radio"][name="operation"]').first();
    
    // Check dimensions
    const dimensions = await radio.evaluate(el => {
      const style = window.getComputedStyle(el);
      return {
        width: style.width,
        height: style.height,
        display: style.display
      };
    });
    
    // Radio should have zero width/height but not be hidden
    expect(dimensions.width).toBe('0px');
    expect(dimensions.height).toBe('0px');
    expect(dimensions.display).not.toBe('none');
    
    // Check if radio is still functional by clicking a label and checking if radio is checked
    await page.locator('.shape > .line').click();
    const isChecked = await page.locator('.shape > .line > input[type="radio"]').isChecked();
    expect(isChecked).toBe(true);
  });

  test('labels should have background images', async ({ page }) => {
    // Check if labels have background images
    const lineLabel = page.locator('.shape > .line');
    
    // Check if background image is set
    const backgroundImage = await lineLabel.evaluate(el => {
      return window.getComputedStyle(el).backgroundImage;
    });
    
    // Background image should be set and not be 'none'
    expect(backgroundImage).not.toBe('none');
    expect(backgroundImage.length).toBeGreaterThan(0);
  });

  test('all radio buttons should have the same name', async ({ page }) => {
    // Get all radio buttons
    const radioButtons = page.locator('input[type="radio"]');
    const count = await radioButtons.count();
    
    // Check if all radio buttons have the same name
    for (let i = 0; i < count; i++) {
      const name = await radioButtons.nth(i).getAttribute('name');
      expect(name).toBe('operation');
    }
  });
});