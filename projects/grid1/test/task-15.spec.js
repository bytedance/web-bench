// test/task-15.spec.js
const { test, expect } = require('@playwright/test');

test('Task 15: Card structure with image, title, and price', async ({ page }) => {
 await page.goto('file://' + __dirname + '/../src/index.html');
 
 const card = page.locator('.card').first();
 await expect(card).toHaveCSS('display', 'grid');
 await expect(card).toHaveCSS('grid-template-rows', '1fr auto auto');
 await expect(card).toHaveCSS('min-height', '100px');
 
 const cardImage = card.locator('.card-image');
 const cardTitle = card.locator('.card-title');
 const cardPrice = card.locator('.card-price');
 
 await expect(cardImage).toBeVisible();
 await expect(cardTitle).toBeVisible();
 await expect(cardPrice).toBeVisible();
 
 await expect(cardTitle).toHaveCSS('min-height', '1.5rem');
 await expect(cardTitle).toHaveCSS('white-space', 'nowrap');
 await expect(cardPrice).toHaveCSS('min-height', '1rem');
});