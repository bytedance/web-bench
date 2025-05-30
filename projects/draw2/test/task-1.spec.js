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

test.describe('Task 1: SVG Canvas Implementation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html')
  })

  test('canvas should be an SVG element with class "canvas"', async ({ page }) => {
    const canvas = page.locator('svg.canvas')
    await expect(canvas).toBeVisible()
    await expect(canvas.evaluate(el => el.tagName.toLowerCase())).resolves.toBe('svg')
  })

  test('canvas should have a light gray background', async ({ page }) => {
    const canvas = page.locator('svg.canvas')
    const bgColor = await canvas.evaluate(el => {
      return window.getComputedStyle(el).backgroundColor
    })
    
    // Check if the background color is light gray (#eee or rgb equivalent)
    expect(bgColor).toMatch(/rgb\(238,\s*238,\s*238\)|#eee|#eeeeee/i)
  })

  test('canvas should expand to fill available space', async ({ page }) => {
    // Get the root container dimensions
    const rootDimensions = await page.locator('.root').evaluate(el => {
      return {
        width: el.clientWidth,
        height: el.clientHeight
      }
    })
    
    // Get the toolkit dimensions
    const toolkitDimensions = await page.locator('.toolkit').evaluate(el => {
      return {
        height: el.clientHeight
      }
    })
    
    // Get the canvas dimensions
    const canvasDimensions = await page.locator('svg.canvas').evaluate(el => {
      return {
        width: el.clientWidth,
        height: el.clientHeight
      }
    })
    
    // Canvas should take up the remaining height after the toolkit
    expect(canvasDimensions.height).toBeCloseTo(rootDimensions.height - toolkitDimensions.height, -1) // -1 for precision
    
    // Canvas width should match the root width
    expect(canvasDimensions.width).toBeCloseTo(rootDimensions.width, -1) // -1 for precision
  })

  test('canvas should be positioned within a flex container', async ({ page }) => {
    // Check if the root element is a flex container
    const rootDisplay = await page.locator('.root').evaluate(el => {
      return window.getComputedStyle(el).display
    })
    
    expect(rootDisplay).toBe('flex')
    
    // Check if the canvas has flex properties
    const canvasFlex = await page.locator('svg.canvas').evaluate(el => {
      const style = window.getComputedStyle(el)
      return style.flex || style.flexGrow
    })
    
    // Canvas should have flex properties to expand
    expect(canvasFlex).toBeTruthy()
  })
})