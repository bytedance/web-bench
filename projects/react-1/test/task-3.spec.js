// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Task 3 - Selectable Blog Items', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application before each test
    await page.goto('/');
  });

  test('should have Morning blog selected by default', async ({ page }) => {
    // Get all list items
    const listItems = page.locator('.list-item');
    
    // Check if the first item (Morning) has some visual indication of being selected
    // We'll check for any CSS difference that might indicate selection
    const isFirstItemSelected = await listItems.first().evaluate(el => {
      // Check for common selection indicators like background-color, border, etc.
      const style = window.getComputedStyle(el);
      return {
        backgroundColor: style.backgroundColor !== 'rgba(0, 0, 0, 0)' && style.backgroundColor !== 'transparent',
        border: style.border !== 'none' && style.border !== '',
        fontWeight: style.fontWeight !== 'normal' && style.fontWeight !== '400',
        // Any other visual indicator that might be used
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
    
    // Check if the Blog component displays the content from the first item
    await expect(page.locator('.blog-title')).toContainText('Morning');
    await expect(page.locator('main')).toContainText('Morning My Friends');
  });

  test('should display selected blog content when clicking on a list item', async ({ page }) => {
    // Get all list items
    const listItems = page.locator('.list-item');
    
    // Click on the second item (Travel)
    await listItems.nth(1).click();
    
    // Check if the Blog component now displays the content from the second item
    await expect(page.locator('.blog-title')).toContainText('Travel');
    await expect(page.locator('main')).toContainText('I love traveling!');
  });

  test('should highlight the selected blog item', async ({ page }) => {
    // Get all list items
    const listItems = page.locator('.list-item');
    
    // Click on the second item (Travel)
    await listItems.nth(1).click();
    
    // Check if the second item has some visual indication of being selected
    const isSecondItemSelected = await listItems.nth(1).evaluate(el => {
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
      isSecondItemSelected.backgroundColor || 
      isSecondItemSelected.border || 
      isSecondItemSelected.fontWeight || 
      isSecondItemSelected.hasSelectionClass
    ).toBeTruthy();
  });

  test('should maintain list item size when beautified', async ({ page }) => {
    // Check if list items still have the correct height after beautification
    const firstItemHeight = await page.locator('.list-item').first().evaluate(el => {
      return window.getComputedStyle(el).height;
    });
    
    // Height should still be close to 40px as specified in task 2
    expect(parseFloat(firstItemHeight)).toBeCloseTo(40, -1); // Allow some margin of error
  });
});