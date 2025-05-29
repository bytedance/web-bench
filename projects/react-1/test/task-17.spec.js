// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Task 17 - Fast Comment Button', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application before each test
    await page.goto('/');
  });

  test('should have Fast Comment button in Header', async ({ page }) => {
    // Check if the Fast Comment button exists in the Header
    const fastCommentButton = page.locator('header button:has-text("Fast Comment")');
    await expect(fastCommentButton).toBeVisible();
    
    // Check if the button has an appealing style
    const buttonStyle = await fastCommentButton.evaluate(el => {
      const style = window.getComputedStyle(el);
      return {
        backgroundColor: style.backgroundColor,
        color: style.color,
        borderRadius: style.borderRadius,
        padding: style.padding
      };
    });
    
    // The button should have some styling (not just default)
    expect(buttonStyle.backgroundColor !== 'rgba(0, 0, 0, 0)' && buttonStyle.backgroundColor !== 'transparent').toBeTruthy();
  });

  test('should focus comment textarea when Fast Comment button is clicked', async ({ page }) => {
    // Click the Fast Comment button
    await page.locator('header button:has-text("Fast Comment")').click();
    
    // Check if the comment textarea is focused
    const isFocused = await page.evaluate(() => {
      return document.activeElement === document.querySelector('textarea[placeholder="Enter Your Comment"]');
    });
    
    expect(isFocused).toBeTruthy();
  });

  test('should type "Charming Blog!" in textarea when Fast Comment button is clicked', async ({ page }) => {
    // Click the Fast Comment button
    await page.locator('header button:has-text("Fast Comment")').click();
    
    // Check if the text "Charming Blog!" is typed in the textarea
    await expect(page.locator('textarea[placeholder="Enter Your Comment"]')).toHaveValue('Charming Blog!');
  });

  test('should not submit the comment automatically', async ({ page }) => {
    // Get the initial count of comments
    const initialCommentCount = await page.locator('.comment-item').count();
    
    // Click the Fast Comment button
    await page.locator('header button:has-text("Fast Comment")').click();
    
    // Wait a moment to ensure no automatic submission occurs
    await page.waitForTimeout(500);
    
    // Check if the comment count remains the same (no submission)
    await expect(page.locator('.comment-item')).toHaveCount(initialCommentCount);
    
    // The textarea should still contain the text
    await expect(page.locator('textarea[placeholder="Enter Your Comment"]')).toHaveValue('Charming Blog!');
  });

  test('should allow editing the fast comment before submission', async ({ page }) => {
    // Click the Fast Comment button
    await page.locator('header button:has-text("Fast Comment")').click();
    
    // Add additional text to the textarea
    await page.locator('textarea[placeholder="Enter Your Comment"]').type(' Additional text.');
    
    // Check if the textarea contains both the fast comment and the additional text
    await expect(page.locator('textarea[placeholder="Enter Your Comment"]')).toHaveValue('Charming Blog! Additional text.');
    
    // Submit the comment
    await page.locator('.comment-btn').click();
    
    // Check if the comment with the combined text was added
    await expect(page.locator('.comment-item').first()).toContainText('Charming Blog! Additional text.');
  });
});