// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Task 1 - Basic Blog Structure', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application before each test
    await page.goto('/');
  });

  test('should display Header with correct text', async ({ page }) => {
    // Check if Header exists and contains the correct text
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('header')).toContainText('Hello Blog');
  });

  test('should have Main component with content aligned properly', async ({ page }) => {
    // Check if Main component exists
    await expect(page.locator('main')).toBeVisible();
    
    // Check if content is aligned at the top left (indirectly by checking position)
    const mainBoundingBox = await page.locator('main').boundingBox();
    expect(mainBoundingBox.x).toBeLessThan(50); // Should be close to the left edge
    expect(mainBoundingBox.y).toBeLessThan(150); // Should be close to the top (after header)
  });

  test('should display Blog component with correct title and detail', async ({ page }) => {
    // Check if Blog component exists with the correct title
    await expect(page.locator('.blog-title')).toBeVisible();
    await expect(page.locator('.blog-title')).toContainText('Morning');
    
    // Check if Blog component displays the correct detail
    await expect(page.locator('main')).toContainText('Morning My Friends');
  });

  test('should have blog-title with correct styling', async ({ page }) => {
    // Check if blog-title has the correct styling
    const blogTitleElement = page.locator('.blog-title');
    
    // Check font size
    const fontSize = await blogTitleElement.evaluate(el => {
      return window.getComputedStyle(el).fontSize;
    });
    expect(fontSize).toBe('24px');
    
    // Check width is fit-content (indirectly by comparing width to content)
    const width = await blogTitleElement.evaluate(el => {
      return window.getComputedStyle(el).width;
    });
    const textWidth = await blogTitleElement.evaluate(el => {
      return el.scrollWidth;
    });
    
    // Width should be close to the text width for fit-content
    expect(parseFloat(width)).toBeGreaterThanOrEqual(textWidth - 5);
    expect(parseFloat(width)).toBeLessThanOrEqual(textWidth + 20);
  });
});