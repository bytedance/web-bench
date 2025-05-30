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

test.describe('Task 11: Automatic Tool Switching', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html')
  })

  test('should automatically switch to move tool after creating a line', async ({ page }) => {
    // Select the line tool
    await page.locator('.toolkit label.line').click()
    
    // Verify the line tool is selected
    const isLineCheckedBefore = await page.locator('.toolkit .line input[type="radio"]').isChecked()
    expect(isLineCheckedBefore).toBeTruthy()
    
    // Draw a line
    const canvas = page.locator('svg.canvas')
    const canvasBounds = await canvas.boundingBox()
    
    if (canvasBounds) {
      await page.mouse.move(canvasBounds.x + 100, canvasBounds.y + 100)
      await page.mouse.down()
      await page.mouse.move(canvasBounds.x + 300, canvasBounds.y + 100)
      await page.mouse.up()
      
      // Wait a moment for the tool switch to occur
      await page.waitForTimeout(100)
      
      // Verify the move tool is now selected
      const isMoveCheckedAfter = await page.locator('.toolkit .move input[type="radio"]').isChecked()
      const isLineCheckedAfter = await page.locator('.toolkit .line input[type="radio"]').isChecked()
      
      expect(isMoveCheckedAfter).toBeTruthy()
      expect(isLineCheckedAfter).toBeFalsy()
    }
  })

  test('should automatically switch to move tool after creating a rectangle', async ({ page }) => {
    // Select the rectangle tool
    await page.locator('.toolkit label.rect').click()
    
    // Verify the rectangle tool is selected
    const isRectCheckedBefore = await page.locator('.toolkit .rect input[type="radio"]').isChecked()
    expect(isRectCheckedBefore).toBeTruthy()
    
    // Draw a rectangle
    const canvas = page.locator('svg.canvas')
    const canvasBounds = await canvas.boundingBox()
    
    if (canvasBounds) {
      await page.mouse.move(canvasBounds.x + 100, canvasBounds.y + 100)
      await page.mouse.down()
      await page.mouse.move(canvasBounds.x + 300, canvasBounds.y + 200)
      await page.mouse.up()
      
      // Wait a moment for the tool switch to occur
      await page.waitForTimeout(100)
      
      // Verify the move tool is now selected
      const isMoveCheckedAfter = await page.locator('.toolkit .move input[type="radio"]').isChecked()
      const isRectCheckedAfter = await page.locator('.toolkit .rect input[type="radio"]').isChecked()
      
      expect(isMoveCheckedAfter).toBeTruthy()
      expect(isRectCheckedAfter).toBeFalsy()
    }
  })

  test('should automatically switch to move tool after creating an ellipse', async ({ page }) => {
    // Select the ellipse tool
    await page.locator('.toolkit label.ellipse').click()
    
    // Verify the ellipse tool is selected
    const isEllipseCheckedBefore = await page.locator('.toolkit .ellipse input[type="radio"]').isChecked()
    expect(isEllipseCheckedBefore).toBeTruthy()
    
    // Draw an ellipse
    const canvas = page.locator('svg.canvas')
    const canvasBounds = await canvas.boundingBox()
    
    if (canvasBounds) {
      await page.mouse.move(canvasBounds.x + 100, canvasBounds.y + 100)
      await page.mouse.down()
      await page.mouse.move(canvasBounds.x + 300, canvasBounds.y + 200)
      await page.mouse.up()
      
      // Wait a moment for the tool switch to occur
      await page.waitForTimeout(100)
      
      // Verify the move tool is now selected
      const isMoveCheckedAfter = await page.locator('.toolkit .move input[type="radio"]').isChecked()
      const isEllipseCheckedAfter = await page.locator('.toolkit .ellipse input[type="radio"]').isChecked()
      
      expect(isMoveCheckedAfter).toBeTruthy()
      expect(isEllipseCheckedAfter).toBeFalsy()
    }
  })

  test('should automatically switch to move tool after copying a shape', async ({ page }) => {
    // First create a shape
    await page.locator('.toolkit label.rect').click()
    
    const canvas = page.locator('svg.canvas')
    const canvasBounds = await canvas.boundingBox()
    
    if (canvasBounds) {
      // Draw a rectangle
      await page.mouse.move(canvasBounds.x + 100, canvasBounds.y + 100)
      await page.mouse.down()
      await page.mouse.move(canvasBounds.x + 300, canvasBounds.y + 200)
      await page.mouse.up()
      
      // Wait for the automatic switch to move tool
      await page.waitForTimeout(100)
      
      // Now select the copy tool
      await page.locator('.toolkit label.copy').click()
      
      // Verify the copy tool is selected
      const isCopyCheckedBefore = await page.locator('.toolkit .copy input[type="radio"]').isChecked()
      expect(isCopyCheckedBefore).toBeTruthy()
      
      // Copy the rectangle
      await page.mouse.click(canvasBounds.x + 200, canvasBounds.y + 150)
      await page.mouse.move(canvasBounds.x + 200, canvasBounds.y + 150)
      await page.mouse.down()
      await page.mouse.move(canvasBounds.x + 400, canvasBounds.y + 300)
      await page.mouse.up()
      
      // Wait a moment for the tool switch to occur
      await page.waitForTimeout(100)
      
      // Verify the move tool is now selected
      const isMoveCheckedAfter = await page.locator('.toolkit .move input[type="radio"]').isChecked()
      const isCopyCheckedAfter = await page.locator('.toolkit .copy input[type="radio"]').isChecked()
      
      expect(isMoveCheckedAfter).toBeTruthy()
      expect(isCopyCheckedAfter).toBeFalsy()
    }
  })

  test('should NOT automatically switch to move tool after using rotate tool', async ({ page }) => {
    // First create a shape
    await page.locator('.toolkit label.rect').click()
    
    const canvas = page.locator('svg.canvas')
    const canvasBounds = await canvas.boundingBox()
    
    if (canvasBounds) {
      // Draw a rectangle
      await page.mouse.move(canvasBounds.x + 100, canvasBounds.y + 100)
      await page.mouse.down()
      await page.mouse.move(canvasBounds.x + 300, canvasBounds.y + 200)
      await page.mouse.up()
      
      // Wait for the automatic switch to move tool
      await page.waitForTimeout(100)
      
      // Now select the rotate tool
      await page.locator('.toolkit label.rotate').click()
      
      // Verify the rotate tool is selected
      const isRotateCheckedBefore = await page.locator('.toolkit .rotate input[type="radio"]').isChecked()
      expect(isRotateCheckedBefore).toBeTruthy()
      
      // Rotate the rectangle
      await page.mouse.click(canvasBounds.x + 200, canvasBounds.y + 150)
      await page.mouse.move(canvasBounds.x + 250, canvasBounds.y + 150)
      await page.mouse.down()
      await page.mouse.move(canvasBounds.x + 250, canvasBounds.y + 200)
      await page.mouse.up()
      
      // Wait a moment to ensure no tool switch occurs
      await page.waitForTimeout(100)
      
      // Verify the rotate tool is still selected
      const isRotateCheckedAfter = await page.locator('.toolkit .rotate input[type="radio"]').isChecked()
      const isMoveCheckedAfter = await page.locator('.toolkit .move input[type="radio"]').isChecked()
      
      expect(isRotateCheckedAfter).toBeTruthy()
      expect(isMoveCheckedAfter).toBeFalsy()
    }
  })

  test('should NOT automatically switch to move tool after using zoom tool', async ({ page }) => {
    // First create a shape
    await page.locator('.toolkit label.rect').click()
    
    const canvas = page.locator('svg.canvas')
    const canvasBounds = await canvas.boundingBox()
    
    if (canvasBounds) {
      // Draw a rectangle
      await page.mouse.move(canvasBounds.x + 100, canvasBounds.y + 100)
      await page.mouse.down()
      await page.mouse.move(canvasBounds.x + 300, canvasBounds.y + 200)
      await page.mouse.up()
      
      // Wait for the automatic switch to move tool
      await page.waitForTimeout(100)
      
      // Now select the zoom tool
      await page.locator('.toolkit label.zoom').click()
      
      // Verify the zoom tool is selected
      const isZoomCheckedBefore = await page.locator('.toolkit .zoom input[type="radio"]').isChecked()
      expect(isZoomCheckedBefore).toBeTruthy()
      
      // Zoom the rectangle
      await page.mouse.click(canvasBounds.x + 200, canvasBounds.y + 150)
      await page.mouse.move(canvasBounds.x + 200, canvasBounds.y + 150)
      await page.mouse.down()
      await page.mouse.move(canvasBounds.x + 250, canvasBounds.y + 200)
      await page.mouse.up()
      
      // Wait a moment to ensure no tool switch occurs
      await page.waitForTimeout(100)
      
      // Verify the zoom tool is still selected
      const isZoomCheckedAfter = await page.locator('.toolkit .zoom input[type="radio"]').isChecked()
      const isMoveCheckedAfter = await page.locator('.toolkit .move input[type="radio"]').isChecked()
      
      expect(isZoomCheckedAfter).toBeTruthy()
      expect(isMoveCheckedAfter).toBeFalsy()
    }
  })
})