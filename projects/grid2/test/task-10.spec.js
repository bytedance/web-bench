// test/task-10.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Task 10: Rightbar Grid Layout', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('file://' + __dirname + '/../src/index.html');
        await page.setViewportSize({ width: 1200, height: 800 });
    });

    test('should have 40 items in rightbar', async ({ page }) => {
        const rightbarItems = page.locator('.rightbar .rightbar-item');
        await expect(rightbarItems).toHaveCount(40);
    });

    test('should have all rightbar items contain the specified text', async ({ page }) => {
        const rightbarItems = page.locator('.rightbar-item');
        const expectedText = 'this-is-a-very-long-text-sample-to-test-overflow';
        
        for (let i = 0; i < await rightbarItems.count(); i++) {
            await expect(rightbarItems.nth(i)).toHaveText(expectedText);
        }
    });

    test('should arrange rightbar items in 2 columns', async ({ page }) => {
        const rightbarItems = page.locator('.rightbar-item');
        
        const firstItem = await rightbarItems.first().boundingBox();
        const secondItem = await rightbarItems.nth(1).boundingBox();
        
        expect(secondItem.x).toBeGreaterThan(firstItem.x);
        expect(Math.abs(secondItem.y - firstItem.y)).toBeLessThan(10);
    });

    test('should have items in 10 rows grid', async ({ page }) => {
        const rightbarItems = page.locator('.rightbar-item');
        
        // Check items are arranged in rows
        const firstRowFirstItem = await rightbarItems.first().boundingBox();
        const secondRowFirstItem = await rightbarItems.nth(2).boundingBox();
        
        expect(secondRowFirstItem.y).toBeGreaterThan(firstRowFirstItem.y);
        expect(Math.abs(secondRowFirstItem.x - firstRowFirstItem.x)).toBeLessThan(10);
    });

    test('should handle text overflow properly', async ({ page }) => {
        const rightbarItems = page.locator('.rightbar-item');
        const rightbar = page.locator('.rightbar');
        
        const rightbarBox = await rightbar.boundingBox();
        const itemBox = await rightbarItems.first().boundingBox();
        
        // Item should not exceed rightbar boundaries
        expect(itemBox.x + itemBox.width).toBeLessThanOrEqual(rightbarBox.x + rightbarBox.width + 1);
    });
});