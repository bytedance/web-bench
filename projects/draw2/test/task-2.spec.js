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

test.describe('Task 2: Toolbar Interface Implementation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html')
  })

  test('toolbar should have three sections: shape, property controls, and operation tools', async ({ page }) => {
    // Check if all three sections exist
    await expect(page.locator('.toolkit .shape')).toBeVisible()
    await expect(page.locator('.toolkit .prop')).toBeVisible()
    await expect(page.locator('.toolkit .operation')).toBeVisible()
  })

  test('shape tools section should contain line, rect, and ellipse tools', async ({ page }) => {
    // Check if all shape tools exist
    await expect(page.locator('.toolkit .shape .line')).toBeVisible()
    await expect(page.locator('.toolkit .shape .rect')).toBeVisible()
    await expect(page.locator('.toolkit .shape .ellipse')).toBeVisible()
    
    // Verify each tool has a radio input with name="operation"
    for (const tool of ['line', 'rect', 'ellipse']) {
      await expect(page.locator(`.toolkit .shape .${tool} input[type="radio"][name="operation"]`)).toBeAttached()
    }
  })

  test('property controls section should contain line-width slider and color picker', async ({ page }) => {
    // Check if line-width slider exists
    const lineWidthSlider = page.locator('.toolkit .prop .line-width')
    await expect(lineWidthSlider).toBeVisible()
    
    // Verify slider properties
    await expect(lineWidthSlider).toHaveAttribute('type', 'range')
    await expect(lineWidthSlider).toHaveAttribute('min', '1')
    await expect(lineWidthSlider).toHaveAttribute('max', '21')
    await expect(lineWidthSlider).toHaveAttribute('step', '4')
    await expect(lineWidthSlider).toHaveAttribute('value', '9')
    
    // Check if color picker exists
    const colorPicker = page.locator('.toolkit .prop .color')
    await expect(colorPicker).toBeVisible()
    await expect(colorPicker).toHaveAttribute('type', 'color')
  })

  test('operation tools section should contain move, rotate, zoom, copy, delete, and fill tools', async ({ page }) => {
    // Check if all operation tools exist
    const operationTools = ['move', 'rotate', 'zoom', 'copy', 'delete', 'fill']
    
    for (const tool of operationTools) {
      // Check if the tool label exists
      await expect(page.locator(`.toolkit .operation .${tool}`)).toBeVisible()
      
      // Verify each tool has a radio input with name="operation"
      await expect(page.locator(`.toolkit .operation .${tool} input[type="radio"][name="operation"]`)).toBeAttached()
    }
  })

  test('each tool should be a label containing a hidden radio input', async ({ page }) => {
    // Get all tool labels
    const toolLabels = await page.locator('.toolkit label').all()
    
    // Check each label has a radio input
    for (const label of toolLabels) {
      const hasRadioInput = await label.locator('input[type="radio"]').count() > 0
      expect(hasRadioInput).toBeTruthy()
      
      // Check if the radio input is visually hidden (not visible but still functional)
      const radioInput = label.locator('input[type="radio"]')
      const isHidden = await radioInput.evaluate(el => {
        const style = window.getComputedStyle(el)
        return style.appearance === 'none' || 
               style.width === '0px' || 
               style.height === '0px' || 
               style.opacity === '0' || 
               style.visibility === 'hidden'
      })
      
      expect(isHidden).toBeTruthy()
    }
  })
})