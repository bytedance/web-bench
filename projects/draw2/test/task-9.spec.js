const { test, expect } = require('@playwright/test');
const coverage = require('../../../libraries/test-util/src/coverage');test.afterEach(coverage);;
test.describe('Task 9: Geometry Utility Classes', () => {
  test('should have Point, Rect, Transform, and Rotate classes available', async ({ page }) => {
    await page.goto('/index.html');
    
    const result = await page.evaluate(() => {
      return new Promise((resolve) => {
        import('./common/util.js').then(({ Point, Rect, Transform, Rotate }) => {
          resolve({
            hasPoint: typeof Point === 'function',
            hasRect: typeof Rect === 'function',
            hasTransform: typeof Transform === 'function',
            hasRotate: typeof Rotate === 'function',
            hasPointIsInRect: typeof Point.isInRect === 'function'
          });
        });
      });
    });
    
    expect(result.hasPoint).toBe(true);
    expect(result.hasRect).toBe(true);
    expect(result.hasTransform).toBe(true);
    expect(result.hasRotate).toBe(true);
    expect(result.hasPointIsInRect).toBe(true);
  });

  test('should have transform parsing functions available', async ({ page }) => {
    await page.goto('/index.html');
    
    const result = await page.evaluate(() => {
      return new Promise((resolve) => {
        import('./common/util.js').then(({ parseTransform, setTransform, getTransform }) => {
          resolve({
            hasParseTransform: typeof parseTransform === 'function',
            hasSetTransform: typeof setTransform === 'function',
            hasGetTransform: typeof getTransform === 'function'
          });
        });
      });
    });
    
    expect(result.hasParseTransform).toBe(true);
    expect(result.hasSetTransform).toBe(true);
    expect(result.hasGetTransform).toBe(true);
  });

  test('should have geometry calculation functions', async ({ page }) => {
    await page.goto('/index.html');
    
    const result = await page.evaluate(() => {
      return new Promise((resolve) => {
        import('./common/util.js').then(({ calculateRotationAngleDeg, calculateScale }) => {
          const origin = { x: 0, y: 0 };
          const p1 = { x: 1, y: 0 };
          const p2 = { x: 0, y: 1 };
          
          const angle = calculateRotationAngleDeg(origin, p1, p2);
          const scale = calculateScale(origin, p1, { x: 2, y: 0 });
          
          resolve({
            hasCalculateRotationAngleDeg: typeof calculateRotationAngleDeg === 'function',
            hasCalculateScale: typeof calculateScale === 'function',
            angleResult: angle,
            scaleResult: scale
          });
        });
      });
    });
    
    expect(result.hasCalculateRotationAngleDeg).toBe(true);
    expect(result.hasCalculateScale).toBe(true);
    expect(result.angleResult).toBeCloseTo(90, 0); // 90 degree rotation
    expect(result.scaleResult).toBeCloseTo(2, 1); // 2x scale
  });
});
