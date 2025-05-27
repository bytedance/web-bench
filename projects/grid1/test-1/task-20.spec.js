// test/task-20.spec.js
const { test, expect } = require('@playwright/test');

test('Task 20: Right-drag moves to bottom and adjusts height on small screens', async ({ page }) => {
  await page.goto('file://' + __dirname + '/../src/index.html');
  
  await page.setViewportSize({ width: 350, height: 600 });
  
  const rightDrag = page.locator('.right-drag');
  await expect(rightDrag).toHaveCSS('cursor', 'ns-resize');
  await expect(rightDrag).toHaveCSS('width', '100%');
  await expect(rightDrag).toHaveCSS('height', '10px');
  
  const content = page.locator('.content');
  const initialBoundingBox = await content.boundingBox();
  const initialHeight = initialBoundingBox.height;
  
  await page.hover('.content');
  await rightDrag.dragTo(rightDrag, { targetPosition: { x: 0, y: 50 } });
  
  const finalBoundingBox = await content.boundingBox();
  const finalHeight = finalBoundingBox.height;
  
  expect(finalHeight).toBeGreaterThan(initialHeight);
});