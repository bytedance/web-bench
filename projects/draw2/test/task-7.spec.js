// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const { test, expect } = require('@playwright/test')

test.describe('Task 7: Shape Base Class Implementation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html')
  })

  test('Shape class should track all created shapes', async ({ page }) => {
    // Create multiple shapes
    await createLine(page, 50, 50, 150, 50)
    await createRect(page, 200, 50, 300, 150)
    await createEllipse(page, 100, 200, 150, 250)
    
    // Check if all shapes are tracked in the Shape.shapes array
    const shapesCount = await page.evaluate(() => {
      // Access the Shape class from the window object
      return window.Shape.shapes.length
    })
    
    expect(shapesCount).toBe(3)
  })

  test('Shape.findByElement should correctly identify shapes', async ({ page }) => {
    // Create a shape
    await createLine(page, 50, 50, 150, 50)
    
    // Test if findByElement works correctly
    const findByElementWorks = await page.evaluate(() => {
      const lineElement = document.querySelector('svg.canvas line')
      const foundShape = window.Shape.findByElement(lineElement)
      return foundShape !== null && foundShape.element === lineElement
    })
    
    expect(findByElementWorks).toBeTruthy()
  })

  test('Shape.onMove should correctly translate shapes', async ({ page }) => {
    // Create a shape
    await createRect(page, 100, 100, 200, 200)
    
    // Select the move tool
    await page.locator('.toolkit label.move').click()
    
    // Get initial transform
    const initialTransform = await page.locator('svg.canvas rect').getAttribute('style')
    
    // Move the shape
    const canvas = page.locator('svg.canvas')
    const canvasBounds = await canvas.boundingBox()
    
    if (canvasBounds) {
      // Click on the rectangle to select it
      await page.mouse.click(canvasBounds.x + 150, canvasBounds.y + 150)
      
      // Drag to move
      await page.mouse.move(canvasBounds.x + 150, canvasBounds.y + 150)
      await page.mouse.down()
      await page.mouse.move(canvasBounds.x + 250, canvasBounds.y + 250)
      await page.mouse.up()
      
      // Get the new transform
      const newTransform = await page.locator('svg.canvas rect').getAttribute('style')
      
      // Verify the transform has changed and includes a translate component
      expect(newTransform).not.toBe(initialTransform)
      expect(newTransform).toContain('translate')
    }
  })

  test('Shape.onRotate should correctly rotate shapes', async ({ page }) => {
    // Create a shape
    await createEllipse(page, 200, 200, 300, 250)
    
    // Select the rotate tool
    await page.locator('.toolkit label.rotate').click()
    
    // Get initial transform
    const initialTransform = await page.locator('svg.canvas ellipse').getAttribute('style')
    
    // Rotate the shape
    const canvas = page.locator('svg.canvas')
    const canvasBounds = await canvas.boundingBox()
    
    if (canvasBounds) {
      // Click on the ellipse to select it
      await page.mouse.click(canvasBounds.x + 250, canvasBounds.y + 225)
      
      // Drag to rotate
      await page.mouse.move(canvasBounds.x + 300, canvasBounds.y + 225)
      await page.mouse.down()
      await page.mouse.move(canvasBounds.x + 300, canvasBounds.y + 300)
      await page.mouse.up()
      
      // Get the new transform
      const newTransform = await page.locator('svg.canvas ellipse').getAttribute('style')
      
      // Verify the transform has changed and includes a rotate component
      expect(newTransform).not.toBe(initialTransform)
      expect(newTransform).toContain('rotate')
    }
  })

  test('Shape.onZoom should correctly scale shapes', async ({ page }) => {
    // Create a shape
    await createLine(page, 100, 100, 300, 100)
    
    // Select the zoom tool
    await page.locator('.toolkit label.zoom').click()
    
    // Get initial transform
    const initialTransform = await page.locator('svg.canvas line').getAttribute('style')
    
    // Zoom the shape
    const canvas = page.locator('svg.canvas')
    const canvasBounds = await canvas.boundingBox()
    
    if (canvasBounds) {
      // Click on the line to select it
      await page.mouse.click(canvasBounds.x + 200, canvasBounds.y + 100)
      
      // Drag to zoom
      await page.mouse.move(canvasBounds.x + 200, canvasBounds.y + 100)
      await page.mouse.down()
      await page.mouse.move(canvasBounds.x + 250, canvasBounds.y + 150)
      await page.mouse.up()
      
      // Get the new transform
      const newTransform = await page.locator('svg.canvas line').getAttribute('style')
      
      // Verify the transform has changed and includes a scale component
      expect(newTransform).not.toBe(initialTransform)
      expect(newTransform).toContain('scale')
    }
  })

  test('Shape.clone should create a copy of the shape', async ({ page }) => {
    // Create a shape
    await createRect(page, 100, 100, 200, 200)
    
    // Select the copy tool
    await page.locator('.toolkit label.copy').click()
    
    // Clone the shape
    const canvas = page.locator('svg.canvas')
    const canvasBounds = await canvas.boundingBox()
    
    if (canvasBounds) {
      // Click on the rectangle to select it
      await page.mouse.click(canvasBounds.x + 150, canvasBounds.y + 150)
      
      // Drag to position the clone
      await page.mouse.move(canvasBounds.x + 150, canvasBounds.y + 150)
      await page.mouse.down()
      await page.mouse.move(canvasBounds.x + 300, canvasBounds.y + 300)
      await page.mouse.up()
      
      // Check if there are now two rectangles
      const rectCount = await page.locator('svg.canvas rect').count()
      expect(rectCount).toBe(2)
    }
  })

  test('Shape.remove should delete a shape', async ({ page }) => {
    // Create a shape
    await createEllipse(page, 200, 200, 300, 250)
    
    // Verify the shape exists
    const initialEllipseCount = await page.locator('svg.canvas ellipse').count()
    expect(initialEllipseCount).toBe(1)
    
    // Select the delete tool
    await page.locator('.toolkit label.delete').click()
    
    // Delete the shape
    const canvas = page.locator('svg.canvas')
    const canvasBounds = await canvas.boundingBox()
    
    if (canvasBounds) {
      // Click on the ellipse to delete it
      await page.mouse.click(canvasBounds.x + 250, canvasBounds.y + 225)
      
      // Check if the ellipse is removed
      const finalEllipseCount = await page.locator('svg.canvas ellipse').count()
      expect(finalEllipseCount).toBe(0)
    }
  })
})

