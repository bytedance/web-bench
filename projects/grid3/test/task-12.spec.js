// test/task-12.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Task 12: Content Cards Layout', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('file://' + __dirname + '/../src/index.html');
        await page.setViewportSize({ width: 1200, height: 800 });
    });

    test('should display 12 cards in content area', async ({ page }) => {
        const cards = page.locator('.content .card');
        await expect(cards).toHaveCount(12);
    });

    test('should arrange cards in 3 per row at desktop size', async ({ page }) => {
        const cards = page.locator('.card');
        
        const firstCard = await cards.first().boundingBox();
        const secondCard = await cards.nth(1).boundingBox();
        const thirdCard = await cards.nth(2).boundingBox();
        const fourthCard = await cards.nth(3).boundingBox();
        
        // First 3 cards should be in same row
        expect(Math.abs(firstCard.y - secondCard.y)).toBeLessThan(10);
        expect(Math.abs(secondCard.y - thirdCard.y)).toBeLessThan(10);
        
        // Fourth card should be in next row
        expect(fourthCard.y).toBeGreaterThan(firstCard.y + firstCard.height - 10);
    });

    test('should have each card with minimum 100px height', async ({ page }) => {
        const cards = page.locator('.card');
        
        for (let i = 0; i < await cards.count(); i++) {
            const cardBox = await cards.nth(i).boundingBox();
            expect(cardBox.height).toBeGreaterThanOrEqual(100);
        }
    });

    test('should enable vertical scrolling in content area', async ({ page }) => {
        const content = page.locator('.content');
        
        const overflowY = await content.evaluate(el => 
            window.getComputedStyle(el).overflowY
        );
        
        expect(overflowY).toBe('auto');
    });

    test('should have all cards visible and properly spaced', async ({ page }) => {
        const cards = page.locator('.card');
        
        for (let i = 0; i < await cards.count(); i++) {
            await expect(cards.nth(i)).toBeVisible();
        }
        
        // Check spacing between cards
        const firstCard = await cards.first().boundingBox();
        const secondCard = await cards.nth(1).boundingBox();
        
        expect(secondCard.x).toBeGreaterThan(firstCard.x + firstCard.width);
    });
});