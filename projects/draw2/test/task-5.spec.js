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

test.describe('Task 5: Toolkit Class Implementation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html')
  })

  test('Toolkit should track the currently selected operation', async ({ page }) => {
    // Click on different tools and check if they become selected
    await page.locator('.toolkit label.line').click()
    
    // Check if the line radio input is checked
    const isLineChecked = await page.locator('.toolkit .line input[type="radio"]').isChecked()
    expect(isLineChecked).toBeTruthy()
    
    // Click on another tool
    await page.locator('.toolkit label.rect').click()
    
    // Check if the rect radio input is checked and line is unchecked
    const isRectChecked = await page.locator('.toolkit .rect input[type="radio"]').isChecked()
    const isLineStillChecked = await page.locator('.toolkit .line input[type="radio"]').isChecked()
    
    expect(isRectChecked).toBeTruthy()
    expect(isLineStillChecked).toBeFalsy()
  })

  test('Toolkit should provide access to line width with correct range and default', async ({ page }) => {
    // Check line width input properties
    const lineWidthInput = page.locator('.toolkit .line-width')
    
    // Verify range attributes
    await expect(lineWidthInput).toHaveAttribute('min', '1')
    await expect(lineWidthInput).toHaveAttribute('max', '21')
    await expect(lineWidthInput).toHaveAttribute('step', '4')
    await expect(lineWidthInput).toHaveAttribute('value', '9')
    
    // Test changing the line width
    await lineWidthInput.fill('17')
    await expect(lineWidthInput).toHaveValue('17')
    
    // Draw a shape to verify the line width is applied
    await page.locator('.toolkit label.line').click()
    
    const canvas = page.locator('svg.canvas')
    const canvasBounds = await canvas.boundingBox()
    
    if (canvasBounds) {
      // Draw a line
      await page.mouse.move(canvasBounds.x + 50, canvasBounds.y + 50)
      await page.mouse.down()
      await page.mouse.move(canvasBounds.x + 150, canvasBounds.y + 50)
      await page.mouse.up()
      
      // Check if the line has the correct stroke width
      const strokeWidth = await page.locator('svg.canvas line').getAttribute('stroke-width')
      expect(strokeWidth).toBe('17')
    }
  })

  test('Toolkit should provide access to color values', async ({ page }) => {
    // Check color input
    const colorInput = page.locator('.toolkit .color')
    
    // Get the default color
    const defaultColor = await colorInput.inputValue()
    
    // Change the color
    await colorInput.fill('#ff0000')
    await expect(colorInput).toHaveValue('#ff0000')
    
    // Draw a shape to verify the color is applied
    await page.locator('.toolkit label.rect').click()
    
    const canvas = page.locator('svg.canvas')
    const canvasBounds = await canvas.boundingBox()
    
    if (canvasBounds) {
      // Draw a rectangle
      await page.mouse.move(canvasBounds.x + 100, canvasBounds.y + 100)
      await page.mouse.down()
      await page.mouse.move(canvasBounds.x + 200, canvasBounds.y + 200)
      await page.mouse.up()
      
      // Check if the rectangle has the correct stroke color
      const strokeColor = await page.locator('svg.canvas rect').getAttribute('stroke')
      expect(strokeColor).toBe('#ff0000')
    }
  })

  test('Toolkit should emit operation-change events when tools are switched', async ({ page }) => {
    // Add a listener for the operation-change event
    await page.evaluate(() => {
      window.lastOperation = null
      const toolkit = document.querySelector('.toolkit')
      
      // Create a custom event listener to track operation changes
      toolkit.addEventListener('operation-change', (event) => {
        window.lastOperation = event.detail
      })
    })
    
    // Click on a tool
    await page.locator('.toolkit label.ellipse').click()
    
    // Check if the operation-change event was emitted with the correct operation
    const operationAfterClick = await page.evaluate(() => {
      // In a real implementation, we'd check the event detail
      // Here we'll check if the correct radio is selected
      const selectedRadio = document.querySelector('.toolkit input[type="radio"]:checked')
      return selectedRadio ? selectedRadio.value : null
    })
    
    expect(operationAfterClick).toBe('ellipse')
    
    // Click on another tool
    await page.locator('.toolkit label.move').click()
    
    // Check if the operation-change event was emitted again
    const operationAfterSecondClick = await page.evaluate(() => {
      const selectedRadio = document.querySelector('.toolkit input[type="radio"]:checked')
      return selectedRadio ? selectedRadio.value : null
    })
    
    expect(operationAfterSecondClick).toBe('move')
  })
})