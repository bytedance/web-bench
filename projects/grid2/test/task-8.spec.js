// test/task-8.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Task 8: Mobile Menu Items Full Width', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('file://' + __dirname + '/../src/index.html');
    });

    test('should have each menu item occupy full page width at mobile size', async ({ page }) => {
        await page.setViewportSize({ width: 350, height: 800 });
        const menuItems = page.locator('.menu-item');
        const root = page.locator('.root');
        
        const rootBox = await root.boundingBox();
        
        for (let i = 0; i < await menuItems.count(); i++) {
            const itemBox = await menuItems.nth(i).boundingBox();
            expect(itemBox.width).toBeCloseTo(rootBox.width, 30);
        }
    });

    test('should stack menu items vertically at mobile size', async ({ page }) => {
        await page.setViewportSize({ width: 350, height: 800 });
        const menuItems = page.locator('.menu-item');
        
        const count = await menuItems.count();
        for (let i = 0; i < count - 1; i++) {
            const currentItem = await menuItems.nth(i).boundingBox();
            const nextItem = await menuItems.nth(i + 1).boundingBox();
            
            expect(nextItem.y).toBeGreaterThan(currentItem.y + currentItem.height - 1);
        }
    });

    test('should maintain horizontal menu at larger sizes', async ({ page }) => {
        await page.setViewportSize({ width: 800, height: 600 });
        const menuItems = page.locator('.menu-item');
        
        const firstItem = await menuItems.first().boundingBox();
        const secondItem = await menuItems.nth(1).boundingBox();
        
        expect(Math.abs(firstItem.y - secondItem.y)).toBeLessThan(5);
    });

    test('should have menu items clickable at mobile size', async ({ page }) => {
        await page.setViewportSize({ width: 350, height: 800 });
        const menuItems = page.locator('.menu-item');
        
        for (let i = 0; i < await menuItems.count(); i++) {
            const item = menuItems.nth(i);
            await expect(item).toBeVisible();
            // Test that items are clickable by checking they respond to hover
            await item.hover();
        }
    });
});