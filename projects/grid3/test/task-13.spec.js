const { test, expect } = require('@playwright/test');

test.describe('Task 13: Display 2 cards per row when width < 1000px', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('file://' + __dirname + '/../src/index.html');
  });

  test('should display 2 cards per row when width < 1000px', async ({ page }) => {
    await page.setViewportSize({ width: 900, height: 600 });
    
    const cards = page.locator('.card');
    const firstRowCards = [cards.nth(0), cards.nth(1)];
    const secondRowCards = [cards.nth(2), cards.nth(3)];
    
    const firstRowBoxes = await Promise.all(firstRowCards.map(card => card.boundingBox()));
    const secondRowBoxes = await Promise.all(secondRowCards.map(card => card.boundingBox()));
    
    expect(Math.abs(firstRowBoxes[0].y - firstRowBoxes[1].y)).toBeLessThan(10);
    expect(secondRowBoxes[0].y).toBeGreaterThan(firstRowBoxes[0].y + firstRowBoxes[0].height - 10);
  });

  test('should maintain 3 cards per row when width >= 1000px', async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 600 });
    
    const cards = page.locator('.card');
    const firstRowCards = [cards.nth(0), cards.nth(1), cards.nth(2)];
    
    const cardBoxes = await Promise.all(firstRowCards.map(card => card.boundingBox()));
    
    expect(Math.abs(cardBoxes[0].y - cardBoxes[1].y)).toBeLessThan(10);
    expect(Math.abs(cardBoxes[1].y - cardBoxes[2].y)).toBeLessThan(10);
  });

  test('should transition from 3 to 2 cards per row when resizing', async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 600 });
    
    const cards = page.locator('.card');
    const thirdCard = cards.nth(2);
    const fourthCard = cards.nth(3);
    
    let thirdCardBox = await thirdCard.boundingBox();
    let fourthCardBox = await fourthCard.boundingBox();
    
    expect(Math.abs(thirdCardBox.y - fourthCardBox.y)).toBeGreaterThan(50);
    
    await page.setViewportSize({ width: 900, height: 600 });
    
    thirdCardBox = await thirdCard.boundingBox();
    fourthCardBox = await fourthCard.boundingBox();
    
    expect(Math.abs(thirdCardBox.y - fourthCardBox.y)).toBeLessThan(10);
  });

  test('should arrange 12 cards in 6 rows when 2 per row', async ({ page }) => {
    await page.setViewportSize({ width: 800, height: 600 });
    
    const cards = page.locator('.card');
    const lastRowCards = [cards.nth(10), cards.nth(11)];
    
    const lastRowBoxes = await Promise.all(lastRowCards.map(card => card.boundingBox()));
    
    expect(Math.abs(lastRowBoxes[0].y - lastRowBoxes[1].y)).toBeLessThan(10);
    expect(lastRowBoxes[1].x).toBeGreaterThan(lastRowBoxes[0].x + lastRowBoxes[0].width - 10);
  });

  test('should maintain card minimum height in 2-column layout', async ({ page }) => {
    await page.setViewportSize({ width: 800, height: 600 });
    
    const cards = page.locator('.card');
    
    for (let i = 0; i < 12; i++) {
      const cardBox = await cards.nth(i).boundingBox();
      expect(cardBox.height).toBeGreaterThanOrEqual(100);
    }
  });
});