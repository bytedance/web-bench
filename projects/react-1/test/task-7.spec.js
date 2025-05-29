// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Task 7 - BlogContext and Title Duplication', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application before each test
    await page.goto('/');
  });

  test('should display blog list length in Header', async ({ page }) => {
    // Check if the blog list length element exists in the Header
    const blogListLen = page.locator('.blog-list-len');
    await expect(blogListLen).toBeVisible();
    
    // Check if it shows the correct initial count (2 from mock data)
    await expect(blogListLen).toHaveText('2');
  });

  test('should update blog list length when adding a new blog', async ({ page }) => {
    // Get the initial blog list length
    const initialLength = await page.locator('.blog-list-len').textContent();
    const initialCount = parseInt(initialLength);
    
    // Add a new blog
    await page.locator('header button:has-text("Add Blog")').click();
    await page.locator('input[type="text"]').first().fill('New Blog for Length Test');
    await page.locator('textarea').first().fill('Testing blog list length update');
    await page.locator('.submit-btn').click();
    
    // Check if the blog list length was updated
    await expect(page.locator('.blog-list-len')).toHaveText((initialCount + 1).toString());
  });

  test('should prevent adding blog with duplicate title', async ({ page }) => {
    // Get the initial count of blog items
    const initialCount = await page.locator('.list-item').count();
    
    // Try to add a blog with a duplicate title (Morning - from mock data)
    await page.locator('header button:has-text("Add Blog")').click();
    await page.locator('input[type="text"]').first().fill('Morning');
    await page.locator('textarea').first().fill('This is a duplicate title');
    await page.locator('.submit-btn').click();
    
    // Check if no new blog was added (count should remain the same)
    await expect(page.locator('.list-item')).toHaveCount(initialCount);
    
    // Check if there's some error message or indication
    // This could be implemented in various ways, so we'll check for common patterns
    const errorIndicators = [
      page.locator('div:has-text("Title already exists")'),
      page.locator('div:has-text("Duplicate title")'),
      page.locator('div:has-text("already in use")'),
      page.locator('div[role="alert"]'),
      page.locator('.error-message')
    ];
    
    // Check if at least one error indicator is visible
    let errorFound = false;
    for (const indicator of errorIndicators) {
      if (await indicator.isVisible().catch(() => false)) {
        errorFound = true;
        break;
      }
    }
    
    // If no specific error indicator is found, the form should at least still be visible
    if (!errorFound) {
      // The form should still be visible if submission was prevented
      await expect(page.locator('div:has-text("Create Blog")').first()).toBeVisible();
    }
  });

  test('should allow adding blog with unique title', async ({ page }) => {
    // Get the initial count of blog items
    const initialCount = await page.locator('.list-item').count();
    
    // Add a blog with a unique title
    await page.locator('header button:has-text("Add Blog")').click();
    await page.locator('input[type="text"]').first().fill('Unique Title Test');
    await page.locator('textarea').first().fill('This is a unique title');
    await page.locator('.submit-btn').click();
    
    // Check if a new blog was added
    await expect(page.locator('.list-item')).toHaveCount(initialCount + 1);
    
    // Check if the new blog contains the correct title
    await expect(page.locator('.list-item').nth(initialCount)).toContainText('Unique Title Test');
  });

  test('should position blog list length near Hello Blog in Header', async ({ page }) => {
    // Get the bounding boxes of the Header title and the blog list length element
    const headerTitleBox = await page.locator('header:has-text("Hello Blog")').boundingBox();
    const blogListLenBox = await page.locator('.blog-list-len').boundingBox();
    
    // Check if the blog list length element is positioned near the Header title
    // It should be within a reasonable distance (e.g., within 100px horizontally)
    expect(Math.abs(blogListLenBox.x - (headerTitleBox.x + headerTitleBox.width))).toBeLessThan(100);
    expect(Math.abs(blogListLenBox.y - headerTitleBox.y)).toBeLessThan(50);
  });
});