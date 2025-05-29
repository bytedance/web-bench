// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Task 10 - Search Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application before each test
    await page.goto('/');
    
    // Add a few more blogs for better search testing
    await page.locator('header button:has-text("Add Blog")').click();
    await page.locator('input[type="text"]').first().fill('Programming');
    await page.locator('textarea').first().fill('I love coding in JavaScript');
    await page.locator('.submit-btn').click();
    
    await page.locator('header button:has-text("Add Blog")').click();
    await page.locator('input[type="text"]').first().fill('Cooking');
    await page.locator('textarea').first().fill('Cooking is my passion');
    await page.locator('.submit-btn').click();
  });

  test('should have Search component above BlogList', async ({ page }) => {
    // Check if the Search component exists
    const searchComponent = page.locator('input[placeholder="Search Blogs"]').first();
    await expect(searchComponent).toBeVisible();
    
    // Check if it's positioned above the BlogList
    const searchBox = await searchComponent.boundingBox();
    const firstListItemBox = await page.locator('.list-item').first().boundingBox();
    
    expect(searchBox.y).toBeLessThan(firstListItemBox.y);
  });

  test('should have correct width for Search component', async ({ page }) => {
    // Check if the Search component has the correct width
    const searchWidth = await page.locator('input[placeholder="Search Blogs"]').evaluate(el => {
      return window.getComputedStyle(el).width;
    });
    
    // Width should be close to 200px
    expect(parseFloat(searchWidth)).toBeCloseTo(200, -1);
  });

  test('should filter blogs based on search input', async ({ page }) => {
    // Get the initial count of blog items
    const initialCount = await page.locator('.list-item').count();
    
    // Enter a search term that should match only one blog
    await page.locator('input[placeholder="Search Blogs"]').fill('Program');
    
    // Wait for the filtering to take effect
    await page.waitForTimeout(100);
    
    // Check if the list is filtered to show only matching blogs
    const filteredCount = await page.locator('.list-item').count();
    expect(filteredCount).toBeLessThan(initialCount);
    
    // Check if the visible blog contains the search term
    await expect(page.locator('.list-item').first()).toContainText('Program');
  });

  test('should show all blogs when search input is cleared', async ({ page }) => {
    // Get the initial count of blog items
    const initialCount = await page.locator('.list-item').count();
    
    // Enter a search term
    await page.locator('input[placeholder="Search Blogs"]').fill('Cook');
    
    // Wait for the filtering to take effect
    await page.waitForTimeout(100);
    
    // Clear the search input
    await page.locator('input[placeholder="Search Blogs"]').fill('');
    
    // Wait for the filtering to reset
    await page.waitForTimeout(100);
    
    // Check if all blogs are shown again
    await expect(page.locator('.list-item')).toHaveCount(initialCount);
  });

  test('should be case-insensitive when filtering', async ({ page }) => {
    // Enter a search term in lowercase
    await page.locator('input[placeholder="Search Blogs"]').fill('programming');
    
    // Wait for the filtering to take effect
    await page.waitForTimeout(100);
    
    // Check if the blog with 'Programming' (capitalized) is still shown
    await expect(page.locator('.list-item')).toContainText('Programming');
    
    // Try with uppercase
    await page.locator('input[placeholder="Search Blogs"]').fill('PROGRAMMING');
    
    // Wait for the filtering to take effect
    await page.waitForTimeout(100);
    
    // Check if the blog with 'Programming' is still shown
    await expect(page.locator('.list-item')).toContainText('Programming');
  });
});