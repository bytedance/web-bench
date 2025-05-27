// test/task-7.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Task 7: Mobile Content Layout', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('file://' + __dirname + '/../src/index.html');
    });

    test('should have content and rightbar occupy full width at mobile size', async ({ page }) => {
        await page.setViewportSize({ width: 350, height: 800 });
        const content = page.locator('.content');
        const rightbar = page.locator('.rightbar');
        const root = page.locator('.root');
        
        const contentBox = await content.boundingBox();
        const rightbarBox = await rightbar.boundingBox();
        const rootBox = await root.boundingBox();
        
        expect(contentBox.width).toBeCloseTo(rootBox.width, 20);
        expect(rightbarBox.width).toBeCloseTo(rootBox.width, 20);
    });

    test('should position rightbar below content at mobile size', async ({ page }) => {
        await page.setViewportSize({ width: 350, height: 800 });
        const content = page.locator('.content');
        const rightbar = page.locator('.rightbar');
        
        const contentBox = await content.boundingBox();
        const rightbarBox = await rightbar.boundingBox();
        
        expect(rightbarBox.y).toBeGreaterThan(contentBox.y);
    });

    test('should maintain normal layout at 400px', async ({ page }) => {
        await page.setViewportSize({ width: 400, height: 800 });
        const leftbar = page.locator('.leftbar');
        const content = page.locator('.content');
        const rightbar = page.locator('.rightbar');
        
        await expect(leftbar).not.toBeVisible(); // Still hidden due to 799px rule
        await expect(content).toBeVisible();
        await expect(rightbar).toBeVisible();
        
        const contentBox = await content.boundingBox();
        const rightbarBox = await rightbar.boundingBox();
        
        expect(contentBox.y).toBe(rightbarBox.y); // Side by side
    });

    test('should stack all elements vertically at mobile size', async ({ page }) => {
        await page.setViewportSize({ width: 350, height: 800 });
        const header = page.locator('.header');
        const content = page.locator('.content');
        const rightbar = page.locator('.rightbar');
        const footer = page.locator('.footer');
        
        const headerBox = await header.boundingBox();
        const contentBox = await content.boundingBox();
        const rightbarBox = await rightbar.boundingBox();
        const footerBox = await footer.boundingBox();
        
        expect(contentBox.y).toBeGreaterThan(headerBox.y + headerBox.height - 1);
        expect(rightbarBox.y).toBeGreaterThan(contentBox.y + contentBox.height - 1);
        expect(footerBox.y).toBeGreaterThan(rightbarBox.y + rightbarBox.height - 1);
    });
});