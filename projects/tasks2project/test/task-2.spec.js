const { test, expect } = require('@playwright/test')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('click #reset', async ({ page }) => {
  await page.locator('#user').fill('abc')
  await page.locator('#password').fill('123')

  await page.locator('#reset').click()

  await expect(page.locator('#user')).toHaveValue('')
  await expect(page.locator('#password')).toHaveValue('')
})
