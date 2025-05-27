// test/task-14.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Task 14: Responsive Cards - 1 per row', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('file://' + __dirname + '/../src/index.html');
    });

    test('should display 1 card per row when width is less than 600px', async ({ page }) => {
        await page.setViewportSize({ width: 500, height: 800 });
        const cards = page.locator('.card');
        
        const firstCard = await cards.first().boundingBox();
        const secondCard = await cards.nth(1).boundingBox();
        
        // Second card should be below first card
        expect(secondCard.y).toBeGreaterThan(firstCard.y + firstCard.height - 10);
        
        // Cards should be roughly aligned vertically
        expect(Math.abs(secondCard.x - firstCard.x)).toBeLessThan(20);
    });

    test('should maintain 2 cards per row at 600px', async ({ page }) => {
        await page.setViewportSize({ width: 600, height: 800 });
        const cards = page.locator('.card');
        
        const firstCard = await cards.first().boundingBox();
        const secondCard = await cards.nth(1).boundingBox();
        
        // First 2 cards should be in same row at exactly 600px
        expect(Math.abs(firstCard.y - secondCard.y)).toBeLessThan(10);
    });

    test('should have cards use full available width at mobile', async ({ page }) => {
        await page.setViewportSize({ width: 400, height: 800 });
        const cards = page.locator('.card');
        const content = page.locator('.content');
        
        const contentBox = await content.boundingBox();
        const cardBox = await cards.first().boundingBox();
        
        // Card should use most of the content width (accounting for padding)
        expect(cardBox.width).toBeGreaterThan(contentBox.width * 0.8);
    });

    test('should stack all cards vertically at mobile', async ({ page }) => {
        await page.setViewportSize({ width: 400, height: 800 });
        const cards = page.locator('.card');
        
        // Check first 4 cards for vertical stacking
        for (let i = 0; i < Math.min(4, await cards.count() - 1); i++) {
            const currentCard = await cards.nth(i).boundingBox();
            const nextCard = await cards.nth(i + 1).boundingBox();
            
            expect(nextCard.y).toBeGreaterThan(currentCard.y + currentCard.height - 10);
        }
    });

    test('should maintain minimum height at mobile', async ({ page }) => {
        await page.setViewportSize({ width: 400, height: 800 });
        const cards = page.locator('.card');
        
        for (let i = 0; i < Math.min(3, await cards.count()); i++) {
            const cardBox = await cards.nth(i).boundingBox();
            expect(cardBox.height).toBeGreaterThanOrEqual(100);
        }
    });
});