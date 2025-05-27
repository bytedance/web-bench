// test/task-19.spec.js
const { test, expect } = require('@playwright/test');

test('Task 19: Drag functionality to adjust content width', async ({ page }) => {
  await page.goto('file://' + __dirname + '/../src/index.html');
  
  const content = page.locator('.content');
  const rightDrag = page.locator('.right-drag');
  
  const initialBoundingBox = await content.boundingBox();
  const initialWidth = initialBoundingBox.width;
  
  await page.hover('.content');
  await rightDrag.dragTo(rightDrag, { targetPosition: { x: 50, y: 0 } });
  
  const finalBoundingBox = await content.boundingBox();
  const finalWidth = finalBoundingBox.width;
  
  expect(finalWidth).toBeGreaterThan(initialWidth);
});