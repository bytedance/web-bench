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

test.describe('Task 8: Line Shape Class Implementation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html')
  })

  test('Line shape should be created with correct attributes', async ({ page }) => {
    // Set line width and color
    await page.locator('.toolkit .line-width').fill('13')
    await page.locator('.toolkit .color').fill('#ff0000')
    
    // Select the line tool
    await page.locator('.toolkit label.line').click()
    
    // Draw a line
    const canvas = page.locator('svg.canvas')
    const canvasBounds = await canvas.boundingBox()
    
    if (canvasBounds) {
      await page.mouse.move(canvasBounds.x + 100, canvasBounds.y + 100)
      await page.mouse.down()
      await page.mouse.move(canvasBounds.x + 300, canvasBounds.y + 200)
      await page.mouse.up()
      
      // Check if the line has the correct attributes
      const line = page.locator('svg.canvas line')
      
      // Check coordinates
      await expect(line).toHaveAttribute('x1', '100')
      await expect(line).toHaveAttribute('y1', '100')
      await expect(line).toHaveAttribute('x2', '300')
      await expect(line).toHaveAttribute('y2', '200')
      
      // Check style attributes
      await expect(line).toHaveAttribute('stroke', '#ff0000')
      await expect(line).toHaveAttribute('stroke-width', '13')
      await expect(line).toHaveAttribute('fill', 'none')
    }
  })

  test('Line shape should update correctly during creation', async ({ page }) => {
    // Select the line tool
    await page.locator('.toolkit label.line').click()
    
    // Start drawing a line
    const canvas = page.locator('svg.canvas')
    const canvasBounds = await canvas.boundingBox()
    
    if (canvasBounds) {
      // Start at a point
      await page.mouse.move(canvasBounds.x + 100, canvasBounds.y + 100)
      await page.mouse.down()
      
      // Move to first position
      await page.mouse.move(canvasBounds.x + 200, canvasBounds.y + 150)
      
      // Check intermediate position
      const lineIntermediate = page.locator('svg.canvas line')
      const x2Intermediate = await lineIntermediate.getAttribute('x2')
      const y2Intermediate = await lineIntermediate.getAttribute('y2')
      
      expect(x2Intermediate).toBe('200')
      expect(y2Intermediate).toBe('150')
      
      // Move to final position
      await page.mouse.move(canvasBounds.x + 300, canvasBounds.y + 200)
      await page.mouse.up()
      
      // Check final position
      const lineFinal = page.locator('svg.canvas line')
      await expect(lineFinal).toHaveAttribute('x2', '300')
      await expect(lineFinal).toHaveAttribute('y2', '200')
    }
  })

  test('Line shape should calculate center point correctly', async ({ page }) => {
    // Create a line
    await page.locator('.toolkit label.line').click()
    
    const canvas = page.locator('svg.canvas')
    const canvasBounds = await canvas.boundingBox()
    
    if (canvasBounds) {
      // Draw a horizontal line
      await page.mouse.move(canvasBounds.x + 100, canvasBounds.y + 100)
      await page.mouse.down()
      await page.mouse.move(canvasBounds.x + 300, canvasBounds.y + 100)
      await page.mouse.up()
      
      // Check if the center is calculated correctly
      const centerIsCorrect = await page.evaluate(() => {
        const line = document.querySelector('svg.canvas line')
        const shape = window.Shape.findByElement(line)
        
        // Center should be at (200, 100) for a line from (100, 100) to (300, 100)
        return shape.center.x === 200 && shape.center.y === 100
      })
      
      expect(centerIsCorrect).toBeTruthy()
    }
  })

  test('Line shape should be transformable', async ({ page }) => {
    // Create a line
    await page.locator('.toolkit label.line').click()
    
    const canvas = page.locator('svg.canvas')
    const canvasBounds = await canvas.boundingBox()
    
    if (canvasBounds) {
      // Draw a line
      await page.mouse.move(canvasBounds.x + 100, canvasBounds.y + 100)
      await page.mouse.down()
      await page.mouse.move(canvasBounds.x + 300, canvasBounds.y + 100)
      await page.mouse.up()
      
      // Select the move tool
      await page.locator('.toolkit label.move').click()
      
      // Click on the line to select it
      await page.mouse.click(canvasBounds.x + 200, canvasBounds.y + 100)
      
      // Move the line
      await page.mouse.move(canvasBounds.x + 200, canvasBounds.y + 100)
      await page.mouse.down()
      await page.mouse.move(canvasBounds.x + 250, canvasBounds.y + 150)
      await page.mouse.up()
      
      // Check if the line has been transformed
      const transformStyle = await page.locator('svg.canvas line').getAttribute('style')
      expect(transformStyle).toContain('translate(50px, 50px)')
    }
  })

  test('Line shape should be cloneable', async ({ page }) => {
    // Create a line
    await page.locator('.toolkit label.line').click()
    
    const canvas = page.locator('svg.canvas')
    const canvasBounds = await canvas.boundingBox()
    
    if (canvasBounds) {
      // Draw a line
      await page.mouse.move(canvasBounds.x + 100, canvasBounds.y + 100)
      await page.mouse.down()
      await page.mouse.move(canvasBounds.x + 300, canvasBounds.y + 100)
      await page.mouse.up()
      
      // Select the copy tool
      await page.locator('.toolkit label.copy').click()
      
      // Click on the line to select it
      await page.mouse.click(canvasBounds.x + 200, canvasBounds.y + 100)
      
      // Drag to position the clone
      await page.mouse.move(canvasBounds.x + 200, canvasBounds.y + 100)
      await page.mouse.down()
      await page.mouse.move(canvasBounds.x + 200, canvasBounds.y + 200)
      await page.mouse.up()
      
      // Check if there are now two lines
      const lineCount = await page.locator('svg.canvas line').count()
      expect(lineCount).toBe(2)
      
      // Check if the clone has the same attributes as the original
      const lines = await page.locator('svg.canvas line').all()
      
      // Get attributes of both lines
      const originalAttrs = await lines[0].evaluate(el => ({
        x1: el.getAttribute('x1'),
        y1: el.getAttribute('y1'),
        x2: el.getAttribute('x2'),
        y2: el.getAttribute('y2'),
        stroke: el.getAttribute('stroke'),
        strokeWidth: el.getAttribute('stroke-width')
      }))
      
      const cloneAttrs = await lines[1].evaluate(el => ({
        x1: el.getAttribute('x1'),
        y1: el.getAttribute('y1'),
        x2: el.getAttribute('x2'),
        y2: el.getAttribute('y2'),
        stroke: el.getAttribute('stroke'),
        strokeWidth: el.getAttribute('stroke-width')
      }))
      
      // The clone should have the same attributes except for position
      expect(cloneAttrs.stroke).toBe(originalAttrs.stroke)
      expect(cloneAttrs.strokeWidth).toBe(originalAttrs.strokeWidth)
      
      // The clone should be offset by Shape.offset
      const cloneHasOffset = await page.evaluate(() => {
        const lines = document.querySelectorAll('svg.canvas line')
        const original = window.Shape.findByElement(lines[0])
        const clone = window.Shape.findByElement(lines[1])
        
        // Check if the clone's position is offset by Shape.offset
        const offsetX = parseInt(lines[1].getAttribute('x1')) - parseInt(lines[0].getAttribute('x1'))
        const offsetY = parseInt(lines[1].getAttribute('y1')) - parseInt(lines[0].getAttribute('y1'))
        
        return offsetX === window.Shape.offset && offsetY === window.Shape.offset
      })
      
      expect(cloneHasOffset).toBeTruthy()
    }
  })
})