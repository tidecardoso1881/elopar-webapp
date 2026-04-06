import { test, expect } from './fixtures/auth'

test.describe('Dashboard', () => {
  test('Dashboard carrega com KPI cards visíveis', async ({ authenticatedPage: page }) => {
    await page.goto('/dashboard')

    // Aguardar que a página carregue
    await page.waitForLoadState('networkidle')

    // Verificar que KPI cards estão visíveis
    const kpiCards = page.locator('[data-testid^="kpi-"], .bg-white.rounded-lg.shadow')
    const cardCount = await kpiCards.count()

    expect(cardCount).toBeGreaterThan(0)
  })

  test('Sidebar com todos os links de navegação', async ({ authenticatedPage: page }) => {
    await page.goto('/dashboard')

    // Verificar presença dos links principais da sidebar
    const expectedLinks = [
      /dashboard|início/i,
      /profissionais/i,
      /clientes/i,
      /equipamentos/i,
      /férias|ferias/i,
      /renovações|renovacoes/i,
    ]

    for (const linkPattern of expectedLinks) {
      const link = page.getByRole('link', { name: linkPattern })
      await expect(link).toBeVisible({ timeout: 5000 })
    }
  })

  test('Navegação para /profissionais', async ({ authenticatedPage: page }) => {
    await page.goto('/dashboard')

    await page.getByRole('link', { name: /profissionais/i }).click()

    await page.waitForURL('**/profissionais', { timeout: 10000 })
    await expect(page).toHaveURL(/.*profissionais/)
  })

  test('Navegação para /clientes', async ({ authenticatedPage: page }) => {
    await page.goto('/dashboard')

    await page.getByRole('link', { name: /clientes/i }).click()

    await page.waitForURL('**/clientes', { timeout: 10000 })
    await expect(page).toHaveURL(/.*clientes/)
  })

  test('Navegação para /renovacoes', async ({ authenticatedPage: page }) => {
    await page.goto('/dashboard')

    await page.getByRole('link', { name: /renovações|renovacoes/i }).click()

    await page.waitForURL('**/renovacoes', { timeout: 10000 })
    await expect(page).toHaveURL(/.*renovacoes/)
  })

  test('Navegação para /equipamentos', async ({ authenticatedPage: page }) => {
    await page.goto('/dashboard')

    await page.getByRole('link', { name: /equipamentos/i }).click()

    await page.waitForURL('**/equipamentos', { timeout: 10000 })
    await expect(page).toHaveURL(/.*equipamentos/)
  })

  test('Navegação para /ferias', async ({ authenticatedPage: page }) => {
    await page.goto('/dashboard')

    await page.getByRole('link', { name: /férias|ferias/i }).click()

    await page.waitForURL('**/ferias', { timeout: 10000 })
    await expect(page).toHaveURL(/.*ferias/)
  })
})
