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

test.describe('Task 9: Rectangle Shape Class Implementation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html')
  })

  test('Rectangle shape should be created with correct attributes', async ({ page }) => {
    // Set line width and color
    await page.locator('.toolkit .line-width').fill('5')
    await page.locator('.toolkit .color').fill('#00ff00')
    
    // Select the rectangle tool
    await page.locator('.toolkit label.rect').click()
    
    // Draw a rectangle
    const canvas = page.locator('svg.canvas')
    const canvasBounds = await canvas.boundingBox()
    
    if (canvasBounds) {
      await page.mouse.move(canvasBounds.x + 100, canvasBounds.y + 100)
      await page.mouse.down()
      await page.mouse.move(canvasBounds.x + 300, canvasBounds.y + 200)
      await page.mouse.up()
      
      // Check if the rectangle has the correct attributes
      const rect = page.locator('svg.canvas rect')
      
      // Check coordinates and dimensions
      await expect(rect).toHaveAttribute('x', '100')
      await expect(rect).toHaveAttribute('y', '100')
      await expect(rect).toHaveAttribute('width', '200')
      await expect(rect).toHaveAttribute('height', '100')
      
      // Check style attributes
      await expect(rect).toHaveAttribute('stroke', '#00ff00')
      await expect(rect).toHaveAttribute('stroke-width', '5')
      await expect(rect).toHaveAttribute('fill', 'none')
    }
  })

  test('Rectangle shape should handle negative dimensions correctly', async ({ page }) => {
    // Select the rectangle tool
    await page.locator('.toolkit label.rect').click()
    
    // Draw a rectangle with negative width and height (drawing from bottom-right to top-left)
    const canvas = page.locator('svg.canvas')
    const canvasBounds = await canvas.boundingBox()
    
    if (canvasBounds) {
      await page.mouse.move(canvasBounds.x + 300, canvasBounds.y + 200)
      await page.mouse.down()
      await page.mouse.move(canvasBounds.x + 100, canvasBounds.y + 100)
      await page.mouse.up()
      
      // Check if the rectangle has the correct attributes
      const rect = page.locator('svg.canvas rect')
      
      // The rectangle should have positive width and height, with adjusted x and y
      await expect(rect).toHaveAttribute('x', '100')
      await expect(rect).toHaveAttribute('y', '100')
      await expect(rect).toHaveAttribute('width', '200')
      await expect(rect).toHaveAttribute('height', '100')
    }
  })

  test('Rectangle shape should update correctly during creation', async ({ page }) => {
    // Select the rectangle tool
    await page.locator('.toolkit label.rect').click()
    
    // Start drawing a rectangle
    const canvas = page.locator('svg.canvas')
    const canvasBounds = await canvas.boundingBox()
    
    if (canvasBounds) {
      // Start at a point
      await page.mouse.move(canvasBounds.x + 100, canvasBounds.y + 100)
      await page.mouse.down()
      
      // Move to first position
      await page.mouse.move(canvasBounds.x + 200, canvasBounds.y + 150)
      
      // Check intermediate dimensions
      const rectIntermediate = page.locator('svg.canvas rect')
      const widthIntermediate = await rectIntermediate.getAttribute('width')
      const heightIntermediate = await rectIntermediate.getAttribute('height')
      
      expect(widthIntermediate).toBe('100')
      expect(heightIntermediate).toBe('50')
      
      // Move to final position
      await page.mouse.move(canvasBounds.x + 300, canvasBounds.y + 200)
      await page.mouse.up()
      
      // Check final dimensions
      const rectFinal = page.locator('svg.canvas rect')
      await expect(rectFinal).toHaveAttribute('width', '200')
      await expect(rectFinal).toHaveAttribute('height', '100')
    }
  })

  test('Rectangle shape should calculate center point correctly', async ({ page }) => {
    // Create a rectangle
    await page.locator('.toolkit label.rect').click()
    
    const canvas = page.locator('svg.canvas')
    const canvasBounds = await canvas.boundingBox()
    
    if (canvasBounds) {
      // Draw a rectangle
      await page.mouse.move(canvasBounds.x + 100, canvasBounds.y + 100)
      await page.mouse.down()
      await page.mouse.move(canvasBounds.x + 300, canvasBounds.y + 200)
      await page.mouse.up()
      
      // Check if the center is calculated correctly
      const centerIsCorrect = await page.evaluate(() => {
        const rect = document.querySelector('svg.canvas rect')
        const shape = window.Shape.findByElement(rect)
        
        // Center should be at (200, 150) for a rectangle from (100, 100) to (300, 200)
        return shape.center.x === 200 && shape.center.y === 150
      })
      
      expect(centerIsCorrect).toBeTruthy()
    }
  })

  test('Rectangle shape should be transformable', async ({ page }) => {
    // Create a rectangle
    await page.locator('.toolkit label.rect').click()
    
    const canvas = page.locator('svg.canvas')
    const canvasBounds = await canvas.boundingBox()
    
    if (canvasBounds) {
      // Draw a rectangle
      await page.mouse.move(canvasBounds.x + 100, canvasBounds.y + 100)
      await page.mouse.down()
      await page.mouse.move(canvasBounds.x + 300, canvasBounds.y + 200)
      await page.mouse.up()
      
      // Test rotation
      await page.locator('.toolkit label.rotate').click()
      
      // Click on the rectangle to select it
      await page.mouse.click(canvasBounds.x + 200, canvasBounds.y + 150)
      
      // Rotate the rectangle
      await page.mouse.move(canvasBounds.x + 250, canvasBounds.y + 150)
      await page.mouse.down()
      await page.mouse.move(canvasBounds.x + 250, canvasBounds.y + 200)
      await page.mouse.up()
      
      // Check if the rectangle has been rotated
      const transformStyle = await page.locator('svg.canvas rect').getAttribute('style')
      expect(transformStyle).toContain('rotate')
    }
  })

  test('Rectangle shape should be cloneable', async ({ page }) => {
    // Create a rectangle
    await page.locator('.toolkit label.rect').click()
    
    const canvas = page.locator('svg.canvas')
    const canvasBounds = await canvas.boundingBox()
    
    if (canvasBounds) {
      // Draw a rectangle
      await page.mouse.move(canvasBounds.x + 100, canvasBounds.y + 100)
      await page.mouse.down()
      await page.mouse.move(canvasBounds.x + 300, canvasBounds.y + 200)
      await page.mouse.up()
      
      // Select the copy tool
      await page.locator('.toolkit label.copy').click()
      
      // Click on the rectangle to select it
      await page.mouse.click(canvasBounds.x + 200, canvasBounds.y + 150)
      
      // Drag to position the clone
      await page.mouse.move(canvasBounds.x + 200, canvasBounds.y + 150)
      await page.mouse.down()
      await page.mouse.move(canvasBounds.x + 400, canvasBounds.y + 300)
      await page.mouse.up()
      
      // Check if there are now two rectangles
      const rectCount = await page.locator('svg.canvas rect').count()
      expect(rectCount).toBe(2)
      
      // Check if the clone has the same attributes as the original
      const rects = await page.locator('svg.canvas rect').all()
      
      // Get attributes of both rectangles
      const originalAttrs = await rects[0].evaluate(el => ({
        width: el.getAttribute('width'),
        height: el.getAttribute('height'),
        stroke: el.getAttribute('stroke'),
        strokeWidth: el.getAttribute('stroke-width')
      }))
      
      const cloneAttrs = await rects[1].evaluate(el => ({
        width: el.getAttribute('width'),
        height: el.getAttribute('height'),
        stroke: el.getAttribute('stroke'),
        strokeWidth: el.getAttribute('stroke-width')
      }))
      
      // The clone should have the same dimensions and style
      expect(cloneAttrs.width).toBe(originalAttrs.width)
      expect(cloneAttrs.height).toBe(originalAttrs.height)
      expect(cloneAttrs.stroke).toBe(originalAttrs.stroke)
      expect(cloneAttrs.strokeWidth).toBe(originalAttrs.strokeWidth)
      
      // The clone should be offset by Shape.offset
      const cloneHasOffset = await page.evaluate(() => {
        const rects = document.querySelectorAll('svg.canvas rect')
        
        // Check if the clone's position is offset by Shape.offset
        const offsetX = parseInt(rects[1].getAttribute('x')) - parseInt(rects[0].getAttribute('x'))
        const offsetY = parseInt(rects[1].getAttribute('y')) - parseInt(rects[0].getAttribute('y'))
        
        return offsetX === window.Shape.offset && offsetY === window.Shape.offset
      })
      
      expect(cloneHasOffset).toBeTruthy()
    }
  })
})