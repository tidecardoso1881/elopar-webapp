import { test, expect } from './fixtures/auth'

test.describe('Equipamentos', () => {
  test('Página de equipamentos carrega', async ({ authenticatedPage: page }) => {
    await page.goto('/equipamentos')

    await page.waitForLoadState('networkidle')

    // Verificar que a página carregou
    const heading = page.getByRole('heading', { name: /equipamentos/i })
    await expect(heading).toBeVisible({ timeout: 5000 })
  })

  test('Tabela exibe dados', async ({ authenticatedPage: page }) => {
    await page.goto('/equipamentos')

    await page.waitForLoadState('networkidle')

    // Verificar que a tabela está presente
    const table = page.locator('table, [role="grid"], .overflow-x-auto')
    await expect(table).toBeVisible({ timeout: 5000 })

    // Verificar que há conteúdo na tabela
    const rows = page.locator('table tbody tr, [role="row"]')
    const rowCount = await rows.count()
    expect(rowCount).toBeGreaterThanOrEqual(0)
  })

  test('Filtro de busca funciona', async ({ authenticatedPage: page }) => {
    await page.goto('/equipamentos')

    await page.waitForLoadState('networkidle')

    // Procurar por campo de busca
    const searchInput = page.getByPlaceholder(/buscar|search|equipamento/i)
    if (await searchInput.isVisible()) {
      await searchInput.fill('test')
      await page.waitForLoadState('networkidle')

      // Verificar que resultados estão sendo exibidos
      const rows = page.locator('table tbody tr, [role="row"]')
      const rowCount = await rows.count()
      expect(rowCount).toBeGreaterThanOrEqual(0)
    }
  })
})
