// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Task 15 - Toast Notifications', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application before each test
    await page.goto('/');
  });

  test('should show toast when a new blog is created', async ({ page }) => {
    // Add a new blog
    await page.locator('header button:has-text("Add Blog")').click();
    await page.locator('input[type="text"]').first().fill('Toast Test Blog');
    await page.locator('textarea').first().fill('Testing toast notifications');
    await page.locator('.submit-btn').click();
    
    // Check if a toast notification appears
    // The toast might have various class names, so we'll check for common patterns
    const toastSelectors = [
      'div.toast',
      '.toast-container > div',
      '.notification',
      '.alert',
      'div[role="alert"]'
    ];
    
    // Try each selector until we find a visible toast
    let toastFound = false;
    let toastElement = null;
    
    for (const selector of toastSelectors) {
      const toast = page.locator(selector);
      if (await toast.isVisible().catch(() => false)) {
        toastFound = true;
        toastElement = toast;
        break;
      }
    }
    
    expect(toastFound).toBeTruthy();
    
    // Check if the toast contains the correct message
    await expect(toastElement).toContainText('New Blog Created Successfully!');
    
    // Check if the toast has a green color
    const toastColor = await toastElement.evaluate(el => {
      return window.getComputedStyle(el).backgroundColor;
    });
    
    // The color should contain some green component
    expect(toastColor.includes('rgb(') && toastColor.includes('0, 255') || toastColor.includes('0, 200')).toBeTruthy();
  });

  test('should show toast when a new comment is created', async ({ page }) => {
    // Add a new comment
    await page.locator('textarea[placeholder="Enter Your Comment"]').fill('Testing toast with comments');
    await page.locator('.comment-btn').click();
    
    // Check if a toast notification appears
    const toastSelectors = [
      'div.toast',
      '.toast-container > div',
      '.notification',
      '.alert',
      'div[role="alert"]'
    ];
    
    // Try each selector until we find a visible toast
    let toastFound = false;
    let toastElement = null;
    
    for (const selector of toastSelectors) {
      const toast = page.locator(selector);
      if (await toast.isVisible().catch(() => false)) {
        toastFound = true;
        toastElement = toast;
        break;
      }
    }
    
    expect(toastFound).toBeTruthy();
    
    // Check if the toast contains the correct message
    await expect(toastElement).toContainText('New Comment Created Successfully!');
  });

  test('should position toast at the top of the page', async ({ page }) => {
    // Add a new blog to trigger the toast
    await page.locator('header button:has-text("Add Blog")').click();
    await page.locator('input[type="text"]').first().fill('Position Test');
    await page.locator('textarea').first().fill('Testing toast position');
    await page.locator('.submit-btn').click();
    
    // Find the toast element
    const toastSelectors = [
      'div.toast',
      '.toast-container > div',
      '.notification',
      '.alert',
      'div[role="alert"]'
    ];
    
    let toastElement = null;
    for (const selector of toastSelectors) {
      const toast = page.locator(selector);
      if (await toast.isVisible().catch(() => false)) {
        toastElement = toast;
        break;
      }
    }
    
    // Get the bounding box of the toast
    const toastBox = await toastElement.boundingBox();
    
    // Check if the toast is positioned at the top of the page
    expect(toastBox.y).toBeLessThan(100); // Should be near the top
  });

  test('should automatically hide toast after some time', async ({ page }) => {
    // Add a new blog to trigger the toast
    await page.locator('header button:has-text("Add Blog")').click();
    await page.locator('input[type="text"]').first().fill('Auto Hide Test');
    await page.locator('textarea').first().fill('Testing toast auto-hide');
    await page.locator('.submit-btn').click();
    
    // Find the toast element
    const toastSelectors = [
      'div.toast',
      '.toast-container > div',
      '.notification',
      '.alert',
      'div[role="alert"]'
    ];
    
    let toastElement = null;
    for (const selector of toastSelectors) {
      const toast = page.locator(selector);
      if (await toast.isVisible().catch(() => false)) {
        toastElement = toast;
        break;
      }
    }
    
    // Wait for the toast to disappear (should be around 2000ms)
    await page.waitForTimeout(2500);
    
    // Check if the toast is no longer visible
    const isToastVisible = await toastElement.isVisible().catch(() => false);
    expect(isToastVisible).toBeFalsy();
  });

  test('should replace old toast when a new one is triggered', async ({ page }) => {
    // Add a new blog to trigger the first toast
    await page.locator('header button:has-text("Add Blog")').click();
    await page.locator('input[type="text"]').first().fill('First Toast Test');
    await page.locator('textarea').first().fill('Testing first toast');
    await page.locator('.submit-btn').click();
    
    // Find the first toast element and get its text
    const toastSelectors = [
      'div.toast',
      '.toast-container > div',
      '.notification',
      '.alert',
      'div[role="alert"]'
    ];
    
    let firstToastText = '';
    for (const selector of toastSelectors) {
      const toast = page.locator(selector);
      if (await toast.isVisible().catch(() => false)) {
        firstToastText = await toast.textContent();
        break;
      }
    }
    
    // Quickly add a new comment to trigger the second toast
    await page.locator('textarea[placeholder="Enter Your Comment"]').fill('Testing toast replacement');
    await page.locator('.comment-btn').click();
    
    // Wait a moment for the second toast to appear
    await page.waitForTimeout(100);
    
    // Find the second toast element and get its text
    let secondToastText = '';
    for (const selector of toastSelectors) {
      const toast = page.locator(selector);
      if (await toast.isVisible().catch(() => false)) {
        secondToastText = await toast.textContent();
        break;
      }
    }
    
    // The second toast should have a different message than the first
    expect(secondToastText).not.toEqual(firstToastText);
    expect(secondToastText).toContain('New Comment Created Successfully!');
  });
});