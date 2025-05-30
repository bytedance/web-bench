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

test.describe('Task 10: Ellipse Shape Class Implementation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html')
  })

  test('Ellipse shape should be created with correct attributes', async ({ page }) => {
    // Set line width and color
    await page.locator('.toolkit .line-width').fill('5')
    await page.locator('.toolkit .color').fill('#0000ff')
    
    // Select the ellipse tool
    await page.locator('.toolkit label.ellipse').click()
    
    // Draw an ellipse
    const canvas = page.locator('svg.canvas')
    const canvasBounds = await canvas.boundingBox()
    
    if (canvasBounds) {
      await page.mouse.move(canvasBounds.x + 100, canvasBounds.y + 100)
      await page.mouse.down()
      await page.mouse.move(canvasBounds.x + 300, canvasBounds.y + 200)
      await page.mouse.up()
      
      // Check if the ellipse has the correct attributes
      const ellipse = page.locator('svg.canvas ellipse')
      
      // Check center coordinates and radii
      await expect(ellipse).toHaveAttribute('cx', '200')
      await expect(ellipse).toHaveAttribute('cy', '150')
      await expect(ellipse).toHaveAttribute('rx', '100')
      await expect(ellipse).toHaveAttribute('ry', '50')
      
      // Check style attributes
      await expect(ellipse).toHaveAttribute('stroke', '#0000ff')
      await expect(ellipse).toHaveAttribute('stroke-width', '5')
      await expect(ellipse).toHaveAttribute('fill', 'none')
    }
  })

  test('Ellipse shape should handle negative dimensions correctly', async ({ page }) => {
    // Select the ellipse tool
    await page.locator('.toolkit label.ellipse').click()
    
    // Draw an ellipse with negative width and height (drawing from bottom-right to top-left)
    const canvas = page.locator('svg.canvas')
    const canvasBounds = await canvas.boundingBox()
    
    if (canvasBounds) {
      await page.mouse.move(canvasBounds.x + 300, canvasBounds.y + 200)
      await page.mouse.down()
      await page.mouse.move(canvasBounds.x + 100, canvasBounds.y + 100)
      await page.mouse.up()
      
      // Check if the ellipse has the correct attributes
      const ellipse = page.locator('svg.canvas ellipse')
      
      // The ellipse should have positive radii, with center at the midpoint
      await expect(ellipse).toHaveAttribute('cx', '200')
      await expect(ellipse).toHaveAttribute('cy', '150')
      await expect(ellipse).toHaveAttribute('rx', '100')
      await expect(ellipse).toHaveAttribute('ry', '50')
    }
  })

  test('Ellipse shape should update correctly during creation', async ({ page }) => {
    // Select the ellipse tool
    await page.locator('.toolkit label.ellipse').click()
    
    // Start drawing an ellipse
    const canvas = page.locator('svg.canvas')
    const canvasBounds = await canvas.boundingBox()
    
    if (canvasBounds) {
      // Start at a point
      await page.mouse.move(canvasBounds.x + 100, canvasBounds.y + 100)
      await page.mouse.down()
      
      // Move to first position
      await page.mouse.move(canvasBounds.x + 200, canvasBounds.y + 150)
      
      // Check intermediate dimensions
      const ellipseIntermediate = page.locator('svg.canvas ellipse')
      const rxIntermediate = await ellipseIntermediate.getAttribute('rx')
      const ryIntermediate = await ellipseIntermediate.getAttribute('ry')
      
      expect(rxIntermediate).toBe('50')
      expect(ryIntermediate).toBe('25')
      
      // Move to final position
      await page.mouse.move(canvasBounds.x + 300, canvasBounds.y + 200)
      await page.mouse.up()
      
      // Check final dimensions
      const ellipseFinal = page.locator('svg.canvas ellipse')
      await expect(ellipseFinal).toHaveAttribute('rx', '100')
      await expect(ellipseFinal).toHaveAttribute('ry', '50')
    }
  })

  test('Ellipse shape should calculate center point correctly', async ({ page }) => {
    // Create an ellipse
    await page.locator('.toolkit label.ellipse').click()
    
    const canvas = page.locator('svg.canvas')
    const canvasBounds = await canvas.boundingBox()
    
    if (canvasBounds) {
      // Draw an ellipse
      await page.mouse.move(canvasBounds.x + 100, canvasBounds.y + 100)
      await page.mouse.down()
      await page.mouse.move(canvasBounds.x + 300, canvasBounds.y + 200)
      await page.mouse.up()
      
      // Check if the center is calculated correctly
      const centerIsCorrect = await page.evaluate(() => {
        const ellipse = document.querySelector('svg.canvas ellipse')
        const shape = window.Shape.findByElement(ellipse)
        
        // Center should be at (200, 150) for an ellipse from (100, 100) to (300, 200)
        return shape.center.x === 200 && shape.center.y === 150
      })
      
      expect(centerIsCorrect).toBeTruthy()
    }
  })

  test('Ellipse shape should be transformable', async ({ page }) => {
    // Create an ellipse
    await page.locator('.toolkit label.ellipse').click()
    
    const canvas = page.locator('svg.canvas')
    const canvasBounds = await canvas.boundingBox()
    
    if (canvasBounds) {
      // Draw an ellipse
      await page.mouse.move(canvasBounds.x + 100, canvasBounds.y + 100)
      await page.mouse.down()
      await page.mouse.move(canvasBounds.x + 300, canvasBounds.y + 200)
      await page.mouse.up()
      
      // Test scaling
      await page.locator('.toolkit label.zoom').click()
      
      // Click on the ellipse to select it
      await page.mouse.click(canvasBounds.x + 200, canvasBounds.y + 150)
      
      // Scale the ellipse
      await page.mouse.move(canvasBounds.x + 250, canvasBounds.y + 150)
      await page.mouse.down()
      await page.mouse.move(canvasBounds.x + 300, canvasBounds.y + 150)
      await page.mouse.up()
      
      // Check if the ellipse has been scaled
      const transformStyle = await page.locator('svg.canvas ellipse').getAttribute('style')
      expect(transformStyle).toContain('scale')
    }
  })

  test('Ellipse shape should be cloneable', async ({ page }) => {
    // Create an ellipse
    await page.locator('.toolkit label.ellipse').click()
    
    const canvas = page.locator('svg.canvas')
    const canvasBounds = await canvas.boundingBox()
    
    if (canvasBounds) {
      // Draw an ellipse
      await page.mouse.move(canvasBounds.x + 100, canvasBounds.y + 100)
      await page.mouse.down()
      await page.mouse.move(canvasBounds.x + 300, canvasBounds.y + 200)
      await page.mouse.up()
      
      // Select the copy tool
      await page.locator('.toolkit label.copy').click()
      
      // Click on the ellipse to select it
      await page.mouse.click(canvasBounds.x + 200, canvasBounds.y + 150)
      
      // Drag to position the clone
      await page.mouse.move(canvasBounds.x + 200, canvasBounds.y + 150)
      await page.mouse.down()
      await page.mouse.move(canvasBounds.x + 400, canvasBounds.y + 300)
      await page.mouse.up()
      
      // Check if there are now two ellipses
      const ellipseCount = await page.locator('svg.canvas ellipse').count()
      expect(ellipseCount).toBe(2)
      
      // Check if the clone has the same attributes as the original
      const ellipses = await page.locator('svg.canvas ellipse').all()
      
      // Get attributes of both ellipses
      const originalAttrs = await ellipses[0].evaluate(el => ({
        rx: el.getAttribute('rx'),
        ry: el.getAttribute('ry'),
        stroke: el.getAttribute('stroke'),
        strokeWidth: el.getAttribute('stroke-width')
      }))
      
      const cloneAttrs = await ellipses[1].evaluate(el => ({
        rx: el.getAttribute('rx'),
        ry: el.getAttribute('ry'),
        stroke: el.getAttribute('stroke'),
        strokeWidth: el.getAttribute('stroke-width')
      }))
      
      // The clone should have the same dimensions and style
      expect(cloneAttrs.rx).toBe(originalAttrs.rx)
      expect(cloneAttrs.ry).toBe(originalAttrs.ry)
      expect(cloneAttrs.stroke).toBe(originalAttrs.stroke)
      expect(cloneAttrs.strokeWidth).toBe(originalAttrs.strokeWidth)
      
      // The clone should be offset by Shape.offset
      const cloneHasOffset = await page.evaluate(() => {
        const ellipses = document.querySelectorAll('svg.canvas ellipse')
        
        // Check if the clone's position is offset by Shape.offset
        const offsetX = parseInt(ellipses[1].getAttribute('cx')) - parseInt(ellipses[0].getAttribute('cx'))
        const offsetY = parseInt(ellipses[1].getAttribute('cy')) - parseInt(ellipses[0].getAttribute('cy'))
        
        return offsetX === window.Shape.offset && offsetY === window.Shape.offset
      })
      
      expect(cloneHasOffset).toBeTruthy()
    }
  })
})