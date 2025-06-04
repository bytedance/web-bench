const { test, expect } = require('@playwright/test');
require('../../../libraries/test-util/src/coverage');
test.describe('Task 11: Base Shape Class', () => {
  test('should have Shape class with transform operations', async ({ page }) => {
    await page.goto('/index.html');
    
    const result = await page.evaluate(() => {
      return new Promise((resolve) => {
        import('./common/shape/Shape.js').then(({ Shape }) => {
          const shapePrototype = Shape.prototype;
          resolve({
            hasOnMoveMethod: typeof shapePrototype.onMove === 'function',
            hasOnRotateMethod: typeof shapePrototype.onRotate === 'function',
            hasOnZoomMethod: typeof shapePrototype.onZoom === 'function',
            hasCloneMethod: typeof shapePrototype.clone === 'function',
            hasRemoveMethod: typeof shapePrototype.remove === 'function'
          });
        });
      });
    });
    
    expect(result.hasOnMoveMethod).toBe(true);
    expect(result.hasOnRotateMethod).toBe(true);
    expect(result.hasOnZoomMethod).toBe(true);
    expect(result.hasCloneMethod).toBe(true);
    expect(result.hasRemoveMethod).toBe(true);
  });

  test('should have static methods for shape management', async ({ page }) => {
    await page.goto('/index.html');
    
    const result = await page.evaluate(() => {
      return new Promise((resolve) => {
        import('./common/shape/Shape.js').then(({ Shape }) => {
          resolve({
            hasCreateMethod: typeof Shape.create === 'function',
            hasFindByElementMethod: typeof Shape.findByElement === 'function',
            hasRegisteredShapes: Array.isArray(Shape.registeredShapes),
            registeredShapesCount: Shape.registeredShapes.length,
            hasShapesArray: Array.isArray(Shape.shapes)
          });
        });
      });
    });
    
    expect(result.hasCreateMethod).toBe(true);
    expect(result.hasFindByElementMethod).toBe(true);
    expect(result.hasRegisteredShapes).toBe(true);
    expect(result.registeredShapesCount).toBe(3); // line, rect, ellipse
    expect(result.hasShapesArray).toBe(true);
  });

  test('should support dynamic shape creation through Shape.create', async ({ page }) => {
    await page.goto('/index.html');
    
    const result = await page.evaluate(() => {
      return new Promise(async (resolve) => {
        const { Shape } = await import('./common/shape/Shape.js');
        
        try {
          const shape = await Shape.create('line', {
            color: '#ff0000',
            lineWidth: 5,
            origin: { x: 10, y: 10 }
          });
          
          resolve({
            shapeCreated: !!shape,
            hasElement: !!shape.element,
            elementTagName: shape.element.tagName.toLowerCase()
          });
        } catch (error) {
          resolve({ error: error.message });
        }
      });
    });
    
    expect(result.shapeCreated).toBe(true);
    expect(result.hasElement).toBe(true);
    expect(result.elementTagName).toBe('line');
  });
});
