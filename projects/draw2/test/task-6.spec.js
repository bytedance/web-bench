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

test.describe('Task 6: Keyboard Shortcut Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html')
  })

  test('pressing spacebar should temporarily switch to the move tool', async ({ page }) => {
    // First select a non-move tool
    await page.locator('.toolkit label.rect').click()
    
    // Verify the rect tool is selected
    const isRectCheckedBefore = await page.locator('.toolkit .rect input[type="radio"]').isChecked()
    expect(isRectCheckedBefore).toBeTruthy()
    
    // Press the spacebar
    await page.keyboard.down(' ')
    
    // Verify the move tool is now selected
    const isMoveCheckedDuringSpacebar = await page.locator('.toolkit .move input[type="radio"]').isChecked()
    const isRectCheckedDuringSpacebar = await page.locator('.toolkit .rect input[type="radio"]').isChecked()
    
    expect(isMoveCheckedDuringSpacebar).toBeTruthy()
    expect(isRectCheckedDuringSpacebar).toBeFalsy()
    
    // Release the spacebar
    await page.keyboard.up(' ')
    
    // Verify the rect tool is selected again
    const isRectCheckedAfter = await page.locator('.toolkit .rect input[type="radio"]').isChecked()
    const isMoveCheckedAfter = await page.locator('.toolkit .move input[type="radio"]').isChecked()
    
    expect(isRectCheckedAfter).toBeTruthy()
    expect(isMoveCheckedAfter).toBeFalsy()
  })

  test('spacebar shortcut should work with different initially selected tools', async ({ page }) => {
    // Test with the line tool
    await page.locator('.toolkit label.line').click()
    
    // Press the spacebar
    await page.keyboard.down(' ')
    
    // Verify the move tool is selected
    const isMoveCheckedDuringSpacebar = await page.locator('.toolkit .move input[type="radio"]').isChecked()
    expect(isMoveCheckedDuringSpacebar).toBeTruthy()
    
    // Release the spacebar
    await page.keyboard.up(' ')
    
    // Verify the line tool is selected again
    const isLineCheckedAfter = await page.locator('.toolkit .line input[type="radio"]').isChecked()
    expect(isLineCheckedAfter).toBeTruthy()
    
    // Test with the ellipse tool
    await page.locator('.toolkit label.ellipse').click()
    
    // Press the spacebar
    await page.keyboard.down(' ')
    
    // Verify the move tool is selected
    const isMoveCheckedDuringSpacebar2 = await page.locator('.toolkit .move input[type="radio"]').isChecked()
    expect(isMoveCheckedDuringSpacebar2).toBeTruthy()
    
    // Release the spacebar
    await page.keyboard.up(' ')
    
    // Verify the ellipse tool is selected again
    const isEllipseCheckedAfter = await page.locator('.toolkit .ellipse input[type="radio"]').isChecked()
    expect(isEllipseCheckedAfter).toBeTruthy()
  })

  test('spacebar shortcut should track the previous tool state correctly', async ({ page }) => {
    // Select the line tool
    await page.locator('.toolkit label.line').click()
    
    // Press and release spacebar
    await page.keyboard.down(' ')
    await page.keyboard.up(' ')
    
    // Verify we're back to the line tool
    const isLineCheckedAfter1 = await page.locator('.toolkit .line input[type="radio"]').isChecked()
    expect(isLineCheckedAfter1).toBeTruthy()
    
    // Select the rect tool
    await page.locator('.toolkit label.rect').click()
    
    // Press and release spacebar
    await page.keyboard.down(' ')
    await page.keyboard.up(' ')
    
    // Verify we're back to the rect tool, not the line tool
    const isRectCheckedAfter = await page.locator('.toolkit .rect input[type="radio"]').isChecked()
    const isLineCheckedAfter2 = await page.locator('.toolkit .line input[type="radio"]').isChecked()
    
    expect(isRectCheckedAfter).toBeTruthy()
    expect(isLineCheckedAfter2).toBeFalsy()
  })

  test('spacebar shortcut should handle keydown/keyup events appropriately', async ({ page }) => {
    // Select the ellipse tool
    await page.locator('.toolkit label.ellipse').click()
    
    // Press spacebar multiple times in succession
    await page.keyboard.down(' ')
    
    // Verify move tool is selected
    const isMoveChecked1 = await page.locator('.toolkit .move input[type="radio"]').isChecked()
    expect(isMoveChecked1).toBeTruthy()
    
    // Release and press again quickly
    await page.keyboard.up(' ')
    
    // Verify ellipse tool is selected again
    const isEllipseChecked = await page.locator('.toolkit .ellipse input[type="radio"]').isChecked()
    expect(isEllipseChecked).toBeTruthy()
    
    // Press spacebar again
    await page.keyboard.down(' ')
    
    // Verify move tool is selected again
    const isMoveChecked2 = await page.locator('.toolkit .move input[type="radio"]').isChecked()
    expect(isMoveChecked2).toBeTruthy()
    
    // Release spacebar
    await page.keyboard.up(' ')
    
    // Verify ellipse tool is selected again
    const isEllipseCheckedAgain = await page.locator('.toolkit .ellipse input[type="radio"]').isChecked()
    expect(isEllipseCheckedAgain).toBeTruthy()
  })
})