const { test, expect } = require('@playwright/test')
const exp = require('constants')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('#user', async ({ page }) => {
  await expect(page.locator('#user')).toBeVisible()
})

test('#password', async ({ page }) => {
  await expect(page.locator('#password')).toBeVisible()
})

test('#login', async ({ page }) => {
  await expect(page.locator('#login')).toBeVisible()
})

test('#reset', async ({ page }) => {
  await expect(page.locator('#reset')).toBeVisible()
})
