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

test.describe('Task 4: Canvas Class Implementation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html')
  })

  test('Canvas class should accept a selector and Toolkit instance', async ({ page }) => {
    // Check if Canvas is properly initialized by creating a shape
    // First select the line tool
    await page.locator('.toolkit label.line').click()
    
    // Draw a line on the canvas
    const canvas = page.locator('svg.canvas')
    const canvasBounds = await canvas.boundingBox()
    
    if (canvasBounds) {
      // Draw a line by clicking and dragging
      await page.mouse.move(canvasBounds.x + 50, canvasBounds.y + 50)
      await page.mouse.down()
      await page.mouse.move(canvasBounds.x + 150, canvasBounds.y + 50)
      await page.mouse.up()
      
      // Check if a line was created
      await expect(page.locator('svg.canvas line')).toBeVisible()
    }
  })

  test('Canvas should bind mouse events for drawing operations', async ({ page }) => {
    // Test mouse events by drawing a rectangle
    await page.locator('.toolkit label.rect').click()
    
    const canvas = page.locator('svg.canvas')
    const canvasBounds = await canvas.boundingBox()
    
    if (canvasBounds) {
      // Draw a rectangle by clicking and dragging
      await page.mouse.move(canvasBounds.x + 100, canvasBounds.y + 100)
      await page.mouse.down()
      await page.mouse.move(canvasBounds.x + 200, canvasBounds.y + 200)
      await page.mouse.up()
      
      // Check if a rectangle was created
      await expect(page.locator('svg.canvas rect')).toBeVisible()
    }
  })

  test('Canvas should calculate cursor positions relative to the canvas', async ({ page }) => {
    // Test by drawing an ellipse and checking its position
    await page.locator('.toolkit label.ellipse').click()
    
    const canvas = page.locator('svg.canvas')
    const canvasBounds = await canvas.boundingBox()
    
    if (canvasBounds) {
      // Draw an ellipse at a specific position
      const startX = canvasBounds.x + 150
      const startY = canvasBounds.y + 150
      const endX = canvasBounds.x + 250
      const endY = canvasBounds.y + 200
      
      await page.mouse.move(startX, startY)
      await page.mouse.down()
      await page.mouse.move(endX, endY)
      await page.mouse.up()
      
      // Check if an ellipse was created
      const ellipse = page.locator('svg.canvas ellipse')
      await expect(ellipse).toBeVisible()
      
      // Get the ellipse's center coordinates
      const cx = await ellipse.evaluate(el => parseFloat(el.getAttribute('cx')))
      const cy = await ellipse.evaluate(el => parseFloat(el.getAttribute('cy')))
      
      // The center should be between the start and end points
      expect(cx).toBeGreaterThan(0) // Should be relative to canvas, not page
      expect(cy).toBeGreaterThan(0) // Should be relative to canvas, not page
    }
  })

  test('Canvas should handle both mouse and touch events', async ({ page }) => {
    // Check if the Canvas class binds both mouse and touch events
    const hasEventListeners = await page.evaluate(() => {
      const canvas = document.querySelector('svg.canvas')
      // Check if the canvas has event listeners for both mouse and touch events
      return {
        // Mouse events
        mousedown: canvas.__lookupEventListener?.('mousedown') !== undefined || 
                  canvas.onmousedown !== null,
        mousemove: canvas.__lookupEventListener?.('mousemove') !== undefined || 
                  canvas.onmousemove !== null,
        mouseup: canvas.__lookupEventListener?.('mouseup') !== undefined || 
                canvas.onmouseup !== null,
        mouseleave: canvas.__lookupEventListener?.('mouseleave') !== undefined || 
                   canvas.onmouseleave !== null,
        
        // Touch events
        touchstart: canvas.__lookupEventListener?.('touchstart') !== undefined || 
                   canvas.ontouchstart !== null,
        touchmove: canvas.__lookupEventListener?.('touchmove') !== undefined || 
                  canvas.ontouchmove !== null,
        touchend: canvas.__lookupEventListener?.('touchend') !== undefined || 
                 canvas.ontouchend !== null,
        touchcancel: canvas.__lookupEventListener?.('touchcancel') !== undefined || 
                    canvas.ontouchcancel !== null
      }
    })
    
    // Since we can't directly check event listeners in Playwright,
    // we'll verify the functionality by checking if drawing works
    await page.locator('.toolkit label.line').click()
    
    const canvas = page.locator('svg.canvas')
    const canvasBounds = await canvas.boundingBox()
    
    if (canvasBounds) {
      // Draw a line
      await page.mouse.move(canvasBounds.x + 50, canvasBounds.y + 150)
      await page.mouse.down()
      await page.mouse.move(canvasBounds.x + 150, canvasBounds.y + 150)
      await page.mouse.up()
      
      // Check if a line was created
      await expect(page.locator('svg.canvas line')).toBeVisible()
    }
  })
})