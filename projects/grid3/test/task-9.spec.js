// test/task-9.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Task 9: Leftbar Grid Layout', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('file://' + __dirname + '/../src/index.html');
        await page.setViewportSize({ width: 1200, height: 800 }); // Ensure leftbar is visible
    });

    test('should have 40 items in leftbar (20 rows × 2 columns)', async ({ page }) => {
        const leftbarItems = page.locator('.leftbar .leftbar-item');
        await expect(leftbarItems).toHaveCount(40);
    });

    test('should have all leftbar items contain the specified text', async ({ page }) => {
        const leftbarItems = page.locator('.leftbar-item');
        const expectedText = 'this is a very long text sample to test word wrap';
        
        for (let i = 0; i < await leftbarItems.count(); i++) {
            await expect(leftbarItems.nth(i)).toHaveText(expectedText);
        }
    });

    test('should arrange leftbar items in 2 columns', async ({ page }) => {
        const leftbarItems = page.locator('.leftbar-item');
        
        const firstItem = await leftbarItems.first().boundingBox();
        const secondItem = await leftbarItems.nth(1).boundingBox();
        
        // Second item should be to the right of first item (different column)
        expect(secondItem.x).toBeGreaterThan(firstItem.x);
        expect(Math.abs(secondItem.y - firstItem.y)).toBeLessThan(10); // Same row
    });

    test('should have items wrap text properly', async ({ page }) => {
        const leftbarItems = page.locator('.leftbar-item');
        const leftbar = page.locator('.leftbar');
        
        const leftbarBox = await leftbar.boundingBox();
        const itemBox = await leftbarItems.first().boundingBox();
        
        // Item width should be less than half of leftbar width (accounting for gap)
        expect(itemBox.width).toBeLessThan(leftbarBox.width / 2);
    });

    test('should display items in grid formation', async ({ page }) => {
        const leftbarItems = page.locator('.leftbar-item');
        
        // Check that third item is below first item (next row, first column)
        const firstItem = await leftbarItems.first().boundingBox();
        const thirdItem = await leftbarItems.nth(2).boundingBox();
        
        expect(thirdItem.y).toBeGreaterThan(firstItem.y);
        expect(Math.abs(thirdItem.x - firstItem.x)).toBeLessThan(10); // Same column
    });
});