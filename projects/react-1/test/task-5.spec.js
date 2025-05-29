// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Task 5 - BlogForm Visible Count', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application before each test
    await page.goto('/');
  });

  test('should have visible-count element in BlogForm', async ({ page }) => {
    // Click the Add Blog button to show the BlogForm
    await page.locator('header button:has-text("Add Blog")').click();
    
    // Check if the visible-count element exists in the BlogForm
    const visibleCount = page.locator('.visible-count');
    await expect(visibleCount).toBeVisible();
  });

  test('should initially show 0 in visible-count', async ({ page }) => {
    // Click the Add Blog button to show the BlogForm
    await page.locator('header button:has-text("Add Blog")').click();
    
    // Check if the visible-count element shows '0'
    const visibleCount = page.locator('.visible-count');
    await expect(visibleCount).toHaveText('0');
  });

  test('should increment visible-count when BlogForm becomes visible', async ({ page }) => {
    // Click the Add Blog button to show the BlogForm for the first time
    await page.locator('header button:has-text("Add Blog")').click();
    
    // Check if the visible-count element shows '1'
    const visibleCount = page.locator('.visible-count');
    await expect(visibleCount).toHaveText('1');
    
    // Close the BlogForm
    await page.locator('.close-btn').click();
    
    // Wait a moment for any animations to complete
    await page.waitForTimeout(100);
    
    // Click the Add Blog button again to show the BlogForm for the second time
    await page.locator('header button:has-text("Add Blog")').click();
    
    // Check if the visible-count element shows '2'
    await expect(visibleCount).toHaveText('2');
  });

  test('should position visible-count in the top-left of BlogForm', async ({ page }) => {
    // Click the Add Blog button to show the BlogForm
    await page.locator('header button:has-text("Add Blog")').click();
    
    // Get the bounding boxes of the BlogForm and the visible-count element
    const blogFormBox = await page.locator('div:has-text("Create Blog")').first().boundingBox();
    const visibleCountBox = await page.locator('.visible-count').boundingBox();
    
    // Check if the visible-count element is positioned in the top-left of the BlogForm
    expect(visibleCountBox.x).toBeCloseTo(blogFormBox.x, -1);
    expect(visibleCountBox.y).toBeCloseTo(blogFormBox.y, -1);
  });

  test('should maintain count across multiple toggles', async ({ page }) => {
    // Toggle the BlogForm visibility multiple times
    for (let i = 1; i <= 3; i++) {
      // Click the Add Blog button to show the BlogForm
      await page.locator('header button:has-text("Add Blog")').click();
      
      // Check if the visible-count element shows the correct count
      const visibleCount = page.locator('.visible-count');
      await expect(visibleCount).toHaveText(i.toString());
      
      // Close the BlogForm
      await page.locator('.close-btn').click();
      
      // Wait a moment for any animations to complete
      await page.waitForTimeout(100);
    }
  });
});