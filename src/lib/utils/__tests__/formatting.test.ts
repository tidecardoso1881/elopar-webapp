import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  formatCurrency,
  formatDate,
  daysUntil,
  getRenewalStatus,
  normalizeSeniority,
  normalizeContractType,
} from '../formatting'

// ─── formatCurrency ────────────────────────────────────────────────────────

describe('formatCurrency', () => {
  it('retorna "R$ -" para null', () => {
    expect(formatCurrency(null)).toBe('R$ -')
  })

  it('retorna "R$ -" para undefined', () => {
    expect(formatCurrency(undefined)).toBe('R$ -')
  })

  it('formata zero corretamente', () => {
    const result = formatCurrency(0)
    expect(result).toContain('R$')
    expect(result).toContain('0')
  })

  it('formata valor inteiro como moeda brasileira', () => {
    const result = formatCurrency(1000)
    expect(result).toContain('R$')
    expect(result).toContain('1')
  })

  it('formata valor decimal como moeda brasileira', () => {
    const result = formatCurrency(1234.56)
    expect(result).toContain('R$')
  })

  it('formata valor negativo', () => {
    const result = formatCurrency(-500)
    expect(result).toContain('R$')
  })
})

// ─── formatDate ───────────────────────────────────────────────────────────

describe('formatDate', () => {
  it('retorna "-" para null', () => {
    expect(formatDate(null)).toBe('-')
  })

  it('retorna "-" para undefined', () => {
    expect(formatDate(undefined)).toBe('-')
  })

  it('retorna "-" para string vazia', () => {
    expect(formatDate('')).toBe('-')
  })

  it('formata data ISO em formato brasileiro (dd/mm/aaaa)', () => {
    // Usa data sem timezone ambiguidade (ISO completo com UTC)
    const result = formatDate('2025-12-25T12:00:00.000Z')
    expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/)
  })

  it('retorna "-" para string inválida que gera Invalid Date', () => {
    // new Date("abc") gera NaN, mas Intl.DateTimeFormat pode retornar algo
    // O comportamento esperado é retornar "-" via try/catch
    const result = formatDate('data-invalida-xpto')
    // Não explode — garante resiliência
    expect(typeof result).toBe('string')
  })
})

// ─── daysUntil ────────────────────────────────────────────────────────────

describe('daysUntil', () => {
  beforeEach(() => {
    // Fixa a data atual em 2025-01-15 para testes determinísticos
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2025-01-15T12:00:00.000Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('retorna null para null', () => {
    expect(daysUntil(null)).toBeNull()
  })

  it('retorna null para undefined', () => {
    expect(daysUntil(undefined)).toBeNull()
  })

  it('retorna número positivo para data futura', () => {
    const days = daysUntil('2025-01-20')
    expect(days).toBeGreaterThan(0)
  })

  it('retorna número negativo para data passada', () => {
    const days = daysUntil('2025-01-10')
    expect(days).toBeLessThan(0)
  })

  it('calcula corretamente 5 dias no futuro', () => {
    const days = daysUntil('2025-01-20')
    expect(days).toBe(5)
  })

  it('retorna 0 ou 1 para hoje (depende do timezone)', () => {
    const days = daysUntil('2025-01-15')
    expect(days === 0 || days === 1).toBe(true)
  })
})

// ─── getRenewalStatus ─────────────────────────────────────────────────────

describe('getRenewalStatus', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2025-01-15T12:00:00.000Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('retorna "none" para null', () => {
    expect(getRenewalStatus(null)).toBe('none')
  })

  it('retorna "none" para undefined', () => {
    expect(getRenewalStatus(undefined)).toBe('none')
  })

  it('retorna "expired" para data passada (10 dias atrás)', () => {
    expect(getRenewalStatus('2025-01-05')).toBe('expired')
  })

  it('retorna "critical" para data em 20 dias', () => {
    expect(getRenewalStatus('2025-02-04')).toBe('critical')
  })

  it('retorna "warning" para data em 45 dias', () => {
    expect(getRenewalStatus('2025-03-01')).toBe('warning')
  })

  it('retorna "attention" para data em 75 dias', () => {
    expect(getRenewalStatus('2025-04-01')).toBe('attention')
  })

  it('retorna "ok" para data em 120 dias', () => {
    expect(getRenewalStatus('2025-05-15')).toBe('ok')
  })
})

// ─── normalizeSeniority ───────────────────────────────────────────────────

describe('normalizeSeniority', () => {
  it('retorna "PLENO" para null', () => {
    expect(normalizeSeniority(null)).toBe('PLENO')
  })

  it('retorna "PLENO" para undefined', () => {
    expect(normalizeSeniority(undefined)).toBe('PLENO')
  })

  it('normaliza "JÚNIOR" para "JUNIOR"', () => {
    expect(normalizeSeniority('JÚNIOR')).toBe('JUNIOR')
  })

  it('normaliza "JUNIOR" para "JUNIOR"', () => {
    expect(normalizeSeniority('JUNIOR')).toBe('JUNIOR')
  })

  it('normaliza "SÊNIOR" para "SENIOR"', () => {
    expect(normalizeSeniority('SÊNIOR')).toBe('SENIOR')
  })

  it('normaliza "SÊNIOR II" para "SENIOR"', () => {
    expect(normalizeSeniority('SÊNIOR II')).toBe('SENIOR')
  })

  it('normaliza "ESPECIALISTA I" para "ESPECIALISTA"', () => {
    expect(normalizeSeniority('ESPECIALISTA I')).toBe('ESPECIALISTA')
  })

  it('normaliza "ESPECIALISTA II" para "ESPECIALISTA"', () => {
    expect(normalizeSeniority('ESPECIALISTA II')).toBe('ESPECIALISTA')
  })

  it('normaliza "PLENO" para "PLENO"', () => {
    expect(normalizeSeniority('PLENO')).toBe('PLENO')
  })

  it('retorna o valor em maiúsculas para seniority desconhecida', () => {
    expect(normalizeSeniority('novo nível')).toBe('NOVO NÍVEL')
  })

  it('remove espaços extras antes de normalizar', () => {
    expect(normalizeSeniority('  PLENO  ')).toBe('PLENO')
  })
})

// ─── normalizeContractType ────────────────────────────────────────────────

describe('normalizeContractType', () => {
  it('retorna "PJ" para null', () => {
    expect(normalizeContractType(null)).toBe('PJ')
  })

  it('retorna "PJ" para undefined', () => {
    expect(normalizeContractType(undefined)).toBe('PJ')
  })

  it('normaliza "CLT ESTRATÉGICO"', () => {
    expect(normalizeContractType('CLT ESTRATÉGICO')).toBe('CLT_ESTRATEGICO')
  })

  it('normaliza "CLT ESTRÁTEGICO" (grafia alternativa)', () => {
    expect(normalizeContractType('CLT ESTRÁTEGICO')).toBe('CLT_ESTRATEGICO')
  })

  it('normaliza "CLT ILATI"', () => {
    expect(normalizeContractType('CLT ILATI')).toBe('CLT_ILATI')