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

test.describe('Task 3: Custom SVG Icons Implementation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html')
  })

  test('each tool button should have a custom SVG icon as background image', async ({ page }) => {
    // List of all tool classes
    const toolClasses = ['line', 'rect', 'ellipse', 'move', 'rotate', 'zoom', 'copy', 'delete', 'fill']
    
    for (const toolClass of toolClasses) {
      const backgroundImage = await page.locator(`.toolkit label.${toolClass}`).evaluate(el => {
        return window.getComputedStyle(el).backgroundImage
      })
      
      // Check if background image is a data URI for SVG
      expect(backgroundImage).toMatch(/url\("data:image\/svg\+xml,%3Csvg/)
    }
  })

  test('icons should be 20x20 pixels and display as background images', async ({ page }) => {
    // Check a sample tool to verify icon size
    const iconStyle = await page.locator('.toolkit label.line').evaluate(el => {
      const style = window.getComputedStyle(el)
      return {
        backgroundSize: style.backgroundSize,
        backgroundRepeat: style.backgroundRepeat,
        backgroundPosition: style.backgroundPosition
      }
    })
    
    // Background should contain the image properly
    expect(iconStyle.backgroundSize).toBe('contain')
    expect(iconStyle.backgroundRepeat).toBe('no-repeat')
    expect(iconStyle.backgroundPosition).toBe('center')
    
    // Verify the SVG viewBox size in the data URI
    const backgroundImage = await page.locator('.toolkit label.line').evaluate(el => {
      return window.getComputedStyle(el).backgroundImage
    })
    
    // Check if the SVG has width and height of 20
    expect(backgroundImage).toMatch(/width='20'\s+height='20'/)
  })

  test('tool buttons should have hover effects with semi-transparent backgrounds', async ({ page }) => {
    // Get the default background color
    const defaultBgColor = await page.locator('.toolkit label.line').evaluate(el => {
      return window.getComputedStyle(el).backgroundColor
    })
    
    // Hover over a tool and check the background color
    await page.locator('.toolkit label.line').hover()
    const hoverBgColor = await page.locator('.toolkit label.line').evaluate(el => {
      return window.getComputedStyle(el).backgroundColor
    })
    
    // Hover effect should change the background to a semi-transparent color
    expect(hoverBgColor).toMatch(/rgba\(\d+,\s*\d+,\s*\d+,\s*0\.1\)/)
    expect(hoverBgColor).not.toBe(defaultBgColor)
  })

  test('selected tools should be highlighted with darker background colors', async ({ page }) => {
    // Click on a tool to select it
    await page.locator('.toolkit label.line').click()
    
    // Check the background color of the selected tool
    const selectedBgColor = await page.locator('.toolkit label.line').evaluate(el => {
      return window.getComputedStyle(el).backgroundColor
    })
    
    // Selected tool should have a darker background
    expect(selectedBgColor).toMatch(/rgba\(\d+,\s*\d+,\s*\d+,\s*0\.2\)/)
    
    // Click on another tool and verify the first one is no longer highlighted
    await page.locator('.toolkit label.rect').click()
    const deselectedBgColor = await page.locator('.toolkit label.line').evaluate(el => {
      return window.getComputedStyle(el).backgroundColor
    })
    
    // The background color should no longer be the selected color
    expect(deselectedBgColor).not.toBe(selectedBgColor)
  })
})