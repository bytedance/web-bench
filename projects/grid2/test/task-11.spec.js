// test/task-11.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Task 11: Mobile Rightbar Rows', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('file://' + __dirname + '/../src/index.html');
    });

    test('should display only first 6 items (3 rows × 2 columns) at mobile size', async ({ page }) => {
        await page.setViewportSize({ width: 350, height: 800 });
        const rightbarItems = page.locator('.rightbar-item');
        
        // First 6 items should be visible
        for (let i = 0; i < 6; i++) {
            await expect(rightbarItems.nth(i)).toBeVisible();
        }
        
        // 7th item and beyond should be hidden
        for (let i = 6; i < 10; i++) {
            await expect(rightbarItems.nth(i)).not.toBeVisible();
        }
    });

    test('should maintain 2 columns in mobile rightbar', async ({ page }) => {
        await page.setViewportSize({ width: 350, height: 800 });
        const rightbarItems = page.locator('.rightbar-item');
        
        const firstItem = await rightbarItems.first().boundingBox();
        const secondItem = await rightbarItems.nth(1).boundingBox();
        
        expect(secondItem.x).toBeGreaterThan(firstItem.x);
        expect(Math.abs(secondItem.y - firstItem.y)).toBeLessThan(10);
    });

    test('should show all items at larger screen sizes', async ({ page }) => {
        await page.setViewportSize({ width: 800, height: 600 });
        const rightbarItems = page.locator('.rightbar-item');
        
        // All 40 items should be visible at larger sizes
        await expect(rightbarItems).toHaveCount(40);
        for (let i = 0; i < await rightbarItems.count(); i++) {
            await expect(rightbarItems.nth(i)).toBeVisible();
        }
    });

    test('should arrange visible items in 3 rows at mobile', async ({ page }) => {
        await page.setViewportSize({ width: 350, height: 800 });
        const rightbarItems = page.locator('.rightbar-item');
        
        // Check row arrangement for first 6 visible items
        const firstRowItems = [rightbarItems.nth(0), rightbarItems.nth(1)];
        const secondRowItems = [rightbarItems.nth(2), rightbarItems.nth(3)];
        const thirdRowItems = [rightbarItems.nth(4), rightbarItems.nth(5)];
        
        const firstRowY = (await firstRowItems[0].boundingBox()).y;
        const secondRowY = (await secondRowItems[0].boundingBox()).y;
        const thirdRowY = (await thirdRowItems[0].boundingBox()).y;
        
        expect(secondRowY).toBeGreaterThan(firstRowY);
        expect(thirdRowY).toBeGreaterThan(secondRowY);
    });
});