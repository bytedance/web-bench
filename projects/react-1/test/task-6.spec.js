// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Task 6 - BlogForm Submission', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application before each test
    await page.goto('/');
  });

  test('should have form with title and detail inputs in BlogForm', async ({ page }) => {
    // Click the Add Blog button to show the BlogForm
    await page.locator('header button:has-text("Add Blog")').click();
    
    // Check if the form exists in the BlogForm
    const form = page.locator('div:has-text("Create Blog")').locator('form');
    await expect(form).toBeVisible();
    
    // Check if the form has title and detail inputs with labels
    const titleLabel = form.locator('label:has-text("Title")');
    const detailLabel = form.locator('label:has-text("Detail")');
    
    await expect(titleLabel).toBeVisible();
    await expect(detailLabel).toBeVisible();
    
    // Check if the inputs exist
    const titleInput = form.locator('input[type="text"]').first();
    const detailInput = form.locator('textarea').first();
    
    await expect(titleInput).toBeVisible();
    await expect(detailInput).toBeVisible();
  });

  test('should have submit button in BlogForm', async ({ page }) => {
    // Click the Add Blog button to show the BlogForm
    await page.locator('header button:has-text("Add Blog")').click();
    
    // Check if the submit button exists in the BlogForm
    const submitButton = page.locator('.submit-btn');
    await expect(submitButton).toBeVisible();
  });

  test('should add new blog to BlogList when form is submitted', async ({ page }) => {
    // Get the initial count of blog items
    const initialCount = await page.locator('.list-item').count();
    
    // Click the Add Blog button to show the BlogForm
    await page.locator('header button:has-text("Add Blog")').click();
    
    // Fill in the form
    await page.locator('input[type="text"]').first().fill('New Blog Title');
    await page.locator('textarea').first().fill('This is a new blog post');
    
    // Submit the form
    await page.locator('.submit-btn').click();
    
    // Check if a new blog item was added to the BlogList
    await expect(page.locator('.list-item')).toHaveCount(initialCount + 1);
    
    // Check if the new blog item contains the correct title
    await expect(page.locator('.list-item').nth(initialCount)).toContainText('New Blog Title');
  });

  test('should select the new blog after submission', async ({ page }) => {
    // Click the Add Blog button to show the BlogForm
    await page.locator('header button:has-text("Add Blog")').click();
    
    // Fill in the form
    await page.locator('input[type="text"]').first().fill('Selected Blog');
    await page.locator('textarea').first().fill('This blog should be selected');
    
    // Submit the form
    await page.locator('.submit-btn').click();
    
    // Check if the Blog component displays the content from the new blog
    await expect(page.locator('.blog-title')).toContainText('Selected Blog');
    await expect(page.locator('main')).toContainText('This blog should be selected');
    
    // Check if the new blog item is visually selected
    const listItems = page.locator('.list-item');
    const lastItemIndex = await listItems.count() - 1;
    
    const isLastItemSelected = await listItems.nth(lastItemIndex).evaluate(el => {
      // Check for common selection indicators
      const style = window.getComputedStyle(el);
      return {
        backgroundColor: style.backgroundColor !== 'rgba(0, 0, 0, 0)' && style.backgroundColor !== 'transparent',
        border: style.border !== 'none' && style.border !== '',
        fontWeight: style.fontWeight !== 'normal' && style.fontWeight !== '400',
        hasSelectionClass: el.classList.contains('selected') || el.classList.contains('active') || el.getAttribute('aria-selected') === 'true'
      };
    });
    
    // At least one selection indicator should be true
    expect(
      isLastItemSelected.backgroundColor || 
      isLastItemSelected.border || 
      isLastItemSelected.fontWeight || 
      isLastItemSelected.hasSelectionClass
    ).toBeTruthy();
  });

  test('should keep previous mock data after adding new blog', async ({ page }) => {
    // Check if the original mock data is still present
    await expect(page.locator('.list-item').nth(0)).toContainText('Morning');
    await expect(page.locator('.list-item').nth(1)).toContainText('Travel');
    
    // Add a new blog
    await page.locator('header button:has-text("Add Blog")').click();
    await page.locator('input[type="text"]').first().fill('New Blog');
    await page.locator('textarea').first().fill('New content');
    await page.locator('.submit-btn').click();
    
    // Check if all blogs are present (original mock data + new blog)
    await expect(page.locator('.list-item').nth(0)).toContainText('Morning');
    await expect(page.locator('.list-item').nth(1)).toContainText('Travel');
    await expect(page.locator('.list-item').nth(2)).toContainText('New Blog');
  });
});