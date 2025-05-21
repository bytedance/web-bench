const { test, expect } = require('@playwright/test')
const exp = require('constants')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('.hello', async ({ page }) => {
  await expect(page.locator('.hello')).toBeVisible()
})

test('click button hello', async ({ page }) => {
  page.on('dialog', async (dialog) => {
    await expect(dialog.message().toLowerCase()).toContain('hello world')
    await dialog.accept();
  })

  await page.locator('.hello').click()
})
