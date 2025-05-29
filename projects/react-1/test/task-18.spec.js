// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Task 18 - Routing and Game Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application before each test
    await page.goto('/');
  });

  test('should have game button in Header', async ({ page }) => {
    // Check if the game button exists in the Header
    const gameButton = page.locator('header button:has-text("🎮")');
    await expect(gameButton).toBeVisible();
    
    // Check if the button has an appealing style
    const buttonStyle = await gameButton.evaluate(el => {
      const style = window.getComputedStyle(el);
      return {
        backgroundColor: style.backgroundColor,
        color: style.color,
        borderRadius: style.borderRadius,
        padding: style.padding
      };
    });
    
    // The button should have some styling (not just default)
    expect(buttonStyle.backgroundColor !== 'rgba(0, 0, 0, 0)' && buttonStyle.backgroundColor !== 'transparent').toBeTruthy();
  });

  test('should navigate to Game page when game button is clicked', async ({ page }) => {
    // Click the game button
    await page.locator('header button:has-text("🎮")').click();
    
    // Check if the URL changes to /game
    await expect(page).toHaveURL(/\/game$/);
    
    // Check if the Game page is displayed
    await expect(page.locator('body')).toContainText('Hello Game');
  });

  test('should not show blog content on Game page', async ({ page }) => {
    // Click the game button to navigate to the Game page
    await page.locator('header button:has-text("🎮")').click();
    
    // Check if blog-related elements are not visible
    const blogElements = [
      page.locator('.blog-title'),
      page.locator('.list-item').first(),
      page.locator('header:has-text("Hello Blog")')
    ];
    
    for (const element of blogElements) {
      const isVisible = await element.isVisible().catch(() => false);
      expect(isVisible).toBeFalsy();
    }
  });

  test('should navigate back to App when browser back button is used', async ({ page }) => {
    // Click the game button to navigate to the Game page
    await page.locator('header button:has-text("🎮")').click();
    
    // Wait for the Game page to load
    await expect(page).toHaveURL(/\/game$/);
    
    // Go back using the browser's back button
    await page.goBack();
    
    // Check if we're back on the App page
    await expect(page).toHaveURL('/');
    
    // Check if the App page is displayed
    await expect(page.locator('header')).toContainText('Hello Blog');
    await expect(page.locator('.blog-title')).toBeVisible();
  });

  test('should maintain App state when navigating back from Game', async ({ page }) => {
    // Add a new blog to change the App state
    await page.locator('header button:has-text("Add Blog")').click();
    await page.locator('input[type="text"]').first().fill('State Test');
    await page.locator('textarea').first().fill('Testing state preservation');
    await page.locator('.submit-btn').click();
    
    // Select the new blog
    const listItems = page.locator('.list-item');
    const lastItemIndex = await listItems.count() - 1;
    await listItems.nth(lastItemIndex).click();
    
    // Navigate to the Game page
    await page.locator('header button:has-text("🎮")').click();
    await expect(page).toHaveURL(/\/game$/);
    
    // Go back to the App page
    await page.goBack();
    
    // Check if the App state is preserved (the new blog is still selected)
    await expect(page.locator('.blog-title')).toContainText('State Test');
  });
});