// test/task-2.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Task 2: Add Leftbar and Rightbar', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('file://' + __dirname + '/../src/index.html');
    });

    test('should have leftbar and rightbar visible', async ({ page }) => {
        const leftbar = page.locator('.leftbar');
        const rightbar = page.locator('.rightbar');
        
        await expect(leftbar).toBeVisible();
        await expect(rightbar).toBeVisible();
    });

    test('should have leftbar fixed at left side of root', async ({ page }) => {
        const root = page.locator('.root');
        const leftbar = page.locator('.leftbar');
        
        const rootBox = await root.boundingBox();
        const leftbarBox = await leftbar.boundingBox();
        
        expect(leftbarBox.x).toBe(rootBox.x);
    });

    test('should have rightbar fixed at right side of root', async ({ page }) => {
        const root = page.locator('.root');
        const rightbar = page.locator('.rightbar');
        
        const rootBox = await root.boundingBox();
        const rightbarBox = await rightbar.boundingBox();
        
        expect(rightbarBox.x + rightbarBox.width).toBe(rootBox.x + rootBox.width);
    });

    test('should have content occupy remaining space between leftbar and rightbar', async ({ page }) => {
        const leftbar = page.locator('.leftbar');
        const rightbar = page.locator('.rightbar');
        const content = page.locator('.content');
        
        const leftbarBox = await leftbar.boundingBox();
        const rightbarBox = await rightbar.boundingBox();
        const contentBox = await content.boundingBox();
        
        expect(contentBox.x).toBe(leftbarBox.x + leftbarBox.width);
        expect(contentBox.x + contentBox.width).toBe(rightbarBox.x);
    });

    test('should maintain header and footer spanning full width', async ({ page }) => {
        const root = page.locator('.root');
        const header = page.locator('.header');
        const footer = page.locator('.footer');
        
        const rootBox = await root.boundingBox();
        const headerBox = await header.boundingBox();
        const footerBox = await footer.boundingBox();
        
        expect(headerBox.width).toBe(rootBox.width);
        expect(footerBox.width).toBe(rootBox.width);
    });
});