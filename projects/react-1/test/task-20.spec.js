// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Task 20 - Drag and Drop Reordering', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application before each test
    await page.goto('/');
    
    // Ensure we have at least 3 blogs for testing
    // Check current blog count
    const initialBlogCount = await page.locator('.list-item').count();
    
    // Add blogs if needed
    if (initialBlogCount < 3) {
      const blogsToAdd = 3 - initialBlogCount;
      for (let i = 0; i < blogsToAdd; i++) {
        await page.locator('header button:has-text("Add Blog")').click();
        await page.locator('input[type="text"]').first().fill(`Test Blog ${i + 1}`);
        await page.locator('textarea').first().fill(`Content for Test Blog ${i + 1}`);
        await page.locator('.submit-btn').click();
      }
    }
  });

  test('should have draggable list items', async ({ page }) => {
    // Check if list items have draggable attribute
    const isDraggable = await page.locator('.list-item').first().evaluate(el => {
      return el.draggable === true;
    });
    
    expect(isDraggable).toBeTruthy();
  });

  test('should have visual indication for draggable items', async ({ page }) => {
    // Hover over a list item to check for visual feedback
    await page.locator('.list-item').first().hover();
    
    // Check if there's a visual indication (cursor style)
    const cursorStyle = await page.locator('.list-item').first().evaluate(el => {
      return window.getComputedStyle(el).cursor;
    });
    
    // Should have a grab or move cursor
    expect(['grab', 'grabbing', 'move'].some(style => cursorStyle.includes(style))).toBeTruthy();
  });

  test('should reorder blogs when dragging and dropping', async ({ page }) => {
    // Get the text of the first and second blog items
    const firstBlogText = await page.locator('.list-item').nth(0).textContent();
    const secondBlogText = await page.locator('.list-item').nth(1).textContent();
    
    // Perform drag and drop operation
    await page.locator('.list-item').nth(0).dragTo(page.locator('.list-item').nth(1));
    
    // Wait for the reordering to take effect
    await page.waitForTimeout(500);
    
    // Check if the order has changed
    const newFirstBlogText = await page.locator('.list-item').nth(0).textContent();
    const newSecondBlogText = await page.locator('.list-item').nth(1).textContent();
    
    expect(newFirstBlogText).toBe(secondBlogText);
    expect(newSecondBlogText).toBe(firstBlogText);
  });

  test('should maintain the selected blog after reordering', async ({ page }) => {
    // Select the second blog
    await page.locator('.list-item').nth(1).click();
    
    // Get the title of the selected blog
    const selectedBlogTitle = await page.locator('.blog-title').textContent();
    
    // Drag the third blog to the first position
    await page.locator('.list-item').nth(2).dragTo(page.locator('.list-item').nth(0));
    
    // Wait for the reordering to take effect
    await page.waitForTimeout(500);
    
    // Check if the same blog is still selected
    const currentSelectedBlogTitle = await page.locator('.blog-title').textContent();
    expect(currentSelectedBlogTitle).toBe(selectedBlogTitle);
  });

  test('should persist reordering after page refresh', async ({ page }) => {
    // Get the text of all blog items
    const blogTexts = [];
    const count = await page.locator('.list-item').count();
    for (let i = 0; i < count; i++) {
      blogTexts.push(await page.locator('.list-item').nth(i).textContent());
    }
    
    // Perform drag and drop to reorder
    await page.locator('.list-item').nth(0).dragTo(page.locator('.list-item').nth(count - 1));
    
    // Wait for the reordering to take effect
    await page.waitForTimeout(500);
    
    // Get the new order
    const newBlogTexts = [];
    for (let i = 0; i < count; i++) {
      newBlogTexts.push(await page.locator('.list-item').nth(i).textContent());
    }
    
    // Refresh the page
    await page.reload();
    
    // Check if the order is maintained after refresh
    for (let i = 0; i < count; i++) {
      const currentText = await page.locator('.list-item').nth(i).textContent();
      expect(currentText).toBe(newBlogTexts[i]);
    }
  });
});