import { test as base, Page } from '@playwright/test'

async function loginUser(page: Page) {
  await page.goto('/login')
  await page.getByLabel(/email/i).fill('tidebatera@gmail.com')
  await page.getByLabel(/senha|password/i).fill(process.env.E2E_PASSWORD || 'test-password')
  await page.getByRole('button', { name: /entrar|login|sign in/i }).click()
  await page.waitForURL('**/dashboard', { timeout: 10000 })
}

export const test = base.extend({
  authenticatedPage: async ({ page }, use) => {
    await loginUser(page)
    await use(page)
  },
})
export { expect } from '@playwright/test'
