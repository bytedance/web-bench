const { test, expect } = require('@playwright/test');

test.describe('Task 14: Display 1 card per row when width < 600px', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('file://' + __dirname + '/../src/index.html');
  });

  test('should display 1 card per row when width < 600px', async ({ page }) => {
    await page.setViewportSize({ width: 500, height: 600 });
    
    const cards = page.locator('.card');
    const firstCard = cards.nth(0);
    const secondCard = cards.nth(1);
    const thirdCard = cards.nth(2);
    
    const firstBox = await firstCard.boundingBox();
    const secondBox = await secondCard.boundingBox();
    const thirdBox = await thirdCard.boundingBox();
    
    expect(secondBox.y).toBeGreaterThan(firstBox.y + firstBox.height - 10);
    expect(thirdBox.y).toBeGreaterThan(secondBox.y + secondBox.height - 10);
  });

  test('should make each card occupy full content width when width < 600px', async ({ page }) => {
    await page.setViewportSize({ width: 500, height: 600 });
    
    const content = page.locator('.content');
    const cards = page.locator('.card');
    const firstCard = cards.nth(0);
    
    const contentBox = await content.boundingBox();
    const cardBox = await firstCard.boundingBox();
    
    expect(cardBox.width).toBeCloseTo(contentBox.width - 40, 20);
  });

  test('should maintain 2 cards per row when width >= 600px and < 1000px', async ({ page }) => {
    await page.setViewportSize({ width: 800, height: 600 });
    
    const cards = page.locator('.card');
    const firstCard = cards.nth(0);
    const secondCard = cards.nth(1);
    
    const firstBox = await firstCard.boundingBox();
    const secondBox = await secondCard.boundingBox();
    
    expect(Math.abs(firstBox.y - secondBox.y)).toBeLessThan(10);
    expect(secondBox.x).toBeGreaterThan(firstBox.x + firstBox.width - 10);
  });

  test('should stack all 12 cards vertically when width < 600px', async ({ page }) => {
    await page.setViewportSize({ width: 400, height: 800 });
    
    const cards = page.locator('.card');
    
    for (let i = 0; i < 11; i++) {
      const currentCard = cards.nth(i);
      const nextCard = cards.nth(i + 1);
      
      const currentBox = await currentCard.boundingBox();
      const nextBox = await nextCard.boundingBox();
      
      expect(nextBox.y).toBeGreaterThan(currentBox.y + currentBox.height - 10);
    }
  });

  test('should maintain card minimum height in single-column layout', async ({ page }) => {
    await page.setViewportSize({ width: 400, height: 600 });
    
    const cards = page.locator('.card');
    
    for (let i = 0; i < 12; i++) {
      const cardBox = await cards.nth(i).boundingBox();
      expect(cardBox.height).toBeGreaterThanOrEqual(100);
    }
  });
});