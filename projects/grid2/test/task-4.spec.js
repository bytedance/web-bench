// test/task-4.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Task 4: Add Logo to Header', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('file://' + __dirname + '/../src/index.html');
    });

    test('should have logo in header', async ({ page }) => {
        const logo = page.locator('.header .logo');
        await expect(logo).toBeVisible();
    });

    test('should position logo at left side of header', async ({ page }) => {
        const header = page.locator('.header');
        const logo = page.locator('.logo');
        
        const headerBox = await header.boundingBox();
        const logoBox = await logo.boundingBox();
        
        expect(logoBox.x).toBeGreaterThanOrEqual(headerBox.x);
        expect(logoBox.x).toBeLessThan(headerBox.x + headerBox.width / 2);
    });

    test('should have logo with background color', async ({ page }) => {
        const logo = page.locator('.logo');
        const backgroundColor = await logo.evaluate(el => 
            window.getComputedStyle(el).backgroundColor
        );
        
        expect(backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
        expect(backgroundColor).not.toBe('transparent');
    });

    test('should maintain both logo and menu in header', async ({ page }) => {
        const logo = page.locator('.header .logo');
        const menu = page.locator('.header .menu');
        
        await expect(logo).toBeVisible();
        await expect(menu).toBeVisible();
    });

    test('should have proper spacing between logo and menu', async ({ page }) => {
        const logo = page.locator('.logo');
        const menu = page.locator('.menu');
        
        const logoBox = await logo.boundingBox();
        const menuBox = await menu.boundingBox();
        
        expect(menuBox.x).toBeGreaterThan(logoBox.x + logoBox.width);
    });
});