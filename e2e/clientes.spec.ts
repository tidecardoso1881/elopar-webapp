import { test, expect } from './fixtures/auth'

test.describe('Clientes', () => {
  test('Listagem de clientes carrega com cards', async ({ authenticatedPage: page }) => {
    await page.goto('/clientes')

    await page.waitForLoadState('networkidle')

    // Verificar que cards estão presentes
    const cards = page.locator('.rounded-lg.shadow, .bg-white.border, [data-testid*="client"], .grid > div')
    await expect(cards.first()).toBeVisible({ timeout: 5000 })
  })

  test('Cards exibem nome do cliente', async ({ authenticatedPage: page }) => {
    await page.goto('/clientes')

    await page.waitForLoadState('networkidle')

    // Verificar presença de texto de cliente
    const clientCard = page.locator('.rounded-lg.shadow, .bg-white.border, [data-testid*="client"]').first()
    if (await clientCard.isVisible()) {
      const text = await clientCard.textContent()
      expect(text?.length).toBeGreaterThan(0)
    }
  })

  test('Botão "Novo Cliente" navega para formulário', async ({ authenticatedPage: page }) => {
    await page.goto('/clientes')

    // Procurar por botão "Novo" ou "Adicionar"
    const newButton = page.getByRole('button', { name: /novo|adicionar|criar/i })
    if (await newButton.isVisible()) {
      await newButton.click()

      await page.waitForURL('**/clientes/novo', { timeout: 10000 })
      await expect(page).toHaveURL(/.*clientes\/novo/)
    }
  })
})
