// test/task-15.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Task 15: Card Structure with Grid Layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('file://' + process.cwd() + '/src/index.html');
  });

  test('should display cards with image, title, and price components', async ({ page }) => {
    const cards = page.locator('.card');
    await expect(cards).toHaveCount(12);
    
    const firstCard = cards.first();
    await expect(firstCard.locator('.card-image')).toBeVisible();
    await expect(firstCard.locator('.card-title')).toBeVisible();
    await expect(firstCard.locator('.card-price')).toBeVisible();
  });

  test('should have title with minimum height and no wrap', async ({ page }) => {
    const cardTitle = page.locator('.card-title').first();
    const titleHeight = await cardTitle.evaluate(el => parseFloat(getComputedStyle(el).minHeight));
    expect(titleHeight).toBeGreaterThanOrEqual(24); // 1.5rem ≈ 24px
    
    const whiteSpace = await cardTitle.evaluate(el => getComputedStyle(el).whiteSpace);
    expect(whiteSpace).toBe('nowrap');
  });

  test('should have price with minimum height', async ({ page }) => {
    const cardPrice = page.locator('.card-price').first();
    const priceHeight = await cardPrice.evaluate(el => parseFloat(getComputedStyle(el).minHeight));
    expect(priceHeight).toBeGreaterThanOrEqual(16); // 1rem ≈ 16px
  });

  test('should use grid layout for card internal structure', async ({ page }) => {
    const card = page.locator('.card').first();
    const display = await card.evaluate(el => getComputedStyle(el).display);
    expect(display).toBe('grid');
  });

  test('should have image taking remaining space in card', async ({ page }) => {
    const card = page.locator('.card').first();
    const cardHeight = await card.evaluate(el => el.offsetHeight);
    const image = card.locator('.card-image');
    const imageHeight = await image.evaluate(el => el.offsetHeight);
    
    expect(imageHeight).toBeGreaterThan(cardHeight * 0.4); // Image should take significant space
  });
});