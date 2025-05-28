const { test, expect } = require('@playwright/test');

test.describe('Task 15: Card structure with image, title, and price', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('file://' + __dirname + '/../src/index.html');
    await page.setViewportSize({ width: 1200, height: 800 });
  });

  test('should display image, title, and price in each card', async ({ page }) => {
    const cards = page.locator('.card');
    const firstCard = cards.nth(0);
    
    await expect(firstCard.locator('.card-image')).toBeVisible();
    await expect(firstCard.locator('.card-title')).toBeVisible();
    await expect(firstCard.locator('.card-price')).toBeVisible();
  });

  test('should have card title with minimum height of 1.5rem', async ({ page }) => {
    const cardTitle = page.locator('.card-title').first();
    const titleBox = await cardTitle.boundingBox();
    const minHeight = 1.5 * 16;
    
    expect(titleBox.height).toBeGreaterThanOrEqual(minHeight - 5);
  });

  test('should have card price with minimum height of 1rem', async ({ page }) => {
    const cardPrice = page.locator('.card-price').first();
    const priceBox = await cardPrice.boundingBox();
    const minHeight = 1 * 16;
    
    expect(priceBox.height).toBeGreaterThanOrEqual(minHeight - 5);
  });

  test('should display title text without wrapping', async ({ page }) => {
    const cardTitle = page.locator('.card-title').first();
    const titleText = await cardTitle.textContent();
    const whiteSpace = await cardTitle.evaluate(el => getComputedStyle(el).whiteSpace);
    
    expect(titleText).toBe('Long Product Title That Goes Here');
    expect(whiteSpace).toBe('nowrap');
  });

  test('should have image occupy remaining space in card', async ({ page }) => {
    const card = page.locator('.card').first();
    const cardImage = card.locator('.card-image');
    const cardTitle = card.locator('.card-title');
    const cardPrice = card.locator('.card-price');
    
    const cardBox = await card.boundingBox();
    const imageBox = await cardImage.boundingBox();
    const titleBox = await cardTitle.boundingBox();
    const priceBox = await cardPrice.boundingBox();
    
    const expectedImageHeight = cardBox.height - titleBox.height - priceBox.height;
    expect(imageBox.height).toBeCloseTo(expectedImageHeight, 10);
  });
});