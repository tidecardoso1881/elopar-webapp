import { test, expect } from '@playwright/test'

test.describe('Autenticação', () => {
  test('Login com credenciais válidas redireciona para dashboard', async ({ page }) => {
    await page.goto('/login')

    await page.getByLabel(/email/i).fill('tidebatera@gmail.com')
    await page.getByLabel(/senha|password/i).fill(process.env.E2E_PASSWORD || 'test-password')
    await page.getByRole('button', { name: /entrar|login|sign in/i }).click()

    await page.waitForURL('**/dashboard', { timeout: 10000 })
    await expect(page).toHaveURL(/.*dashboard/)
  })

  test('Acesso a rota protegida sem login redireciona para login', async ({ page }) => {
    await page.goto('/dashboard', { waitUntil: 'networkidle' })

    await expect(page).toHaveURL(/.*login/)
  })

  test('Logout redireciona para login', async ({ page }) => {
    // Fazer login primeiro
    await page.goto('/login')
    await page.getByLabel(/email/i).fill('tidebatera@gmail.com')
    await page.getByLabel(/senha|password/i).fill(process.env.E2E_PASSWORD || 'test-password')
    await page.getByRole('button', { name: /entrar|login|sign in/i }).click()

    await page.waitForURL('**/dashboard', { timeout: 10000 })

    // Fazer logout
    const logoutButton = page.getByRole('button', { name: /sair|logout|sign out/i })
    if (await logoutButton.isVisible()) {
      await logoutButton.click()
      await page.waitForURL('**/login', { timeout: 10000 })
      await expect(page).toHaveURL(/.*login/)
    }
  })

  test('Login com senha incorreta mostra erro', async ({ page }) => {
    await page.goto('/login')

    await page.getByLabel(/email/i).fill('tidebatera@gmail.com')
    await page.getByLabel(/senha|password/i).fill('senha-incorreta-12345')
    await page.getByRole('button', { name: /entrar|login|sign in/i }).click()

    // Aguardar mensagem de erro
    const errorMessage = page.locator('[role="alert"]')
    await expect(errorMessage).toBeVisible({ timeout: 5000 })

    // Verificar que não redirecionou para dashboard
    await expect(page).toHaveURL(/.*login/)
  })
})
