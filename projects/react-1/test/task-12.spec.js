// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Task 12 - Comments Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application before each test
    await page.goto('/');
  });

  test('should have Comments section in Blog component', async ({ page }) => {
    // Check if the Comments section exists in the Blog component
    const commentsSection = page.locator('div:has-text("Comments")').last();
    await expect(commentsSection).toBeVisible();
    
    // Check if it's positioned at the bottom of the Blog component
    const blogTitleBox = await page.locator('.blog-title').boundingBox();
    const commentsSectionBox = await commentsSection.boundingBox();
    
    expect(commentsSectionBox.y).toBeGreaterThan(blogTitleBox.y);
  });

  test('should have TextArea with correct placeholder', async ({ page }) => {
    // Check if the TextArea exists in the Comments section
    const textArea = page.locator('textarea[placeholder="Enter Your Comment"]');
    await expect(textArea).toBeVisible();
  });

  test('should have submit button for comments', async ({ page }) => {
    // Check if the submit button exists in the Comments section
    const submitButton = page.locator('.comment-btn');
    await expect(submitButton).toBeVisible();
  });

  test('should add comment when submitted', async ({ page }) => {
    // Get the initial count of comments (should be 0)
    const initialCommentCount = await page.locator('.comment-item').count();
    
    // Add a comment
    await page.locator('textarea[placeholder="Enter Your Comment"]').fill('This is a test comment');
    await page.locator('.comment-btn').click();
    
    // Check if a comment was added
    await expect(page.locator('.comment-item')).toHaveCount(initialCommentCount + 1);
    
    // Check if the comment contains the correct text
    await expect(page.locator('.comment-item').first()).toContainText('This is a test comment');
  });

  test('should display comments only for the selected blog', async ({ page }) => {
    // Add a comment to the first blog
    await page.locator('textarea[placeholder="Enter Your Comment"]').fill('Comment for first blog');
    await page.locator('.comment-btn').click();
    
    // Switch to the second blog
    await page.locator('.list-item').nth(1).click();
    
    // Check if no comments are shown for the second blog
    await expect(page.locator('.comment-item')).toHaveCount(0);
    
    // Add a comment to the second blog
    await page.locator('textarea[placeholder="Enter Your Comment"]').fill('Comment for second blog');
    await page.locator('.comment-btn').click();
    
    // Check if the comment for the second blog is shown
    await expect(page.locator('.comment-item')).toHaveCount(1);
    await expect(page.locator('.comment-item').first()).toContainText('Comment for second blog');
    
    // Switch back to the first blog
    await page.locator('.list-item').nth(0).click();
    
    // Check if the comment for the first blog is shown
    await expect(page.locator('.comment-item')).toHaveCount(1);
    await expect(page.locator('.comment-item').first()).toContainText('Comment for first blog');
  });

  test('should preserve comments when blog is edited', async ({ page }) => {
    // Add a comment to the first blog
    await page.locator('textarea[placeholder="Enter Your Comment"]').fill('Comment that should be preserved');
    await page.locator('.comment-btn').click();
    
    // Edit the first blog
    await page.locator('.edit-btn').click();
    await page.locator('input[type="text"]').first().fill('Edited Blog Title');
    await page.locator('textarea').first().fill('Edited blog content');
    await page.locator('.submit-btn').click();
    
    // Check if the comment is still there after editing
    await expect(page.locator('.comment-item')).toHaveCount(1);
    await expect(page.locator('.comment-item').first()).toContainText('Comment that should be preserved');
  });

  test('should clear comments when blog is deleted', async ({ page }) => {
    // Add a comment to the first blog
    await page.locator('textarea[placeholder="Enter Your Comment"]').fill('Comment that should be deleted');
    await page.locator('.comment-btn').click();
    
    // Check if the comment was added
    await expect(page.locator('.comment-item')).toHaveCount(1);
    
    // Delete the first blog
    await page.locator('.delete-btn').click();
    
    // Check if the comment is no longer there
    await expect(page.locator('.comment-item')).toHaveCount(0);
  });
});