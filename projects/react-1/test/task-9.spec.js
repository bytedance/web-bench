// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Task 9 - Edit Blog Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application before each test
    await page.goto('/');
  });

  test('should have Edit button in Blog component', async ({ page }) => {
    // Check if the Edit button exists in the Blog component
    const editButton = page.locator('.edit-btn');
    await expect(editButton).toBeVisible();
    
    // Check if the button has the correct text
    await expect(editButton).toContainText('Edit');
    
    // Check if the button has a blue color (indicating it's an edit action)
    const buttonColor = await editButton.evaluate(el => {
      return window.getComputedStyle(el).backgroundColor || window.getComputedStyle(el).color;
    });
    
    // The color should contain some blue component
    // This is a loose check since the exact shade of blue can vary
    expect(buttonColor.includes('rgb(') && buttonColor.includes('0, 0, 255') || buttonColor.includes('0, 0, 200')).toBeTruthy();
  });

  test('should position Edit button in top-right of Blog component', async ({ page }) => {
    // Get the bounding boxes of the Blog component and the Edit button
    const blogBox = await page.locator('.blog-title').evaluate(el => {
      // Find the parent container that would be the Blog component
      let parent = el.parentElement;
      while (parent && parent.tagName !== 'BODY') {
        if (parent.contains(document.querySelector('.edit-btn'))) {
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
    
    const editButtonBox = await page.locator('.edit-btn').boundingBox();
    const deleteButtonBox = await page.locator('.delete-btn').boundingBox();
    
    // Check if the Edit button is positioned in the top-right of the Blog component
    // It should be to the left of the Delete button
    expect(editButtonBox.x + editButtonBox.width).toBeCloseTo(deleteButtonBox.x, -1);
    expect(editButtonBox.y).toBeCloseTo(blogBox.y, -1);
  });

  test('should show BlogForm with Edit Form title when Edit button is clicked', async ({ page }) => {
    // Click the Edit button
    await page.locator('.edit-btn').click();
    
    // Check if the BlogForm is visible with the title 'Edit Form'
    const editForm = page.locator('div:has-text("Edit Form")').first();
    await expect(editForm).toBeVisible();
  });

  test('should pre-fill form with selected blog content', async ({ page }) => {
    // Get the title and detail of the currently selected blog
    const selectedBlogTitle = await page.locator('.blog-title').textContent();
    const selectedBlogDetail = await page.locator('main').textContent();
    const cleanDetail = selectedBlogDetail.replace(selectedBlogTitle, '').trim();
    
    // Click the Edit button
    await page.locator('.edit-btn').click();
    
    // Check if the form inputs are pre-filled with the selected blog content
    const titleInput = page.locator('input[type="text"]').first();
    const detailInput = page.locator('textarea').first();
    
    await expect(titleInput).toHaveValue(selectedBlogTitle);
    
    // The detail might be formatted differently in the textarea
    // So we'll check if it contains the main content
    const detailValue = await detailInput.inputValue();
    expect(detailValue).toContain(cleanDetail.substring(0, 10));
  });

  test('should update selected blog when form is submitted', async ({ page }) => {
    // Get the initial title of the selected blog
    const initialTitle = await page.locator('.blog-title').textContent();
    
    // Click the Edit button
    await page.locator('.edit-btn').click();
    
    // Update the form inputs
    await page.locator('input[type="text"]').first().fill('Updated Title');
    await page.locator('textarea').first().fill('Updated content for testing');
    
    // Submit the form
    await page.locator('.submit-btn').click();
    
    // Check if the blog was updated with the new content
    await expect(page.locator('.blog-title')).toContainText('Updated Title');
    await expect(page.locator('main')).toContainText('Updated content for testing');
    
    // Check if the blog list item was also updated
    const listItems = page.locator('.list-item');
    let updatedItemFound = false;
    
    for (let i = 0; i < await listItems.count(); i++) {
      const itemText = await listItems.nth(i).textContent();
      if (itemText.includes('Updated Title')) {
        updatedItemFound = true;
        break;
      }
    }
    
    expect(updatedItemFound).toBeTruthy();
    
    // Check that the original title is no longer in the list
    const allListTexts = await listItems.allTextContents();
    expect(allListTexts.some(text => text.includes(initialTitle))).toBeFalsy();
  });
});