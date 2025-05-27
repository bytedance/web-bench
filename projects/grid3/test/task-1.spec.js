// test/task-1.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Task 1: Basic Layout Structure', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('file://' + __dirname + '/../src/index.html');
    });

    test('should have header, footer, and content divs in root element', async ({ page }) => {
        const header = page.locator('.root .header');
        const footer = page.locator('.root .footer');
        const content = page.locator('.root .content');
        
        await expect(header).toBeVisible();
        await expect(footer).toBeVisible();
        await expect(content).toBeVisible();
    });

    test('should have root element occupy full viewport', async ({ page }) => {
        const root = page.locator('.root');
        const rootBox = await root.boundingBox();
        const viewportSize = page.viewportSize();
        
        expect(rootBox.width).toBe(viewportSize.width);
        expect(rootBox.height).toBe(viewportSize.height);
    });

    test('should have header fixed at top of root', async ({ page }) => {
        const root = page.locator('.root');
        const header = page.locator('.header');
        
        const rootBox = await root.boundingBox();
        const headerBox = await header.boundingBox();
        
        expect(headerBox.y).toBe(rootBox.y);
        expect(headerBox.width).toBe(rootBox.width);
    });

    test('should have footer fixed at bottom of root', async ({ page }) => {
        const root = page.locator('.root');
        const footer = page.locator('.footer');
        
        const rootBox = await root.boundingBox();
        const footerBox = await footer.boundingBox();
        
        expect(footerBox.y + footerBox.height).toBe(rootBox.y + rootBox.height);
        expect(footerBox.width).toBe(rootBox.width);
    });

    test('should have content occupy remaining space between header and footer', async ({ page }) => {
        const header = page.locator('.header');
        const footer = page.locator('.footer');
        const content = page.locator('.content');
        
        const headerBox = await header.boundingBox();
        const footerBox = await footer.boundingBox();
        const contentBox = await content.boundingBox();
        
        expect(contentBox.y).toBe(headerBox.y + headerBox.height);
        expect(contentBox.y + contentBox.height).toBe(footerBox.y);
    });
});