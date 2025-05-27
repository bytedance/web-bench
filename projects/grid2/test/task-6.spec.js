// test/task-6.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Task 6: Mobile Menu Layout', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('file://' + __dirname + '/../src/index.html');
    });

    test('should hide logo when page width is 399px or less', async ({ page }) => {
        await page.setViewportSize({ width: 399, height: 800 });
        const logo = page.locator('.logo');
        
        await expect(logo).not.toBeVisible();
    });

    test('should have menu items evenly distributed in header at 399px', async ({ page }) => {
        await page.setViewportSize({ width: 399, height: 800 });
        const header = page.locator('.header');
        const menuItems = page.locator('.menu-item');
        
        const headerBox = await header.boundingBox();
        const firstItemBox = await menuItems.first().boundingBox();
        const lastItemBox = await menuItems.last().boundingBox();
        
        expect(firstItemBox.x).toBeGreaterThanOrEqual(headerBox.x);
        expect(lastItemBox.x + lastItemBox.width).toBeLessThanOrEqual(headerBox.x + headerBox.width);
    });

    test('should maintain logo visibility at 400px', async ({ page }) => {
        await page.setViewportSize({ width: 400, height: 800 });
        const logo = page.locator('.logo');
        
        await expect(logo).toBeVisible();
    });

    test('should have menu items take full width at mobile size', async ({ page }) => {
        await page.setViewportSize({ width: 350, height: 800 });
        const menu = page.locator('.menu');
        const header = page.locator('.header');
        
        const menuBox = await menu.boundingBox();
        const headerBox = await header.boundingBox();
        
        expect(menuBox.width).toBeCloseTo(headerBox.width, 10);
    });

    test('should stack menu items vertically at mobile size', async ({ page }) => {
        await page.setViewportSize({ width: 350, height: 800 });
        const menuItems = page.locator('.menu-item');
        
        const firstItem = await menuItems.first().boundingBox();
        const secondItem = await menuItems.nth(1).boundingBox();
        
        expect(secondItem.y).toBeGreaterThan(firstItem.y);
    });
});