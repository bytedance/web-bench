const { test, expect } = require('@playwright/test');

test('shape container has radio buttons with labels', async ({ page }) => {
  await page.goto('/');
  
  const lineLabel = page.locator('label.line');
  const rectLabel = page.locator('label.rect');
  const ellipseLabel = page.locator('label.ellipse');
  
  // Check labels are visible and clickable
  await expect(lineLabel).toBeVisible();
  await expect(rectLabel).toBeVisible();
  await expect(ellipseLabel).toBeVisible();
  
  // Check radios have same name
  const lineRadio = page.locator('label.line input[type="radio"]');
  const rectRadio = page.locator('label.rect input[type="radio"]');
  const ellipseRadio = page.locator('label.ellipse input[type="radio"]');
  
  expect(await lineRadio.getAttribute('name')).toBe('operation');
  expect(await rectRadio.getAttribute('name')).toBe('operation');
  expect(await ellipseRadio.getAttribute('name')).toBe('operation');
});

test('operation container has radio buttons with background images', async ({ page }) => {
  await page.goto('/');
  
  const operationLabels = ['.move', '.rotate', '.zoom', '.copy', '.delete', '.fill'];
  
  for (const selector of operationLabels) {
    const label = page.locator(`label${selector}`);
    await expect(label).toBeVisible();
    
    // Check radio input has zero dimensions but is not hidden
    const radio = page.locator(`label${selector} input[type="radio"]`);
    const radioBox = await radio.boundingBox();
    expect(radioBox.width).toBe(0);
    expect(radioBox.height).toBe(0);
    
    // Check label has background image
    const backgroundImage = await label.evaluate(el => getComputedStyle(el).backgroundImage);
    expect(backgroundImage).toContain('url');
  }
});