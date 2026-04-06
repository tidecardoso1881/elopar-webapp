import { test, expect } from './fixtures/auth'

test.describe('Férias', () => {
  test('Página de férias carrega', async ({ authenticatedPage: page }) => {
    await page.goto('/ferias')

    await page.waitForLoadState('networkidle')

    // Verificar que a página carregou
    const heading = page.getByRole('heading', { name: /férias|ferias/i })
    await expect(heading).toBeVisible({ timeout: 5000 })
  })

  test('Toggle entre Calendário e Lista funciona', async ({ authenticatedPage: page }) => {
    await page.goto('/ferias')

    await page.waitForLoadState('networkidle')

    // Procurar por botões de toggle ou abas
    const toggleButtons = page.getByRole('button', { name: /calendário|calendar|lista|list|view/i })

    if (await toggleButtons.count() > 0) {
      const firstButton = toggleButtons.first()
      const firstButtonText = await firstButton.textContent()

      // Clicar no botão de toggle
      await firstButton.click()
      await page.waitForLoadState('networkidle')

      // Verificar que a view mudou
      const currentText = await firstButton.textContent()
      expect(currentText).not.toEqual(firstButtonText)
    }
  })

  test('Calendário ou Lista de férias está visível', async ({ authenticatedPage: page }) => {
    await page.goto('/ferias')

    await page.waitForLoadState('networkidle')

    // Verificar presença de calendário ou lista
    const calendar = page.locator('[role="presentation"], .calendar, [data-testid*="calendar"]')
    const list = page.locator('table, [role="grid"], .space-y-')

    const calendarVisible = await calendar.isVisible().catch(() => false)
    const listVisible = await list.isVisible().catch(() => false)

    expect(calendarVisible || listVisible).toBeTruthy()
  })
})
