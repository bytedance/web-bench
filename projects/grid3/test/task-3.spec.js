// test/task-3.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Task 3: Add Menu to Header', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('file://' + __dirname + '/../src/index.html');
    });

    test('should have menu with 3 items in header', async ({ page }) => {
        const menu = page.locator('.header .menu');
        const menuItems = page.locator('.menu .menu-item');
        
        await expect(menu).toBeVisible();
        await expect(menuItems).toHaveCount(3);
    });

    test('should position menu at right side of header', async ({ page }) => {
        const header = page.locator('.header');
        const menu = page.locator('.menu');
        
        const headerBox = await header.boundingBox();
        const menuBox = await menu.boundingBox();
        
        expect(menuBox.x + menuBox.width).toBeLessThanOrEqual(headerBox.x + headerBox.width + 1);
    });

    test('should have all menu items visible and clickable', async ({ page }) => {
        const menuItems = page.locator('.menu-item');
        
        for (let i = 0; i < await menuItems.count(); i++) {
            const item = menuItems.nth(i);
            await expect(item).toBeVisible();
            await expect(item).toHaveText(/.+/);
        }
    });

    test('should have header cleared of other content except menu', async ({ page }) => {
        const headerChildren = page.locator('.header > *');
        const menu = page.locator('.header .menu');
        
        await expect(menu).toBeVisible();
        await expect(headerChildren).toHaveCount(2); // logo and menu
    });
});