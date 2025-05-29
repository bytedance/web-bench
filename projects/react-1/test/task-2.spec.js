// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Task 2 - BlogList Component', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application before each test
    await page.goto('/');
  });

  test('should display BlogList with correct number of items', async ({ page }) => {
    // Check if BlogList exists and contains the correct number of items
    const listItems = page.locator('.list-item');
    await expect(listItems).toHaveCount(2);
  });

  test('should display correct blog titles in the list', async ({ page }) => {
    // Check if the list items contain the correct titles
    const listItems = page.locator('.list-item');
    
    // Check first item
    await expect(listItems.nth(0)).toContainText('Morning');
    
    // Check second item
    await expect(listItems.nth(1)).toContainText('Travel');
  });

  test('should position BlogList correctly on the left side', async ({ page }) => {
    // Get the bounding box of the BlogList container
    const blogListBox = await page.locator('.list-item').first().evaluate(el => {
      // Find the parent container that would be the BlogList
      let parent = el.parentElement;
      while (parent && !parent.classList.contains('blog-list') && parent.tagName !== 'BODY') {
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
    
    // Check if BlogList is positioned on the left side
    expect(blogListBox.x).toBeLessThan(50); // Should be close to the left edge
    
    // Check if BlogList has the correct width
    expect(blogListBox.width).toBeCloseTo(300, -1); // Allow some margin of error
  });

  test('should have list items with correct height', async ({ page }) => {
    // Check if list items have the correct height
    const firstItemHeight = await page.locator('.list-item').first().evaluate(el => {
      return window.getComputedStyle(el).height;
    });
    
    // Check if height is close to 40px
    expect(parseFloat(firstItemHeight)).toBeCloseTo(40, -1); // Allow some margin of error
  });

  test('should display Blog component with content from first item', async ({ page }) => {
    // Check if Blog component displays the content from the first item
    await expect(page.locator('.blog-title')).toContainText('Morning');
    await expect(page.locator('main')).toContainText('Morning My Friends');
    
    // Should not display content from the second item yet
    const mainText = await page.locator('main').textContent();
    const blogTitleText = await page.locator('.blog-title').textContent();
    
    // The main blog area should not show both blog contents simultaneously
    const containsFirstBlog = mainText.includes('Morning My Friends');
    const containsSecondBlog = mainText.includes('I love traveling!');
    
    expect(containsFirstBlog).toBeTruthy();
    expect(containsSecondBlog && !blogTitleText.includes('Travel')).toBeFalsy();
  });
});