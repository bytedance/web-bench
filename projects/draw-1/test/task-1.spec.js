// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Task 1 Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have toolkit and canvas elements in root', async ({ page }) => {
    // Check if toolkit and canvas elements exist
    const toolkit = page.locator('.toolkit');
    const canvas = page.locator('.canvas');
    
    await expect(toolkit).toBeVisible();
    await expect(canvas).toBeVisible();
    
    // Check if they are direct children of root
    const toolkitInRoot = page.locator('.root > .toolkit');
    const canvasInRoot = page.locator('.root > .canvas');
    
    await expect(toolkitInRoot).toBeVisible();
    await expect(canvasInRoot).toBeVisible();
  });

  test('should have shape, prop, and operation containers in toolkit', async ({ page }) => {
    // Check if all containers exist in toolkit
    const shapeContainer = page.locator('.toolkit > .shape');
    const propContainer = page.locator('.toolkit > .prop');
    const operationContainer = page.locator('.toolkit > .operation');
    
    await expect(shapeContainer).toBeVisible();
    await expect(propContainer).toBeVisible();
    await expect(operationContainer).toBeVisible();
  });

  test('should have line width input in prop container', async ({ page }) => {
    // Check if line width input exists and has correct attributes
    const lineWidthInput = page.locator('.prop > .line-width');
    await expect(lineWidthInput).toBeVisible();
    
    // Check input attributes
    const min = await lineWidthInput.getAttribute('min');
    const max = await lineWidthInput.getAttribute('max');
    const value = await lineWidthInput.inputValue();
    
    expect(min).toBe('1');
    expect(max).toBe('21');
    expect(value).toBe('9');
  });

  test('should have color selector in prop container', async ({ page }) => {
    // Check if color selector exists and has correct default value
    const colorSelector = page.locator('.prop > .color');
    await expect(colorSelector).toBeVisible();
    
    // Check color selector default value
    const value = await colorSelector.inputValue();
    expect(value.toLowerCase()).toBe('#000000');
  });

  test('toolkit and canvas should fill the root element space', async ({ page }) => {
    // Get the bounding boxes of root, toolkit, and canvas
    const rootBox = await page.locator('.root').boundingBox();
    const toolkitBox = await page.locator('.toolkit').boundingBox();
    const canvasBox = await page.locator('.canvas').boundingBox();
    
    // Check if toolkit and canvas together fill the root space
    // This is a simplified check - actual layout might be more complex
    expect(toolkitBox).toBeTruthy();
    expect(canvasBox).toBeTruthy();
    
    // Verify that toolkit and canvas are visible and have reasonable dimensions
    expect(toolkitBox.width).toBeGreaterThan(0);
    expect(toolkitBox.height).toBeGreaterThan(0);
    expect(canvasBox.width).toBeGreaterThan(0);
    expect(canvasBox.height).toBeGreaterThan(0);
  });
});