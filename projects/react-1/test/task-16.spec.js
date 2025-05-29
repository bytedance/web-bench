// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Task 16 - Title Truncation and Tooltip', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application before each test
    await page.goto('/');
    
    // Add a blog with a very long title
    await page.locator('header button:has-text("Add Blog")').click();
    await page.locator('input[type="text"]').first().fill('This is a very long blog title that should definitely exceed 300 pixels in width and therefore should be truncated with ellipsis according to the requirements. The title should show dots at the end to indicate that it has been truncated.');
    await page.locator('textarea').first().fill('Content for the long title blog');
    await page.locator('.submit-btn').click();
    
    // Add a blog with a short title
    await page.locator('header button:has-text("Add Blog")').click();
    await page.locator('input[type="text"]').first().fill('Short Title');
    await page.locator('textarea').first().fill('Content for the short title blog');
    await page.locator('.submit-btn').click();
  });

  test('should truncate long titles with ellipsis', async ({ page }) => {
    // Select the blog with the long title
    await page.locator('.list-item').nth(2).click();
    
    // Check if the title is truncated with ellipsis
    const titleElement = page.locator('.blog-title');
    
    // Check if the title contains ellipsis
    const titleText = await titleElement.textContent();
    expect(titleText).toContain('...');
    
    // Check if the width is limited
    const titleWidth = await titleElement.evaluate(el => {
      return el.offsetWidth;
    });
    
    // The width should be close to 300px
    expect(titleWidth).toBeLessThanOrEqual(320); // Allow some margin for padding/borders
  });

  test('should not truncate short titles', async ({ page }) => {
    // Select the blog with the short title
    await page.locator('.list-item').nth(3).click();
    
    // Check if the title is not truncated
    const titleElement = page.locator('.blog-title');
    
    // Check if the title does not contain ellipsis
    const titleText = await titleElement.textContent();
    expect(titleText).not.toContain('...');
    expect(titleText).toBe('Short Title');
  });

  test('should show tooltip on hover for long titles', async ({ page }) => {
    // Select the blog with the long title
    await page.locator('.list-item').nth(2).click();
    
    // Hover over the title
    await page.locator('.blog-title').hover();
    
    // Check if a tooltip appears
    const tooltip = page.locator('.tooltip');
    await expect(tooltip).toBeVisible();
    
    // Check if the tooltip contains the full title text
    const fullTitle = 'This is a very long blog title that should definitely exceed 300 pixels in width and therefore should be truncated with ellipsis according to the requirements. The title should show dots at the end to indicate that it has been truncated.';
    await expect(tooltip).toContainText(fullTitle);
  });

  test('should not show tooltip for short titles', async ({ page }) => {
    // Select the blog with the short title
    await page.locator('.list-item').nth(3).click();
    
    // Hover over the title
    await page.locator('.blog-title').hover();
    
    // Check if no tooltip appears
    const tooltip = page.locator('.tooltip');
    const isTooltipVisible = await tooltip.isVisible().catch(() => false);
    expect(isTooltipVisible).toBeFalsy();
  });

  test('should truncate titles in BlogList as well', async ({ page }) => {
    // Check if the long title in the BlogList is also truncated
    const longTitleListItem = page.locator('.list-item').nth(2);
    
    // Check if the list item has a limited width
    const listItemWidth = await longTitleListItem.evaluate(el => {
      return el.offsetWidth;
    });
    
    // The width should be limited (300px as specified in task 2)
    expect(listItemWidth).toBeLessThanOrEqual(320); // Allow some margin for padding/borders
    
    // Check if the text is truncated
    const listItemText = await longTitleListItem.textContent();
    expect(listItemText).toContain('...');
    
    // Hover over the list item to check for tooltip
    await longTitleListItem.hover();
    
    // Check if a tooltip appears
    const tooltip = page.locator('.tooltip');
    await expect(tooltip).toBeVisible();
  });
});