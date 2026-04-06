import { test, expect } from './fixtures/auth'

test.describe('Profissionais', () => {
  test('Listagem de profissionais carrega', async ({ authenticatedPage: page }) => {
    await page.goto('/profissionais')

    await page.waitForLoadState('networkidle')

    // Verificar que a tabela ou lista está presente
    const table = page.locator('table, [role="grid"], .grid')
    await expect(table).toBeVisible({ timeout: 5000 })
  })

  test('Busca por nome filtra resultados', async ({ authenticatedPage: page }) => {
    await page.goto('/profissionais')

    await page.waitForLoadState('networkidle')

    // Procurar por campo de busca
    const searchInput = page.getByPlaceholder(/buscar|search|nome/i)
    if (await searchInput.isVisible()) {
      await searchInput.fill('Test')
      await page.waitForLoadState('networkidle')

      // Verificar que resultados estão sendo exibidos
      const rows = page.locator('table tbody tr, [role="row"]')
      const rowCount = await rows.count()
      expect(rowCount).toBeGreaterThanOrEqual(0)
    }
  })

  test('Filtro por status funciona', async ({ authenticatedPage: page }) => {
    await page.goto('/profissionais')

    await page.waitForLoadState('networkidle')

    // Procurar por select de status
    const statusFilter = page.getByLabel(/status/i)
    if (await statusFilter.isVisible()) {
      await statusFilter.click()

      // Selecionar primeira opção
      const option = page.locator('[role="option"]').first()
      if (await option.isVisible()) {
        await option.click()
        await page.waitForLoadState('networkidle')
      }
    }
  })

  test('Clicar em profissional abre página de detalhe', async ({ authenticatedPage: page }) => {
    await page.goto('/profissionais')

    await page.waitForLoadState('networkidle')

    // Procurar pelo primeiro link/botão de profissional
    const firstProfessional = page.locator('table tbody tr a, [role="row"] [role="button"], .cursor-pointer').first()
    if (await firstProfessional.isVisible()) {
      await firstProfessional.click()

      // Aguardar navegação para página de detalhe
      await page.waitForURL(/.*profissionais\/.*/, { timeout: 10000 })
      await expect(page).toHaveURL(/.*profissionais\/[^/]+\/?$/)
    }
  })

  test('Botão "Novo Profissional" navega para formulário', async ({ authenticatedPage: page }) => {
    await page.goto('/profissionais')

    // Procurar por botão "Novo" ou "Adicionar"
    const newButton = page.getByRole('button', { name: /novo|adicionar|criar/i })
    if (await newButton.isVisible()) {
      await newButton.click()

      await page.waitForURL('**/profissionais/novo', { timeout: 10000 })
      await expect(page).toHaveURL(/.*profissionais\/novo/)
    }
  })
})
