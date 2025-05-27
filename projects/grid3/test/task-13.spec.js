// test/task-13.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Task 13: Responsive Cards - 2 per row', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('file://' + __dirname + '/../src/index.html');
    });

    test('should display 2 cards per row when width is less than 1000px', async ({ page }) => {
        await page.setViewportSize({ width: 900, height: 800 });
        const cards = page.locator('.card');
        
        const firstCard = await cards.first().boundingBox();
        const secondCard = await cards.nth(1).boundingBox();
        const thirdCard = await cards.nth(2).boundingBox();
        
        // First 2 cards should be in same row
        expect(Math.abs(firstCard.y - secondCard.y)).toBeLessThan(10);
        
        // Third card should be in next row
        expect(thirdCard.y).toBeGreaterThan(firstCard.y + firstCard.height - 10);
    });

    test('should maintain 3 cards per row at 1000px', async ({ page }) => {
        await page.setViewportSize({ width: 1000, height: 800 });
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

    test('should have proper spacing with 2 cards per row', async ({ page }) => {
        await page.setViewportSize({ width: 800, height: 600 });
        const cards = page.locator('.card');
        const content = page.locator('.content');
        
        const contentBox = await content.boundingBox();
        const firstCard = await cards.first().boundingBox();
        const secondCard = await cards.nth(1).boundingBox();
        
        // Cards should use available width effectively
        const totalCardWidth = firstCard.width + secondCard.width;
        expect(totalCardWidth).toBeLessThan(contentBox.width);
        expect(secondCard.x).toBeGreaterThan(firstCard.x + firstCard.width);
    });

    test('should maintain card minimum height at medium screen', async ({ page }) => {
        await page.setViewportSize({ width: 800, height: 600 });
        const cards = page.locator('.card');
        
        for (let i = 0; i < Math.min(4, await cards.count()); i++) {
            const cardBox = await cards.nth(i).boundingBox();
            expect(cardBox.height).toBeGreaterThanOrEqual(100);
        }
    });
});