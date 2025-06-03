// Test for Task 2: Build a toolbar interface with three sections
import { test, expect } from '@playwright/test';

test.describe('Task 2: Toolbar Interface', () => {
  test('should have all three toolbar sections with correct tools', async ({ page }) => {
    await page.goto('/index.html');
    
    const toolkit = page.locator('.toolkit');
    await expect(toolkit).toBeVisible();
    
    // Check shape tools section
    const shapeSection = page.locator('.shape');
    await expect(shapeSection).toBeVisible();
    await expect(shapeSection.locator('.line')).toBeVisible();
    await expect(shapeSection.locator('.rect')).toBeVisible();
    await expect(shapeSection.locator('.ellipse')).toBeVisible();
    
    // Check property controls section
    const propSection = page.locator('.prop');
    await expect(propSection).toBeVisible();
    await expect(propSection.locator('.line-width')).toBeVisible();
    await expect(propSection.locator('.color')).toBeVisible();
    
    // Check operation tools section
    const operationSection = page.locator('.operation');
    await expect(operationSection).toBeVisible();
    await expect(operationSection.locator('.move')).toBeVisible();
    await expect(operationSection.locator('.rotate')).toBeVisible();
    await expect(operationSection.locator('.zoom')).toBeVisible();
    await expect(operationSection.locator('.copy')).toBeVisible();
    await expect(operationSection.locator('.delete')).toBeVisible();
    await expect(operationSection.locator('.fill')).toBeVisible();
  });

  test('should have radio inputs with correct name attribute for operation tools', async ({ page }) => {
    await page.goto('/index.html');
    
    // Check that all operation radio inputs have name="operation"
    const operationInputs = page.locator('input[name="operation"]');
    const count = await operationInputs.count();
    expect(count).toBe(9); // 3 shapes + 6 operations
    
    // Verify specific tool values
    await expect(page.locator('input[value="line"]')).toBeAttached();
    await expect(page.locator('input[value="rect"]')).toBeAttached();
    await expect(page.locator('input[value="ellipse"]')).toBeAttached();
    await expect(page.locator('input[value="move"]')).toBeAttached();
    await expect(page.locator('input[value="rotate"]')).toBeAttached();
    await expect(page.locator('input[value="zoom"]')).toBeAttached();
    await expect(page.locator('input[value="copy"]')).toBeAttached();
    await expect(page.locator('input[value="delete"]')).toBeAttached();
    await expect(page.locator('input[value="fill"]')).toBeAttached();
  });

  test('should allow selecting different tools through radio inputs', async ({ page }) => {
    await page.goto('/index.html');
    
    // Select line tool
    await page.locator('.line').click();
    await expect(page.locator('input[value="line"]')).toBeChecked();
    
    // Select move tool
    await page.locator('.move').click();
    await expect(page.locator('input[value="move"]')).toBeChecked();
    await expect(page.locator('input[value="line"]')).not.toBeChecked();
    
    // Select rect tool
    await page.locator('.rect').click();
    await expect(page.locator('input[value="rect"]')).toBeChecked();
    await expect(page.locator('input[value="move"]')).not.toBeChecked();
  });
});
