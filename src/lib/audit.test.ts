import { describe, it, expect, vi, beforeEach } from 'vitest'

// ─── Mocks ────────────────────────────────────────────────────────────────────

const mockInsert = vi.fn()
const mockFrom = vi.fn(() => ({ insert: mockInsert }))
const mockGetUser = vi.fn()

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn().mockResolvedValue({
    auth: { getUser: mockGetUser },
  }),
}))

vi.mock('@/lib/supabase/admin', () => ({
  createAdminClient: vi.fn(() => ({ from: mockFrom })),
}))

// ─── Import after mocks ───────────────────────────────────────────────────────

const { logAudit } = await import('./audit')

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('logAudit', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockInsert.mockResolvedValue({ error: null })
  })

  it('inserts a CREATE record when user is authenticated', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-123' } } })

    const result = await logAudit({
      entidade: 'professional',
      entidade_id: 'prof-uuid',
      acao: 'CREATE',
      dados_antes: null,
      dados_depois: { name: 'João' },
    })

    expect(result.error).toBeUndefined()
    expect(mockFrom).toHaveBeenCalledWith('audit_log')
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: 'user-123',
        entidade: 'professional',
        entidade_id: 'prof-uuid',
        acao: 'CREATE',
        dados_antes: null,
        dados_depois: { name: 'João' },
      })
    )
  })

  it('returns error if user is not authenticated', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })

    const result = await logAudit({
      entidade: 'client',
      entidade_id: 'client-uuid',
      acao: 'DELETE',
    })

    expect(result.error).toContain('não autenticado')
    expect(mockInsert).not.toHaveBeenCalled()
  })

  it('returns error if supabase insert fails (non-throwing)', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-123' } } })
    mockInsert.mockResolvedValue({ error: { message: 'DB error' } })

    const result = await logAudit({
      entidade: 'equipment',
      entidade_id: 'eq-uuid',
      acao: 'UPDATE',
      dados_antes: { name: 'Old' },
      dados_depois: { name: 'New' },
    })

    expect(result.error).toBe('DB error')
  })

  it('defaults dados_antes and dados_depois to null if not provided', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-123' } } })

    await logAudit({ entidade: 'vacation', entidade_id: 'vac-uuid', acao: 'CREATE' })

    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({ dados_antes: null, dados_depois: null })
    )
  })
})
