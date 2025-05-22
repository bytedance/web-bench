const { test, expect } = require('@playwright/test')
const exp = require('constants')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('click #login with valid values', async ({ page }) => {
  await page.locator('#user').fill('abc')
  await page.locator('#password').fill('123')

  page.on('dialog', async (dialog) => {
    await expect(dialog.message().toLowerCase()).toContain('login successfully')
    await dialog.accept()
  })

  await page.locator('#login').click()
})

test('click #login with empty user', async ({ page }) => {
  page.on('dialog', async (dialog) => {
    await expect(dialog.message().toLowerCase()).toContain('invalid user')
    await dialog.accept()
  })

  await page.locator('#login').click()
})

test('click #login with empty password', async ({ page }) => {
  await page.locator('#user').fill('abc')

  page.on('dialog', async (dialog) => {
    await expect(dialog.message().toLowerCase()).toContain('invalid password')
    await dialog.accept()
  })

  await page.locator('#login').click()
})
