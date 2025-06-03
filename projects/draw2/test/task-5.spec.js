const { test, expect } = require('@playwright/test');

test.describe('Task 5: Operation Tools', () => {
  test('should have all operation tools with proper radio buttons', async ({ page }) => {
    await page.goto('/index.html');
    
    const operations = ['move', 'rotate', 'zoom', 'copy', 'delete', 'fill'];
    
    for (const operation of operations) {
      const label = page.locator(`.toolkit .operation .${operation}`);
      const input = page.locator(`.toolkit .operation .${operation} input[type="radio"][value="${operation}"]`);
      
      await expect(label).toBeVisible();
      await expect(input).toBeAttached();
      await expect(input).toHaveAttribute('name', 'operation');
      await expect(label).toHaveAttribute('title', operation.charAt(0).toUpperCase() + operation.slice(1));
    }
  });

  test('should allow selecting operation tools exclusively', async ({ page }) => {
    await page.goto('/index.html');
    
    const moveInput = page.locator('.toolkit .operation .move');
    const rotateInput = page.locator('.toolkit .operation .rotate');
    const zoomInput = page.locator('.toolkit .operation .zoom');
    
    // Test exclusive selection
    await moveInput.click();
    await expect(moveInput).toBeChecked();
    await expect(rotateInput).not.toBeChecked();
    await expect(zoomInput).not.toBeChecked();
    
    await rotateInput.click();
    await expect(moveInput).not.toBeChecked();
    await expect(rotateInput).toBeChecked();
    await expect(zoomInput).not.toBeChecked();
    
    await zoomInput.click();
    await expect(moveInput).not.toBeChecked();
    await expect(rotateInput).not.toBeChecked();
    await expect(zoomInput).toBeChecked();
  });

  test('should have all operation tools in the same radio group as shape tools', async ({ page }) => {
    await page.goto('/index.html');
    
    // All operation and shape tools should have name="operation"
    const allOperationInputs = page.locator('input[type="radio"][name="operation"]');
    const count = await allOperationInputs.count();
    
    // 3 shape tools + 6 operation tools = 9 total
    expect(count).toBe(9);
    
    // Test that selecting an operation deselects shape tools
    const lineInput = page.locator('.toolkit .shape .line');
    const moveInput = page.locator('.toolkit .operation .move');
    
    await lineInput.click();
    await expect(lineInput).toBeChecked();
    
    await moveInput.click();
    await expect(lineInput).not.toBeChecked();
    await expect(moveInput).toBeChecked();
  });
});
