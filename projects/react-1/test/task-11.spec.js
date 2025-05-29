// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Task 11 - Random Blogs Performance', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application before each test
    await page.goto('/');
  });

  test('should have Random Blogs button in Header', async ({ page }) => {
    // Check if the Random Blogs button exists in the Header
    const randomButton = page.locator('header button:has-text("Random Blogs")');
    await expect(randomButton).toBeVisible();
  });

  test('should append 100,000 blogs when Random Blogs button is clicked', async ({ page }) => {
    // Set a longer timeout for this test since it involves a large operation
    test.setTimeout(30000);
    
    // Get the initial count of blog items and blog list length
    const initialCount = await page.locator('.list-item').count();
    const initialLength = await page.locator('.blog-list-len').textContent();
    const initialLengthNum = parseInt(initialLength);
    
    // Click the Random Blogs button
    await page.locator('header button:has-text("Random Blogs")').click();
    
    // Wait for the operation to complete (this might take some time)
    // We'll use the blog-list-len as an indicator since it should update when all blogs are added
    await expect(page.locator('.blog-list-len')).toHaveText((initialLengthNum + 100000).toString(), { timeout: 20000 });
    
    // Check if a significant number of blogs were added
    // We won't check for exactly 100,000 since that would be impractical to render all at once
    // Instead, we'll check if the count is much larger than before
    const newCount = await page.locator('.list-item').count();
    expect(newCount).toBeGreaterThan(initialCount + 10); // At least some new items should be visible
  });

  test('should generate blogs with titles matching the required format', async ({ page }) => {
    // Click the Random Blogs button
    await page.locator('header button:has-text("Random Blogs")').click();
    
    // Wait a moment for the blogs to be added
    await page.waitForTimeout(2000);
    
    // Check a sample of visible blog titles to verify they match the required format
    const listItems = page.locator('.list-item');
    const visibleCount = Math.min(await listItems.count(), 20); // Check up to 20 visible items
    
    let formatMatchCount = 0;
    for (let i = 0; i < visibleCount; i++) {
      const itemText = await listItems.nth(i).textContent();
      if (itemText.match(/RandomBlog-\d{12}/)) {
        formatMatchCount++;
      }
    }
    
    // At least some of the visible blogs should match the format
    expect(formatMatchCount).toBeGreaterThan(0);
  });

  test('should maintain UI responsiveness after adding many blogs', async ({ page }) => {
    // Click the Random Blogs button
    await page.locator('header button:has-text("Random Blogs")').click();
    
    // Wait a moment for the blogs to be added
    await page.waitForTimeout(2000);
    
    // Try to interact with the UI to check responsiveness
    // 1. Click on a blog item
    await page.locator('.list-item').nth(5).click();
    
    // Check if the blog content updates (indicating the UI is responsive)
    const blogTitle = await page.locator('.blog-title').textContent();
    const listItemText = await page.locator('.list-item').nth(5).textContent();
    expect(blogTitle).toContain(listItemText);
    
    // 2. Try to search
    await page.locator('input[placeholder="Search Blogs"]').fill('RandomBlog');
    
    // Wait a moment for the filtering to take effect
    await page.waitForTimeout(500);
    
    // Check if the search works (some items should still be visible)
    const filteredCount = await page.locator('.list-item').count();
    expect(filteredCount).toBeGreaterThan(0);
    
    // 3. Try to open the BlogForm
    await page.locator('header button:has-text("Add Blog")').click();
    
    // Check if the BlogForm opens
    await expect(page.locator('div:has-text("Create Blog")').first()).toBeVisible();
  });
});