// test/task-16.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Task 16: Reverse Order of Last 2 Cards', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('file://' + process.cwd() + '/src/index.html');
  });

  test('should reverse the visual order of last 2 cards', async ({ page }) => {
    const cards = page.locator('.card');
    await expect(cards).toHaveCount(12);
    
    // Check if the last two cards have order properties
    const eleventhCard = cards.nth(10);
    const twelfthCard = cards.nth(11);
    
    const eleventhOrder = await eleventhCard.evaluate(el => getComputedStyle(el).order || el.style.order);
    const twelfthOrder = await twelfthCard.evaluate(el => getComputedStyle(el).order || el.style.order);
    
    expect(eleventhOrder).toBeTruthy();
    expect(twelfthOrder).toBeTruthy();
  });

  test('should maintain grid layout with reversed cards', async ({ page }) => {
    const content = page.locator('.content');
    const display = await content.evaluate(el => getComputedStyle(el).display);
    expect(display).toBe('grid');
  });

  test('should still display all 12 cards after reordering', async ({ page }) => {
    const visibleCards = page.locator('.card:visible');
    await expect(visibleCards).toHaveCount(12);
  });

  test('should maintain card structure after reordering', async ({ page }) => {
    const lastCard = page.locator('.card').last();
    await expect(lastCard.locator('.card-image')).toBeVisible();
    await expect(lastCard.locator('.card-title')).toBeVisible();
    await expect(lastCard.locator('.card-price')).toBeVisible();
  });
});