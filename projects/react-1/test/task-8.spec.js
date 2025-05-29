// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Task 8 - Delete Blog Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application before each test
    await page.goto('/');
  });

  test('should have Delete button in Blog component', async ({ page }) => {
    // Check if the Delete button exists in the Blog component
    const deleteButton = page.locator('.delete-btn');
    await expect(deleteButton).toBeVisible();
    
    // Check if the button has the correct text
    await expect(deleteButton).toContainText('Delete');
    
    // Check if the button has a red color (indicating it's a delete action)
    const buttonColor = await deleteButton.evaluate(el => {
      return window.getComputedStyle(el).backgroundColor || window.getComputedStyle(el).color;
    });
    
    // The color should contain some red component
    // This is a loose check since the exact shade of red can vary
    expect(buttonColor.includes('rgb(') && buttonColor.includes('255')).toBeTruthy();
  });

  test('should position Delete button in top-right of Blog component', async ({ page }) => {
    // Get the bounding boxes of the Blog component and the Delete button
    const blogBox = await page.locator('.blog-title').evaluate(el => {
      // Find the parent container that would be the Blog component
      let parent = el.parentElement;
      while (parent && parent.tagName !== 'BODY') {
        if (parent.contains(document.querySelector('.delete-btn'))) {
          break;
        }
        parent = parent.parentElement;
      }
      if (!parent || parent.tagName === 'BODY') return null;
      
      const rect = parent.getBoundingClientRect();
      return {
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height
      };
    });
    
    const deleteButtonBox = await page.locator('.delete-btn').boundingBox();
    
    // Check if the Delete button is positioned in the top-right of the Blog component
    expect(deleteButtonBox.x + deleteButtonBox.width).toBeCloseTo(blogBox.x + blogBox.width, -1);
    expect(deleteButtonBox.y).toBeCloseTo(blogBox.y, -1);
  });

  test('should delete selected blog when Delete button is clicked', async ({ page }) => {
    // Get the initial count of blog items
    const initialCount = await page.locator('.list-item').count();
    
    // Get the title of the currently selected blog
    const selectedBlogTitle = await page.locator('.blog-title').textContent();
    
    // Click the Delete button
    await page.locator('.delete-btn').click();
    
    // Check if a blog was deleted (count should decrease by 1)
    await expect(page.locator('.list-item')).toHaveCount(initialCount - 1);
    
    // Check if the deleted blog is no longer in the list
    const remainingTitles = await page.locator('.list-item').allTextContents();
    expect(remainingTitles.some(title => title.includes(selectedBlogTitle))).toBeFalsy();
  });

  test('should select first blog after deleting the selected blog', async ({ page }) => {
    // Get the title of the first blog (which should be selected after deletion)
    const firstBlogTitle = await page.locator('.list-item').nth(1).textContent();
    
    // Select the second blog first
    await page.locator('.list-item').nth(1).click();
    
    // Click the Delete button to delete the second blog
    await page.locator('.delete-btn').click();
    
    // Check if the first blog is now selected
    await expect(page.locator('.blog-title')).toContainText(firstBlogTitle);
    
    // Check if the first list item is visually selected
    const isFirstItemSelected = await page.locator('.list-item').first().evaluate(el => {
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
      isFirstItemSelected.backgroundColor || 
      isFirstItemSelected.border || 
      isFirstItemSelected.fontWeight || 
      isFirstItemSelected.hasSelectionClass
    ).toBeTruthy();
  });

  test('should update blog list length after deleting a blog', async ({ page }) => {
    // Get the initial blog list length
    const initialLength = await page.locator('.blog-list-len').textContent();
    const initialCount = parseInt(initialLength);
    
    // Click the Delete button to delete the selected blog
    await page.locator('.delete-btn').click();
    
    // Check if the blog list length was updated
    await expect(page.locator('.blog-list-len')).toHaveText((initialCount - 1).toString());
  });
});