// Helper functions to create shapes
async function createLine(page, x1, y1, x2, y2) {
  // Select the line tool
  await page.locator('.toolkit label.line').click()
  
  // Draw a line
  const canvas = page.locator('svg.canvas')
  const canvasBounds = await canvas.boundingBox()
  
  if (canvasBounds) {
    await page.mouse.move(canvasBounds.x + x1, canvasBounds.y + y1)
    await page.mouse.down()
    await page.mouse.move(canvasBounds.x + x2, canvasBounds.y + y2)
    await page.mouse.up()
  }
}

async function createRect(page, x1, y1, x2, y2) {
  // Select the rect tool
  await page.locator('.toolkit label.rect').click()
  
  // Draw a rectangle
  const canvas = page.locator('svg.canvas')
  const canvasBounds = await canvas.boundingBox()
  
  if (canvasBounds) {
    await page.mouse.move(canvasBounds.x + x1, canvasBounds.y + y1)
    await page.mouse.down()
    await page.mouse.move(canvasBounds.x + x2, canvasBounds.y + y2)
    await page.mouse.up()
  }
}

async function createEllipse(page, x1, y1, x2, y2) {
  // Select the ellipse tool
  await page.locator('.toolkit label.ellipse').click()
  
  // Draw an ellipse
  const canvas = page.locator('svg.canvas')
  const canvasBounds = await canvas.boundingBox()
  
  if (canvasBounds) {
    await page.mouse.move(canvasBounds.x + x1, canvasBounds.y + y1)
    await page.mouse.down()
    await page.mouse.move(canvasBounds.x + x2, canvasBounds.y + y2)
    await page.mouse.up()
  }
}