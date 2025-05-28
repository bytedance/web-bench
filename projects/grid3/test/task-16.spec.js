const { test, expect } = require('@playwright/test');

test.describe('Task 16: Reverse order of last 2 cards', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('file://' + __dirname + '/../src/index.html');
    await page.setViewportSize({ width: 1200, height: 800 });
  });

  test('should reverse visual order of last 2 cards', async ({ page }) => {
    const cards = page.locator('.card');
    const eleventhCard = cards.nth(10);
    const twelfthCard = cards.nth(11);
    
    const eleventhBox = await eleventhCard.boundingBox();
    const twelfthBox = await twelfthCard.boundingBox();
    
    expect(twelfthBox.x).toBeLessThan(eleventhBox.x);
  });

  test('should maintain same row for last 2 cards', async ({ page }) => {
    const cards = page.locator('.card');
    const eleventhCard = cards.nth(10);
    const twelfthCard = cards.nth(11);
    
    const eleventhBox = await eleventhCard.boundingBox();
    const twelfthBox = await twelfthCard.boundingBox();
    
    expect(Math.abs(eleventhBox.y - twelfthBox.y)).toBeLessThan(10);
  });

  test('should not affect order of first 10 cards', async ({ page }) => {
    const cards = page.locator('.card');
    const firstCard = cards.nth(0);
    const secondCard = cards.nth(1);
    const thirdCard = cards.nth(2);
    
    const firstBox = await firstCard.boundingBox();
    const secondBox = await secondCard.boundingBox();
    const thirdBox = await thirdCard.boundingBox();
    
    expect(secondBox.x).toBeGreaterThan(firstBox.x);
    expect(thirdBox.x).toBeGreaterThan(secondBox.x);
  });

  test('should maintain card functionality after reordering', async ({ page }) => {
    const cards = page.locator('.card');
    const eleventhCard = cards.nth(10);
    const twelfthCard = cards.nth(11);
    
    await expect(eleventhCard).toBeVisible();
    await expect(twelfthCard).toBeVisible();
    
    await expect(eleventhCard.locator('.card-title')).toBeVisible();
    await expect(twelfthCard.locator('.card-title')).toBeVisible();
  });

  test('should preserve reordering in different viewport sizes', async ({ page }) => {
    await page.setViewportSize({ width: 800, height: 600 });
    
    const cards = page.locator('.card');
    const eleventhCard = cards.nth(10);
    const twelfthCard = cards.nth(11);
    
    const eleventhBox = await eleventhCard.boundingBox();
    const twelfthBox = await twelfthCard.boundingBox();
    
    expect(twelfthBox.x).toBeLessThan(eleventhBox.x);
  });
});