// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Task 13 - Tooltip Component', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application before each test
    await page.goto('/');
  });

  test('should not show tooltip initially', async ({ page }) => {
    // Check if the tooltip is not visible initially
    const tooltip = page.locator('.tooltip');
    const isVisible = await tooltip.isVisible().catch(() => false);
    expect(isVisible).toBeFalsy();
  });

  test('should show tooltip when hovering over Add Blog button', async ({ page }) => {
    // Hover over the Add Blog button
    await page.locator('header button:has-text("Add Blog")').hover();
    
    // Check if the tooltip becomes visible
    const tooltip = page.locator('.tooltip');
    await expect(tooltip).toBeVisible();
    
    // Check if the tooltip contains the correct text
    await expect(tooltip).toContainText('Write a New Blog For everyone');
  });

  test('should position tooltip at the bottom of the hovered element', async ({ page }) => {
    // Hover over the Add Blog button
    const addButton = page.locator('header button:has-text("Add Blog")');
    await addButton.hover();
    
    // Get the bounding boxes of the button and the tooltip
    const buttonBox = await addButton.boundingBox();
    const tooltipBox = await page.locator('.tooltip').boundingBox();
    
    // Check if the tooltip is positioned at the bottom of the button
    expect(tooltipBox.y).toBeGreaterThanOrEqual(buttonBox.y + buttonBox.height);
    
    // Check if the tooltip is horizontally aligned with the button
    const buttonCenterX = buttonBox.x + buttonBox.width / 2;
    const tooltipCenterX = tooltipBox.x + tooltipBox.width / 2;
    
    // Allow some margin of error for horizontal alignment
    expect(Math.abs(buttonCenterX - tooltipCenterX)).toBeLessThan(50);
  });

  test('should hide tooltip when mouse leaves the element', async ({ page }) => {
    // Hover over the Add Blog button
    await page.locator('header button:has-text("Add Blog")').hover();
    
    // Check if the tooltip becomes visible
    const tooltip = page.locator('.tooltip');
    await expect(tooltip).toBeVisible();
    
    // Move the mouse away from the button
    await page.mouse.move(0, 0);
    
    // Check if the tooltip is hidden
    // Wait a moment for any animations to complete
    await page.waitForTimeout(100);
    
    const isVisible = await tooltip.isVisible().catch(() => false);
    expect(isVisible).toBeFalsy();
  });

  test('should append tooltip to document.body', async ({ page }) => {
    // Hover over the Add Blog button
    await page.locator('header button:has-text("Add Blog")').hover();
    
    // Check if the tooltip is a direct child of the body
    const isDirectChildOfBody = await page.evaluate(() => {
      const tooltip = document.querySelector('.tooltip');
      return tooltip && tooltip.parentElement === document.body;
    });
    
    expect(isDirectChildOfBody).toBeTruthy();
  });
});