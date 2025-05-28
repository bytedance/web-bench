const { test, expect } = require('@playwright/test')
const exp = require('constants')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('body', async ({ page }) => {
  await expect(page.locator('body')).toBeAttached()
})
