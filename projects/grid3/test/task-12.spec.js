const { test, expect } = require('@playwright/test');

test.describe('Task 12: Display 12 cards in content with 3 per row', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('file://' + __dirname + '/../src/index.html');
    await page.setViewportSize({ width: 1200, height: 800 });
  });

  test('should display 12 cards in content area', async ({ page }) => {
    const cards = page.locator('.card');
    await expect(cards).toHaveCount(12);
  });

  test('should arrange cards in 3 columns layout', async ({ page }) => {
    const cards = page.locator('.card');
    const firstRowCards = [cards.nth(0), cards.nth(1), cards.nth(2)];
    
    const cardBoxes = await Promise.all(firstRowCards.map(card => card.boundingBox()));
    
    expect(Math.abs(cardBoxes[0].y - cardBoxes[1].y)).toBeLessThan(10);
    expect(Math.abs(cardBoxes[1].y - cardBoxes[2].y)).toBeLessThan(10);
    expect(cardBoxes[1].x).toBeGreaterThan(cardBoxes[0].x + cardBoxes[0].width - 10);
    expect(cardBoxes[2].x).toBeGreaterThan(cardBoxes[1].x + cardBoxes[1].width - 10);
  });

  test('should have each card with minimum height of 100px', async ({ page }) => {
    const cards = page.locator('.card');
    
    for (let i = 0; i < 12; i++) {
      const cardBox = await cards.nth(i).boundingBox();
      expect(cardBox.height).toBeGreaterThanOrEqual(100);
    }
  });

  test('should enable vertical scrolling in content area', async ({ page }) => {
    const content = page.locator('.content');
    const overflowY = await content.evaluate(el => getComputedStyle(el).overflowY);
    expect(overflowY).toBe('auto');
  });

  test('should arrange cards in 4 rows with 3 cards each', async ({ page }) => {
    const cards = page.locator('.card');
    const firstRowFirstCard = cards.nth(0);
    const secondRowFirstCard = cards.nth(3);
    const thirdRowFirstCard = cards.nth(6);
    
    const firstRowBox = await firstRowFirstCard.boundingBox();
    const secondRowBox = await secondRowFirstCard.boundingBox();
    const thirdRowBox = await thirdRowFirstCard.boundingBox();
    
    expect(secondRowBox.y).toBeGreaterThan(firstRowBox.y + firstRowBox.height - 10);
    expect(thirdRowBox.y).toBeGreaterThan(secondRowBox.y + secondRowBox.height - 10);
  });
});