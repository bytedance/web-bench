// test/task-5.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Task 5: Responsive Sidebar Widths', () => {
   test.beforeEach(async ({ page }) => {
       await page.goto('file://' + __dirname + '/../src/index.html');
   });

   test('should have leftbar width as smaller of 200px and 20vw at 1200px', async ({ page }) => {
       await page.setViewportSize({ width: 1200, height: 800 });
       const leftbar = page.locator('.leftbar');
       const leftbarBox = await leftbar.boundingBox();
       
       // At 1200px, 20vw = 240px, so smaller is 200px
       expect(leftbarBox.width).toBe(200);
   });

   test('should have rightbar width as bigger of 200px and 20vw at 1200px', async ({ page }) => {
       await page.setViewportSize({ width: 1200, height: 800 });
       const rightbar = page.locator('.rightbar');
       const rightbarBox = await rightbar.boundingBox();
       
       // At 1200px, 20vw = 240px, so bigger is 240px
       expect(rightbarBox.width).toBe(240);
   });

   test('should have leftbar width as 20vw when viewport is small', async ({ page }) => {
       await page.setViewportSize({ width: 900, height: 800 });
       const leftbar = page.locator('.leftbar');
       const leftbarBox = await leftbar.boundingBox();
       
       // At 900px, 20vw = 180px, which is smaller than 200px
       expect(leftbarBox.width).toBe(180);
   });

   test('should hide leftbar when page width is 799px or less', async ({ page }) => {
       await page.setViewportSize({ width: 799, height: 800 });
       const leftbar = page.locator('.leftbar');
       
       await expect(leftbar).not.toBeVisible();
   });

   test('should still show rightbar when leftbar is hidden', async ({ page }) => {
       await page.setViewportSize({ width: 799, height: 800 });
       const rightbar = page.locator('.rightbar');
       
       await expect(rightbar).toBeVisible();
   });
});