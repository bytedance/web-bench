const { test, expect } = require('@playwright/test')
const exp = require('constants')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('.input', async ({ page }) => {
  await expect(page.locator('.input')).toBeVisible()
})

test('click button input', async ({ page }) => {
  page.on('dialog', async (dialog) => {
    if (dialog.type() === 'prompt') {
      await dialog.accept('hello')
    }
    else if (dialog.type() === 'alert') {
      await expect(dialog.message().toLowerCase()).toContain('hello')
      await dialog.accept()
    }
  })

  await page.locator('.input').click()
})
