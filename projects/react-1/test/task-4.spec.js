// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Task 4 - BlogForm Modal', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application before each test
    await page.goto('/');
  });

  test('should have Add Blog button in Header', async ({ page }) => {
    // Check if the Add Blog button exists in the header
    const addButton = page.locator('header button:has-text("Add Blog")');
    await expect(addButton).toBeVisible();
    
    // Check if the button is positioned on the right side of the header
    const headerBox = await page.locator('header').boundingBox();
    const buttonBox = await addButton.boundingBox();
    
    // Button should be positioned in the right half of the header
    expect(buttonBox.x).toBeGreaterThan(headerBox.x + headerBox.width / 2);
  });

  test('should initially have BlogForm hidden', async ({ page }) => {
    // Check if BlogForm is initially hidden
    // We'll look for an element that might be the modal with title 'Create Blog'
    const blogForm = page.locator('div:has-text("Create Blog")').first();
    
    // Check if it's not visible or not in the DOM yet
    const isVisible = await blogForm.isVisible().catch(() => false);
    expect(isVisible).toBeFalsy();
  });

  test('should show BlogForm when Add Blog button is clicked', async ({ page }) => {
    // Click the Add Blog button
    await page.locator('header button:has-text("Add Blog")').click();
    
    // Check if BlogForm becomes visible
    // We'll look for an element that might be the modal with title 'Create Blog'
    const blogForm = page.locator('div:has-text("Create Blog")').first();
    await expect(blogForm).toBeVisible();
  });

  test('should have close button in BlogForm', async ({ page }) => {
    // Click the Add Blog button to show the BlogForm
    await page.locator('header button:has-text("Add Blog")').click();
    
    // Check if the close button exists in the BlogForm
    const closeButton = page.locator('.close-btn');
    await expect(closeButton).toBeVisible();
    
    // Check if the close button contains 'x'
    await expect(closeButton).toContainText('x');
    
    // Check if the close button is positioned in the top right of the BlogForm
    const blogFormBox = await page.locator('div:has-text("Create Blog")').first().boundingBox();
    const closeButtonBox = await closeButton.boundingBox();
    
    // Close button should be positioned in the top right corner of the BlogForm
    expect(closeButtonBox.x + closeButtonBox.width).toBeCloseTo(blogFormBox.x + blogFormBox.width, -1);
    expect(closeButtonBox.y).toBeCloseTo(blogFormBox.y, -1);
  });

  test('should hide BlogForm when close button is clicked', async ({ page }) => {
    // Click the Add Blog button to show the BlogForm
    await page.locator('header button:has-text("Add Blog")').click();
    
    // Wait for the BlogForm to be visible
    await page.locator('div:has-text("Create Blog")').first().waitFor({ state: 'visible' });
    
    // Click the close button
    await page.locator('.close-btn').click();
    
    // Check if the BlogForm is hidden
    const blogForm = page.locator('div:has-text("Create Blog")').first();
    
    // Wait a moment for any animations to complete
    await page.waitForTimeout(100);
    
    // Check if it's not visible
    const isVisible = await blogForm.isVisible().catch(() => false);
    expect(isVisible).toBeFalsy();
  });
});