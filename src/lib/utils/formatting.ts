/**
 * Format a number as Brazilian Real currency
 */
export function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined) return 'R$ -'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

/**
 * Format a date string to Brazilian format (dd/mm/yyyy)
 */
export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '-'
  try {
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat('pt-BR').format(date)
  } catch {
    return '-'
  }
}

/**
 * Calculate days until a given date (positive = future, negative = past)
 */
export function daysUntil(dateStr: string | null | undefined): number | null {
  if (!dateStr) return null
  const target = new Date(dateStr)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diff = target.getTime() - today.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

/**
 * Validate if a renewal date is meaningful (>= 2000-01-01)
 * Dates before 2000 are treated as legacy/invalid data (BUG-01)
 */
export function isValidRenewalDate(dateStr: string | null | undefined): boolean {
  if (!dateStr) return false
  try {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return false
    return date.getFullYear() >= 2000
  } catch {
    return false
  }
}

/**
 * Get renewal urgency level based on days until expiration
 * Returns: 'expired' | 'critical' | 'warning' | 'attention' | 'ok' | 'none' | 'invalid'
 * 'invalid' = date before 2000 (legacy/bad data — BUG-01)
 */
export function getRenewalStatus(dateStr: string | null | undefined): 'expired' | 'critical' | 'warning' | 'attention' | 'ok' | 'none' | 'invalid' {
  if (!dateStr) return 'none'
  if (!isValidRenewalDate(dateStr)) return 'invalid'
  const days = daysUntil(dateStr)
  if (days === null) return 'none'
  if (days < 0) return 'expired'
  if (days <= 30) return 'critical'
  if (days <= 60) return 'warning'
  if (days <= 90) return 'attention'
  return 'ok'
}

/**
 * Format currency or return "Não informado" for null/zero values (ACESS-01)
 */
export function formatCurrencyOrEmpty(value: number | null | undefined): string {
  if (value === null || value === undefined || value === 0) return 'Não informado'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

/**
 * Calculate total billing: taxaHora * horasTrabalhadas (UX-03)
 */
export function calcularFaturamento(
  taxaHora: number | null | undefined,
  horasTrabalhadas: number | null | undefined
): number {
  if (!taxaHora || !horasTrabalhadas) return 0
  return taxaHora * horasTrabalhadas
}

/**
 * Normalize seniority values from spreadsheet inconsistencies
 */
export function normalizeSeniority(value: string | null | undefined): string {
  if (!value) return 'PLENO'
  const normalized = value.trim().toUpperCase()
  const map: Record<string, string> = {
    'JUNIOR': 'JUNIOR',
    'JÚNIOR': 'JUNIOR',
    'PLENO': 'PLENO',
    'SÊNIOR': 'SENIOR',
    'SÊNIOR II': 'SENIOR',
    'SENIOR': 'SENIOR',
    'ESPECIALISTA': 'ESPECIALISTA',
    'ESPECIALISTA I': 'ESPECIALISTA',
    'ESPECIALISTA II': 'ESPECIALISTA',
  }
  return map[normalized] ?? normalized
}

/**
 * Normalize contract type values
 */
export function normalizeContractType(value: string | null | undefined): string {
  if (!value) return 'PJ'
  const normalized = value.trim().toUpperCase()
  const map: Record<string, string> = {
    'CLT ESTRATÉGICO': 'CLT_ESTRATEGICO',
    'CLT ESTRÁTEGICO': 'CLT_ESTRATEGICO',
    'CLT ILAED': 'CLT_ILAED',
    'CLT ILATI': 'CLT_ILATI',
    'PJ': 'PJ',
  }
  return map[normalized] ?? normalized
}
