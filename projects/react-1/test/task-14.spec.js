// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Task 14 - Markdown Support', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application before each test
    await page.goto('/');
  });

  test('should render Markdown in blog details', async ({ page }) => {
    // Add a new blog with Markdown content
    await page.locator('header button:has-text("Add Blog")').click();
    await page.locator('input[type="text"]').first().fill('Markdown Test');
    await page.locator('textarea').first().fill('# Heading\n\n**Bold text**\n\n*Italic text*\n\n- List item 1\n- List item 2');
    await page.locator('.submit-btn').click();
    
    // Check if the Markdown is rendered correctly
    // Look for HTML elements that would be created from the Markdown
    const blogContent = page.locator('main');
    
    // Check for heading
    const heading = blogContent.locator('h1');
    await expect(heading).toBeVisible();
    await expect(heading).toContainText('Heading');
    
    // Check for bold text
    const boldText = blogContent.locator('strong');
    await expect(boldText).toBeVisible();
    await expect(boldText).toContainText('Bold text');
    
    // Check for italic text
    const italicText = blogContent.locator('em');
    await expect(italicText).toBeVisible();
    await expect(italicText).toContainText('Italic text');
    
    // Check for list items
    const listItems = blogContent.locator('li');
    await expect(listItems).toHaveCount(2);
    await expect(listItems.first()).toContainText('List item 1');
    await expect(listItems.nth(1)).toContainText('List item 2');
  });

  test('should sanitize HTML in Markdown to prevent XSS', async ({ page }) => {
    // Add a new blog with potentially malicious content
    await page.locator('header button:has-text("Add Blog")').click();
    await page.locator('input[type="text"]').first().fill('XSS Test');
    await page.locator('textarea').first().fill('Normal text\n\n<script>alert("XSS");</script>\n\n<img src="x" onerror="alert(\'XSS\')" />\n\n[Safe Link](https://example.com)');
    await page.locator('.submit-btn').click();
    
    // Check if the potentially malicious content is sanitized
    // The script tag should not be executed and should be removed or escaped
    const blogContent = page.locator('main');
    
    // Check if the normal text is still rendered
    await expect(blogContent).toContainText('Normal text');
    
    // Check if the safe link is rendered correctly
    const safeLink = blogContent.locator('a');
    await expect(safeLink).toBeVisible();
    await expect(safeLink).toHaveAttribute('href', 'https://example.com');
    
    // Check if the script tag is not present in its raw form
    const hasScriptTag = await page.evaluate(() => {
      const content = document.querySelector('main');
      return content.innerHTML.includes('<script>');
    });
    
    expect(hasScriptTag).toBeFalsy();
    
    // Check if the img tag with onerror attribute is sanitized
    const hasImgWithOnerror = await page.evaluate(() => {
      const content = document.querySelector('main');
      return content.innerHTML.includes('onerror=');
    });
    
    expect(hasImgWithOnerror).toBeFalsy();
  });

  test('should update Markdown rendering when blog is edited', async ({ page }) => {
    // Add a new blog with Markdown content
    await page.locator('header button:has-text("Add Blog")').click();
    await page.locator('input[type="text"]').first().fill('Edit Markdown Test');
    await page.locator('textarea').first().fill('# Original Heading');
    await page.locator('.submit-btn').click();
    
    // Edit the blog with different Markdown content
    await page.locator('.edit-btn').click();
    await page.locator('textarea').first().fill('## Updated Heading\n\n1. Numbered item');
    await page.locator('.submit-btn').click();
    
    // Check if the updated Markdown is rendered correctly
    const blogContent = page.locator('main');
    
    // Check for updated heading (h2 instead of h1)
    const heading = blogContent.locator('h2');
    await expect(heading).toBeVisible();
    await expect(heading).toContainText('Updated Heading');
    
    // Check for numbered list item
    const listItem = blogContent.locator('ol > li');
    await expect(listItem).toBeVisible();
    await expect(listItem).toContainText('Numbered item');
    
    // The original h1 heading should no longer be present
    const originalHeading = blogContent.locator('h1');
    const isOriginalHeadingVisible = await originalHeading.isVisible().catch(() => false);
    expect(isOriginalHeadingVisible).toBeFalsy();
  });
});