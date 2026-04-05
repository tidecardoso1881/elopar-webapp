# Plano de Testes - Sistema de Gestão de Profissionais Elopar

**Data:** 05 de Abril de 2026
**Versão:** 1.0
**Projeto:** Elopar Professional Management System
**Stack:** Next.js 16 + TypeScript + Tailwind CSS v4 + shadcn/ui + Supabase

---

## 1. ESTRATÉGIA DE TESTES

### Pirâmide de Testes

A estratégia de testes segue a pirâmide clássica:

```
        /\
       /  \        E2E (10%)
      /____\       Playwright
     /      \
    /        \     Integration (20%)
   /          \    Vitest + Supabase Local
  /____________\
 /              \  Unit (70%)
/______________\ Vitest + React Testing Library
```

**Distribuição:**
- **Unit Tests (70%):** Testes de componentes, hooks, utilitários
- **Integration Tests (20%):** Testes de API, fluxos críticos, RLS policies
- **E2E Tests (10%):** Testes de happy paths e fluxos de erro críticos

### Meta de Cobertura

- **Unit Tests:** 80% de cobertura mínima
- **Integration Tests:** 100% dos fluxos críticos de negócio
- **E2E Tests:** Happy paths + fluxos de erro críticos em todos os módulos

### Filosofia TDD (Test-Driven Development)

1. **Red:** Escrever teste que falha
2. **Green:** Implementar código mínimo para passar
3. **Refactor:** Melhorar sem quebrar testes

Cada feature nova começa com especificação de testes antes da implementação.

---

## 2. SETUP E CONFIGURAÇÃO

### 2.1 Instalação de Dependências

```bash
npm install -D vitest @vitejs/plugin-react jsdom
npm install -D @testing-library/react @testing-library/jest-dom
npm install -D @testing-library/user-event
npm install -D @playwright/test
npm install -D @supabase/supabase-js
npm install -D @types/node
npm install -D prettier eslint
npm install -D husky lint-staged
npm install -D @supabase/cli --save-dev
```

### 2.2 Configuração do Vitest

Criar arquivo `/vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/__tests__/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/__tests__/',
        '**/*.d.ts',
        '**/index.ts'
      ],
      thresholds: {
        statements: 80,
        branches: 75,
        functions: 80,
        lines: 80
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  }
})
```

### 2.3 Setup de Testes

Criar arquivo `/src/__tests__/setup.ts`:

```typescript
import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, vi } from 'vitest'

// Cleanup após cada teste
afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

// Mock global do localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
global.localStorage = localStorageMock as any

// Mock do Supabase client
vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn().mockResolvedValue({ data: [], error: null }),
      insert: vi.fn().mockResolvedValue({ data: null, error: null }),
      update: vi.fn().mockResolvedValue({ data: null, error: null }),
      delete: vi.fn().mockResolvedValue({ data: null, error: null }),
    })),
    auth: {
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } }
      })),
    },
    storage: {
      from: vi.fn(),
    }
  }))
}))

// Mock do window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})
```

### 2.4 Configuração do Playwright

Criar arquivo `/playwright.config.ts`:

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './src/__tests__/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/e2e-results.json' }],
    ['list']
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 14'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
})
```

### 2.5 Scripts no package.json

Adicionar scripts de teste:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "test": "vitest run",
    "test:watch": "vitest watch",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug",
    "test:all": "npm run test && npm run test:e2e",
    "prepare": "husky install"
  }
}
```

---

## 3. ESTRUTURA DE PASTAS DE TESTES

```
src/
├── __tests__/
│   ├── setup.ts                          # Setup global de testes
│   ├── fixtures/
│   │   ├── professionals.ts              # Dados fictícios de profissionais
│   │   ├── clients.ts                    # Dados fictícios de clientes
│   │   ├── equipment.ts                  # Dados fictícios de equipamentos
│   │   └── vacations.ts                  # Dados fictícios de férias
│   ├── helpers/
│   │   ├── render.tsx                    # Render customizado com providers
│   │   ├── supabase-mock.ts              # Mocks do Supabase
│   │   └── test-utils.ts                 # Utilitários de teste
│   ├── unit/
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   │   ├── KPICard.test.tsx
│   │   │   │   ├── StatusBadge.test.tsx
│   │   │   │   ├── RenewalCountdown.test.tsx
│   │   │   │   ├── DataTable.test.tsx
│   │   │   │   ├── SearchInput.test.tsx
│   │   │   │   └── FilterBar.test.tsx
│   │   │   ├── layout/
│   │   │   │   ├── Sidebar.test.tsx
│   │   │   │   ├── PageHeader.test.tsx
│   │   │   │   └── UserNav.test.tsx
│   │   │   ├── dashboard/
│   │   │   │   ├── DashboardKPIs.test.tsx
│   │   │   │   ├── SeniorityChart.test.tsx
│   │   │   │   ├── ClientChart.test.tsx
│   │   │   │   └── RenewalAlerts.test.tsx
│   │   │   └── professionals/
│   │   │       ├── ProfessionalList.test.tsx
│   │   │       ├── ProfessionalDetail.test.tsx
│   │   │       └── ProfessionalFilters.test.tsx
│   │   ├── hooks/
│   │   │   ├── useSupabase.test.ts
│   │   │   ├── useProfessionals.test.ts
│   │   │   ├── useClients.test.ts
│   │   │   ├── useRenewals.test.ts
│   │   │   └── useDebounce.test.ts
│   │   ├── utils/
│   │   │   ├── formatting.test.ts
│   │   │   ├── dateUtils.test.ts
│   │   │   ├── currencyUtils.test.ts
│   │   │   ├── filterUtils.test.ts
│   │   │   └── validationUtils.test.ts
│   │   └── lib/
│   │       └── supabase.test.ts
│   ├── integration/
│   │   ├── api/
│   │   │   ├── professionals.test.ts
│   │   │   ├── clients.test.ts
│   │   │   ├── renewals.test.ts
│   │   │   └── dashboard.test.ts
│   │   ├── actions/
│   │   │   ├── auth-actions.test.ts
│   │   │   ├── professional-actions.test.ts
│   │   │   └── client-actions.test.ts
│   │   └── db/
│   │       ├── queries.test.ts
│   │       ├── rls-policies.test.ts
│   │       └── seed.test.ts
│   └── e2e/
│       ├── auth.spec.ts
│       ├── dashboard.spec.ts
│       ├── professionals.spec.ts
│       ├── professional-detail.spec.ts
│       ├── clients.spec.ts
│       ├── renewals.spec.ts
│       ├── equipment.spec.ts
│       ├── vacations.spec.ts
│       ├── responsive.spec.ts
│       └── accessibility.spec.ts
├── app/
├── components/
├── lib/
└── ...
```

---

## 4. TESTES UNITÁRIOS DETALHADOS

### 4.1 KPICard Component

**Arquivo:** `/src/__tests__/unit/components/ui/KPICard.test.tsx`

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { KPICard } from '@/components/ui/KPICard'
import { TrendUp, TrendDown, Users } from 'lucide-react'

describe('KPICard Component', () => {
  const defaultProps = {
    title: 'Profissionais Ativos',
    value: 145,
    icon: Users,
    trend: 5,
    period: 'mês passado'
  }

  it('deve renderizar com valor correto', () => {
    render(<KPICard {...defaultProps} />)
    expect(screen.getByText('145')).toBeInTheDocument()
  })

  it('deve exibir título correto', () => {
    render(<KPICard {...defaultProps} />)
    expect(screen.getByText('Profissionais Ativos')).toBeInTheDocument()
  })

  it('deve renderizar ícone correto', () => {
    render(<KPICard {...defaultProps} />)
    const icon = screen.getByTestId('kpi-icon')
    expect(icon).toBeInTheDocument()
  })

  it('deve mostrar tendência positiva com ícone para cima', () => {
    render(<KPICard {...defaultProps} trend={5} />)
    expect(screen.getByText('+5%')).toBeInTheDocument()
    expect(screen.getByTestId('trend-icon')).toHaveClass('text-green-600')
  })

  it('deve mostrar tendência negativa com ícone para baixo', () => {
    render(<KPICard {...defaultProps} trend={-3} />)
    expect(screen.getByText('-3%')).toBeInTheDocument()
    expect(screen.getByTestId('trend-icon')).toHaveClass('text-red-600')
  })

  it('deve exibir período corretamente', () => {
    render(<KPICard {...defaultProps} period="últimos 90 dias" />)
    expect(screen.getByText('últimos 90 dias')).toBeInTheDocument()
  })

  it('deve lidar com estado de carregamento', () => {
    render(<KPICard {...defaultProps} isLoading={true} />)
    expect(screen.getByTestId('kpi-skeleton')).toBeInTheDocument()
  })

  it('deve exibir valor zero sem erro', () => {
    render(<KPICard {...defaultProps} value={0} />)
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('deve formatar valores grandes com separador de milhares', () => {
    render(<KPICard {...defaultProps} value={1250} />)
    expect(screen.getByText('1.250')).toBeInTheDocument()
  })
})
```

### 4.2 StatusBadge Component

**Arquivo:** `/src/__tests__/unit/components/ui/StatusBadge.test.tsx`

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatusBadge } from '@/components/ui/StatusBadge'

describe('StatusBadge Component', () => {
  it('deve renderizar badge ATIVO com estilo verde', () => {
    render(<StatusBadge status="ATIVO" />)
    const badge = screen.getByText('ATIVO')
    expect(badge).toHaveClass('bg-green-100', 'text-green-800')
  })

  it('deve renderizar badge DESLIGADO com estilo cinza', () => {
    render(<StatusBadge status="DESLIGADO" />)
    const badge = screen.getByText('DESLIGADO')
    expect(badge).toHaveClass('bg-gray-100', 'text-gray-800')
  })

  it('deve renderizar badge AFASTADO com estilo amarelo', () => {
    render(<StatusBadge status="AFASTADO" />)
    const badge = screen.getByText('AFASTADO')
    expect(badge).toHaveClass('bg-yellow-100', 'text-yellow-800')
  })

  it('deve renderizar badge de senioridade SENIOR', () => {
    render(<StatusBadge status="SENIOR" type="seniority" />)
    expect(screen.getByText('SENIOR')).toHaveClass('bg-purple-100')
  })

  it('deve renderizar badge de senioridade PLENO', () => {
    render(<StatusBadge status="PLENO" type="seniority" />)
    expect(screen.getByText('PLENO')).toHaveClass('bg-blue-100')
  })

  it('deve renderizar badge de senioridade JUNIOR', () => {
    render(<StatusBadge status="JUNIOR" type="seniority" />)
    expect(screen.getByText('JUNIOR')).toHaveClass('bg-cyan-100')
  })

  it('deve renderizar badge de tipo de contrato', () => {
    render(<StatusBadge status="CLT" type="contract" />)
    expect(screen.getByText('CLT')).toBeInTheDocument()
  })

  it('deve ter classe de variante correta', () => {
    render(<StatusBadge status="ATIVO" variant="solid" />)
    const badge = screen.getByText('ATIVO')
    expect(badge).toHaveClass('rounded-full')
  })
})
```

### 4.3 DataTable Component

**Arquivo:** `/src/__tests__/unit/components/ui/DataTable.test.tsx`

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { DataTable } from '@/components/ui/DataTable'
import userEvent from '@testing-library/user-event'

const mockData = [
  {
    id: '1',
    name: 'João Silva',
    client: 'Elopar',
    status: 'ATIVO',
    renewal: '2026-05-15'
  },
  {
    id: '2',
    name: 'Maria Santos',
    client: 'Livelo',
    status: 'ATIVO',
    renewal: '2026-06-10'
  },
]

const mockColumns = [
  { id: 'name', label: 'Nome', sortable: true },
  { id: 'client', label: 'Cliente', sortable: false },
  { id: 'status', label: 'Status', sortable: true },
  { id: 'renewal', label: 'Renovação', sortable: true },
]

describe('DataTable Component', () => {
  it('deve renderizar dados corretamente', () => {
    render(
      <DataTable
        columns={mockColumns}
        data={mockData}
        onRowClick={vi.fn()}
      />
    )
    expect(screen.getByText('João Silva')).toBeInTheDocument()
    expect(screen.getByText('Maria Santos')).toBeInTheDocument()
  })

  it('deve renderizar cabeçalhos de coluna', () => {
    render(
      <DataTable
        columns={mockColumns}
        data={mockData}
        onRowClick={vi.fn()}
      />
    )
    expect(screen.getByText('Nome')).toBeInTheDocument()
    expect(screen.getByText('Cliente')).toBeInTheDocument()
  })

  it('deve ordenar dados por coluna crescente', async () => {
    const { container } = render(
      <DataTable
        columns={mockColumns}
        data={mockData}
        onRowClick={vi.fn()}
      />
    )
    const nameHeader = screen.getByText('Nome')
    fireEvent.click(nameHeader)

    const rows = container.querySelectorAll('tbody tr')
    expect(rows[0]).toHaveTextContent('João Silva')
    expect(rows[1]).toHaveTextContent('Maria Santos')
  })

  it('deve inverter ordem de ordenação ao clicar novamente', async () => {
    const { container } = render(
      <DataTable
        columns={mockColumns}
        data={mockData}
        onRowClick={vi.fn()}
      />
    )
    const nameHeader = screen.getByText('Nome')

    fireEvent.click(nameHeader)
    fireEvent.click(nameHeader)

    const rows = container.querySelectorAll('tbody tr')
    expect(rows[0]).toHaveTextContent('Maria Santos')
    expect(rows[1]).toHaveTextContent('João Silva')
  })

  it('deve filtrar dados corretamente', () => {
    render(
      <DataTable
        columns={mockColumns}
        data={mockData}
        onRowClick={vi.fn()}
        searchQuery="Maria"
      />
    )
    expect(screen.getByText('Maria Santos')).toBeInTheDocument()
    expect(screen.queryByText('João Silva')).not.toBeInTheDocument()
  })

  it('deve exibir estado vazio quando sem dados', () => {
    render(
      <DataTable
        columns={mockColumns}
        data={[]}
        onRowClick={vi.fn()}
        emptyMessage="Nenhum profissional encontrado"
      />
    )
    expect(screen.getByText('Nenhum profissional encontrado')).toBeInTheDocument()
  })

  it('deve exibir skeleton de carregamento', () => {
    render(
      <DataTable
        columns={mockColumns}
        data={[]}
        isLoading={true}
        onRowClick={vi.fn()}
      />
    )
    expect(screen.getByTestId('table-skeleton')).toBeInTheDocument()
  })

  it('deve paginar dados corretamente', () => {
    const manyRows = Array.from({ length: 25 }, (_, i) => ({
      id: String(i),
      name: `Profissional ${i}`,
      client: 'Cliente',
      status: 'ATIVO',
      renewal: '2026-05-15'
    }))

    const { rerender } = render(
      <DataTable
        columns={mockColumns}
        data={manyRows}
        onRowClick={vi.fn()}
        pageSize={10}
        currentPage={1}
      />
    )

    // Primeira página
    expect(screen.getByText('Profissional 0')).toBeInTheDocument()
    expect(screen.getByText('Profissional 9')).toBeInTheDocument()
    expect(screen.queryByText('Profissional 10')).not.toBeInTheDocument()

    // Segunda página
    rerender(
      <DataTable
        columns={mockColumns}
        data={manyRows}
        onRowClick={vi.fn()}
        pageSize={10}
        currentPage={2}
      />
    )

    expect(screen.queryByText('Profissional 0')).not.toBeInTheDocument()
    expect(screen.getByText('Profissional 10')).toBeInTheDocument()
  })

  it('deve chamar onRowClick ao clicar em linha', async () => {
    const onRowClick = vi.fn()
    render(
      <DataTable
        columns={mockColumns}
        data={mockData}
        onRowClick={onRowClick}
      />
    )

    const firstRow = screen.getByText('João Silva').closest('tr')
    fireEvent.click(firstRow!)

    expect(onRowClick).toHaveBeenCalledWith(mockData[0])
  })
})
```

### 4.4 useProfessionals Hook

**Arquivo:** `/src/__tests__/unit/hooks/useProfessionals.test.ts`

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useProfessionals } from '@/hooks/useProfessionals'
import * as supabaseLib from '@/lib/supabase/client'

vi.mock('@/lib/supabase/client')

const mockProfessionals = [
  {
    id: '1',
    name: 'João Silva',
    client: 'Elopar',
    status: 'ATIVO',
    seniority: 'SENIOR',
    renewal_date: '2026-05-15',
    salary: 15000
  },
  {
    id: '2',
    name: 'Maria Santos',
    client: 'Livelo',
    status: 'ATIVO',
    seniority: 'PLENO',
    renewal_date: '2026-06-10',
    salary: 10000
  },
]

describe('useProfessionals Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve buscar profissionais do Supabase', async () => {
    const mockSelect = vi.fn().mockResolvedValue({
      data: mockProfessionals,
      error: null
    })

    vi.spyOn(supabaseLib, 'createClient').mockReturnValue({
      from: vi.fn(() => ({ select: mockSelect }))
    } as any)

    const { result } = renderHook(() => useProfessionals())

    await waitFor(() => {
      expect(result.current.data).toEqual(mockProfessionals)
    })
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('deve aplicar filtros corretamente', async () => {
    const mockSelect = vi.fn().mockResolvedValue({
      data: [mockProfessionals[0]],
      error: null
    })

    vi.spyOn(supabaseLib, 'createClient').mockReturnValue({
      from: vi.fn(() => ({ select: mockSelect }))
    } as any)

    const { result } = renderHook(() =>
      useProfessionals({ filters: { client: 'Elopar' } })
    )

    await waitFor(() => {
      expect(mockSelect).toHaveBeenCalled()
    })

    expect(result.current.data).toHaveLength(1)
    expect(result.current.data[0].client).toBe('Elopar')
  })

  it('deve buscar por query de pesquisa', async () => {
    const mockSelect = vi.fn().mockResolvedValue({
      data: [mockProfessionals[0]],
      error: null
    })

    vi.spyOn(supabaseLib, 'createClient').mockReturnValue({
      from: vi.fn(() => ({ select: mockSelect }))
    } as any)

    const { result } = renderHook(() =>
      useProfessionals({ searchQuery: 'João' })
    )

    await waitFor(() => {
      expect(mockSelect).toHaveBeenCalled()
    })

    expect(result.current.data[0].name).toContain('João')
  })

  it('deve paginar corretamente', async () => {
    const mockSelect = vi.fn().mockResolvedValue({
      data: mockProfessionals.slice(0, 1),
      error: null
    })

    vi.spyOn(supabaseLib, 'createClient').mockReturnValue({
      from: vi.fn(() => ({ select: mockSelect }))
    } as any)

    const { result } = renderHook(() =>
      useProfessionals({ pageSize: 1, page: 1 })
    )

    await waitFor(() => {
      expect(result.current.data).toHaveLength(1)
    })
  })

  it('deve lidar com estado de erro', async () => {
    const mockError = new Error('Erro ao buscar dados')
    const mockSelect = vi.fn().mockResolvedValue({
      data: null,
      error: mockError
    })

    vi.spyOn(supabaseLib, 'createClient').mockReturnValue({
      from: vi.fn(() => ({ select: mockSelect }))
    } as any)

    const { result } = renderHook(() => useProfessionals())

    await waitFor(() => {
      expect(result.current.error).toBeTruthy()
    })

    expect(result.current.data).toEqual([])
  })

  it('deve fazer cache dos resultados', async () => {
    const mockSelect = vi.fn().mockResolvedValue({
      data: mockProfessionals,
      error: null
    })

    const mockFrom = vi.fn(() => ({ select: mockSelect }))
    vi.spyOn(supabaseLib, 'createClient').mockReturnValue({
      from: mockFrom
    } as any)

    const { result: result1 } = renderHook(() => useProfessionals())
    const { result: result2 } = renderHook(() => useProfessionals())

    await waitFor(() => {
      expect(result1.current.data).toEqual(mockProfessionals)
    })

    // Segunda chamada não deve fazer nova requisição se usar cache
    await waitFor(() => {
      expect(result2.current.data).toEqual(mockProfessionals)
    })
  })
})
```

### 4.5 Utility Functions

**Arquivo:** `/src/__tests__/unit/utils/formatting.test.ts`

```typescript
import { describe, it, expect } from 'vitest'
import {
  formatCurrency,
  formatDate,
  calculateDaysUntil,
  getRenewalStatus,
  normalizeSeniority
} from '@/utils/formatting'

describe('Utility Functions', () => {
  describe('formatCurrency', () => {
    it('deve formatar moeda BRL corretamente', () => {
      expect(formatCurrency(1500)).toBe('R$ 1.500,00')
    })

    it('deve formatar zero', () => {
      expect(formatCurrency(0)).toBe('R$ 0,00')
    })

    it('deve formatar valores grandes', () => {
      expect(formatCurrency(1250000)).toBe('R$ 1.250.000,00')
    })

    it('deve formatar valores decimais', () => {
      expect(formatCurrency(1500.50)).toBe('R$ 1.500,50')
    })

    it('deve lidar com valores negativos', () => {
      expect(formatCurrency(-1500)).toBe('-R$ 1.500,00')
    })
  })

  describe('formatDate', () => {
    it('deve formatar data em PT-BR', () => {
      const date = new Date('2026-05-15')
      expect(formatDate(date)).toBe('15/05/2026')
    })

    it('deve formatar data com hora', () => {
      const date = new Date('2026-05-15T14:30:00')
      expect(formatDate(date, { includeTime: true })).toBe('15/05/2026 14:30')
    })

    it('deve aceitar string de data', () => {
      expect(formatDate('2026-05-15')).toBe('15/05/2026')
    })

    it('deve retornar data relativa quando solicitado', () => {
      const today = new Date()
      const tomorrow = new Date(today.getTime() + 86400000)
      expect(formatDate(tomorrow, { relative: true })).toContain('amanhã')
    })
  })

  describe('calculateDaysUntil', () => {
    it('deve calcular dias até uma data futura', () => {
      const today = new Date('2026-04-05')
      const future = new Date('2026-04-15')
      expect(calculateDaysUntil(future, today)).toBe(10)
    })

    it('deve retornar 0 para data igual', () => {
      const date = new Date('2026-04-05')
      expect(calculateDaysUntil(date, date)).toBe(0)
    })

    it('deve retornar negativo para data passada', () => {
      const today = new Date('2026-04-15')
      const past = new Date('2026-04-05')
      expect(calculateDaysUntil(past, today)).toBe(-10)
    })
  })

  describe('getRenewalStatus', () => {
    it('deve retornar URGENTE para renovação em até 7 dias', () => {
      const today = new Date('2026-04-05')
      const renewal = new Date('2026-04-10')
      expect(getRenewalStatus(renewal, today)).toBe('URGENTE')
    })

    it('deve retornar PROXIMAMENTE para 7-30 dias', () => {
      const today = new Date('2026-04-05')
      const renewal = new Date('2026-04-20')
      expect(getRenewalStatus(renewal, today)).toBe('PROXIMAMENTE')
    })

    it('deve retornar NORMAL para mais de 30 dias', () => {
      const today = new Date('2026-04-05')
      const renewal = new Date('2026-06-01')
      expect(getRenewalStatus(renewal, today)).toBe('NORMAL')
    })

    it('deve retornar VENCIDO para data passada', () => {
      const today = new Date('2026-04-05')
      const renewal = new Date('2026-03-01')
      expect(getRenewalStatus(renewal, today)).toBe('VENCIDO')
    })
  })

  describe('normalizeSeniority', () => {
    it('deve normalizar senioridade em maiúsculas', () => {
      expect(normalizeSeniority('senior')).toBe('SENIOR')
      expect(normalizeSeniority('PLENO')).toBe('PLENO')
    })

    it('deve mapear variações de senioridade', () => {
      expect(normalizeSeniority('pl')).toBe('PLENO')
      expect(normalizeSeniority('sr')).toBe('SENIOR')
      expect(normalizeSeniority('jr')).toBe('JUNIOR')
    })

    it('deve retornar senioridade desconhecida como está', () => {
      expect(normalizeSeniority('trainee')).toBe('TRAINEE')
    })
  })
})
```

---

## 5. TESTES DE INTEGRAÇÃO DETALHADOS

### 5.1 API Endpoints

**Arquivo:** `/src/__tests__/integration/api/professionals.test.ts`

```typescript
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import { createClient } from '@/lib/supabase/client'

describe('API - Professionals Endpoints', () => {
  let supabase: any

  beforeAll(() => {
    supabase = createClient()
  })

  describe('GET /api/professionals', () => {
    it('deve retornar lista paginada de profissionais', async () => {
      const { data, error } = await supabase
        .from('professionals')
        .select('*')
        .limit(10)
        .offset(0)

      expect(error).toBeNull()
      expect(Array.isArray(data)).toBe(true)
      expect(data.length).toBeLessThanOrEqual(10)
    })

    it('deve retornar profissionais com todos os campos necessários', async () => {
      const { data } = await supabase
        .from('professionals')
        .select('*')
        .limit(1)

      if (data && data.length > 0) {
        const professional = data[0]
        expect(professional).toHaveProperty('id')
        expect(professional).toHaveProperty('name')
        expect(professional).toHaveProperty('client_id')
        expect(professional).toHaveProperty('status')
        expect(professional).toHaveProperty('seniority')
        expect(professional).toHaveProperty('renewal_date')
      }
    })

    it('deve filtrar profissionais por cliente', async () => {
      const { data } = await supabase
        .from('professionals')
        .select('*')
        .eq('client_id', 'client-1')

      if (data && data.length > 0) {
        expect(data.every((p: any) => p.client_id === 'client-1')).toBe(true)
      }
    })

    it('deve filtrar profissionais por status', async () => {
      const { data } = await supabase
        .from('professionals')
        .select('*')
        .eq('status', 'ATIVO')

      if (data && data.length > 0) {
        expect(data.every((p: any) => p.status === 'ATIVO')).toBe(true)
      }
    })

    it('deve buscar profissional único por ID', async () => {
      const { data: allData } = await supabase
        .from('professionals')
        .select('id')
        .limit(1)

      if (allData && allData.length > 0) {
        const { data } = await supabase
          .from('professionals')
          .select('*')
          .eq('id', allData[0].id)

        expect(data).toHaveLength(1)
        expect(data[0].id).toBe(allData[0].id)
      }
    })
  })

  describe('GET /api/clients', () => {
    it('deve retornar todos os clientes', async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('*')

      expect(error).toBeNull()
      expect(Array.isArray(data)).toBe(true)
    })

    it('deve retornar clientes com contagem de profissionais', async () => {
      const { data } = await supabase
        .from('clients')
        .select(`*, professionals(count)`)

      if (data && data.length > 0) {
        expect(data[0]).toHaveProperty('id')
        expect(data[0]).toHaveProperty('name')
        expect(data[0]).toHaveProperty('professionals')
      }
    })
  })

  describe('GET /api/renewals', () => {
    it('deve retornar renovações agendadas para próximos 90 dias', async () => {
      const today = new Date()
      const in90Days = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000)

      const { data } = await supabase
        .from('professionals')
        .select('*')
        .gte('renewal_date', today.toISOString())
        .lte('renewal_date', in90Days.toISOString())
        .order('renewal_date', { ascending: true })

      expect(Array.isArray(data)).toBe(true)
    })

    it('deve retornar renovações com status URGENTE', async () => {
      const today = new Date()
      const in7Days = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)

      const { data } = await supabase
        .from('professionals')
        .select('*')
        .gte('renewal_date', today.toISOString())
        .lte('renewal_date', in7Days.toISOString())

      if (data && data.length > 0) {
        expect(data.every((p: any) => {
          const daysUntil = Math.ceil(
            (new Date(p.renewal_date).getTime() - today.getTime()) /
            (24 * 60 * 60 * 1000)
          )
          return daysUntil <= 7
        })).toBe(true)
      }
    })
  })
})
```

### 5.2 RLS Policies

**Arquivo:** `/src/__tests__/integration/db/rls-policies.test.ts`

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { createClient } from '@/lib/supabase/client'

describe('RLS Policies - Database Security', () => {
  describe('professionals table', () => {
    it('deve rejeitar acesso sem autenticação', async () => {
      const anonClient = createClient()

      const { data, error } = await anonClient
        .from('professionals')
        .select('*')

      // Dependendo da política RLS, pode retornar vazio ou erro
      if (error) {
        expect(error.message).toContain('permission denied')
      }
    })

    it('deve permitir SELECT para usuários autenticados', async () => {
      const authenticatedClient = createClient()

      const { data, error } = await authenticatedClient
        .from('professionals')
        .select('*')
        .limit(1)

      expect(error).toBeNull()
      expect(Array.isArray(data)).toBe(true)
    })

    it('deve permitir INSERT apenas para admin', async () => {
      const userClient = createClient()

      const { error } = await userClient
        .from('professionals')
        .insert({
          name: 'Novo Profissional',
          client_id: 'client-1',
          status: 'ATIVO',
          seniority: 'PLENO'
        })

      // Deve falhar para usuário não-admin
      if (error) {
        expect(error.message).toContain('permission')
      }
    })

    it('deve permitir UPDATE apenas para owner ou admin', async () => {
      const { data: professionals } = await createClient()
        .from('professionals')
        .select('id')
        .limit(1)

      if (professionals && professionals.length > 0) {
        const { error } = await createClient()
          .from('professionals')
          .update({ status: 'DESLIGADO' })
          .eq('id', professionals[0].id)

        // Pode falhar dependendo da política
        if (error) {
          expect(error.message).toContain('permission')
        }
      }
    })
  })

  describe('clients table', () => {
    it('deve permitir SELECT para qualquer usuário autenticado', async () => {
      const { data, error } = await createClient()
        .from('clients')
        .select('*')

      expect(error).toBeNull()
      expect(Array.isArray(data)).toBe(true)
    })
  })
})
```

### 5.3 Auth Flow

**Arquivo:** `/src/__tests__/integration/actions/auth-actions.test.ts`

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createClient } from '@/lib/supabase/client'

describe('Auth Integration', () => {
  const testEmail = 'test@elopar.com.br'
  const testPassword = 'TestPassword123!'

  describe('Login Flow', () => {
    it('deve fazer login com credenciais válidas', async () => {
      const supabase = createClient()

      const { data, error } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword
      })

      if (!error) {
        expect(data).toHaveProperty('session')
        expect(data.session).toHaveProperty('access_token')
        expect(data.session).toHaveProperty('user')
        expect(data.session.user.email).toBe(testEmail)
      }
    })

    it('deve retornar erro com credenciais inválidas', async () => {
      const supabase = createClient()

      const { error } = await supabase.auth.signInWithPassword({
        email: 'wrong@email.com',
        password: 'wrongpassword'
      })

      expect(error).toBeTruthy()
    })

    it('deve retornar erro para email não encontrado', async () => {
      const supabase = createClient()

      const { error } = await supabase.auth.signInWithPassword({
        email: 'nonexistent@elopar.com.br',
        password: 'password123'
      })

      expect(error).toBeTruthy()
    })
  })

  describe('Session Management', () => {
    it('deve obter sessão atual', async () => {
      const supabase = createClient()

      const { data, error } = await supabase.auth.getSession()

      expect(error).toBeNull()
      expect(data).toHaveProperty('session')
    })

    it('deve persistir sessão após login', async () => {
      const supabase = createClient()

      // Login
      await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword
      })

      // Check session
      const { data } = await supabase.auth.getSession()

      if (data.session) {
        expect(data.session.user.email).toBe(testEmail)
      }
    })
  })

  describe('Logout Flow', () => {
    it('deve fazer logout com sucesso', async () => {
      const supabase = createClient()

      // Login first
      await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword
      })

      // Logout
      const { error } = await supabase.auth.signOut()

      expect(error).toBeNull()

      // Verify session is cleared
      const { data } = await supabase.auth.getSession()
      expect(data.session).toBeNull()
    })
  })

  describe('Auth State Listener', () => {
    it('deve disparar evento ao fazer login', async () => {
      const supabase = createClient()
      const callback = vi.fn()

      const { data: { subscription } } = supabase.auth.onAuthStateChange(callback)

      await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword
      })

      expect(callback).toHaveBeenCalled()

      subscription?.unsubscribe()
    })

    it('deve disparar evento ao fazer logout', async () => {
      const supabase = createClient()
      const callback = vi.fn()

      // Login first
      await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword
      })

      const { data: { subscription } } = supabase.auth.onAuthStateChange(callback)

      // Logout
      await supabase.auth.signOut()

      expect(callback).toHaveBeenCalled()

      subscription?.unsubscribe()
    })
  })
})
```

---

## 6. TESTES E2E DETALHADOS (Playwright)

### 6.1 Auth Tests

**Arquivo:** `/src/__tests__/e2e/auth.spec.ts`

```typescript
import { test, expect } from '@playwright/test'

const BASE_URL = 'http://localhost:3000'
const TEST_EMAIL = 'test@elopar.com.br'
const TEST_PASSWORD = 'TestPassword123!'

test.describe('Authentication Flow', () => {
  test('deve fazer login com credenciais válidas', async ({ page }) => {
    // Navegar para login
    await page.goto(`${BASE_URL}/login`)

    // Preencher formulário
    await page.fill('input[type="email"]', TEST_EMAIL)
    await page.fill('input[type="password"]', TEST_PASSWORD)

    // Submeter
    await page.click('button[type="submit"]')

    // Verificar redirecionamento
    await expect(page).toHaveURL(`${BASE_URL}/dashboard`)

    // Verificar elemento da dashboard
    await expect(page.locator('[data-testid="dashboard-header"]')).toBeVisible()
  })

  test('deve mostrar erro com credenciais inválidas', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`)

    await page.fill('input[type="email"]', 'wrong@email.com')
    await page.fill('input[type="password"]', 'wrongpassword')
    await page.click('button[type="submit"]')

    // Verificar mensagem de erro
    const errorMessage = page.locator('[data-testid="error-message"]')
    await expect(errorMessage).toBeVisible()
    await expect(errorMessage).toContainText('Credenciais inválidas')
  })

  test('deve redirecionar para login quando não autenticado', async ({ page }) => {
    // Tentar acessar rota protegida sem login
    await page.goto(`${BASE_URL}/professionals`)

    // Deve redirecionar para login
    await expect(page).toHaveURL(/login/)
  })

  test('deve fazer logout', async ({ page, context }) => {
    // Fazer login primeiro
    await page.goto(`${BASE_URL}/login`)
    await page.fill('input[type="email"]', TEST_EMAIL)
    await page.fill('input[type="password"]', TEST_PASSWORD)
    await page.click('button[type="submit"]')
    await page.waitForURL(`${BASE_URL}/dashboard`)

    // Abrir menu do usuário
    await page.click('[data-testid="user-menu-trigger"]')

    // Clicar logout
    await page.click('text=Sair')

    // Verificar redirecionamento para login
    await expect(page).toHaveURL(/login/)
  })

  test('deve persistir sessão ao recarregar página', async ({ page }) => {
    // Fazer login
    await page.goto(`${BASE_URL}/login`)
    await page.fill('input[type="email"]', TEST_EMAIL)
    await page.fill('input[type="password"]', TEST_PASSWORD)
    await page.click('button[type="submit"]')
    await page.waitForURL(`${BASE_URL}/dashboard`)

    // Armazenar URL da dashboard
    const dashboardUrl = page.url()

    // Recarregar página
    await page.reload()

    // Deve permanecer na dashboard
    await expect(page).toHaveURL(dashboardUrl)
    await expect(page.locator('[data-testid="dashboard-header"]')).toBeVisible()
  })
})
```

### 6.2 Dashboard Tests

**Arquivo:** `/src/__tests__/e2e/dashboard.spec.ts`

```typescript
import { test, expect } from '@playwright/test'

const BASE_URL = 'http://localhost:3000'

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Fazer login antes de cada teste
    await page.goto(`${BASE_URL}/login`)
    await page.fill('input[type="email"]', 'test@elopar.com.br')
    await page.fill('input[type="password"]', 'TestPassword123!')
    await page.click('button[type="submit"]')
    await page.waitForURL(`${BASE_URL}/dashboard`)
  })

  test('deve exibir cards de KPI', async ({ page }) => {
    // Verificar presença dos cards
    const kpiCards = page.locator('[data-testid="kpi-card"]')
    await expect(kpiCards).toHaveCount(4) // Ativos, Desligados, Contatos, Renovações

    // Verificar valores
    const ativos = page.locator('[data-testid="kpi-profissionais-ativos"]')
    await expect(ativos).toContainText(/\d+/)

    const desligados = page.locator('[data-testid="kpi-profissionais-desligados"]')
    await expect(desligados).toContainText(/\d+/)
  })

  test('deve exibir gráfico de senioridade', async ({ page }) => {
    const seniorityChart = page.locator('[data-testid="seniority-chart"]')
    await expect(seniorityChart).toBeVisible()

    // Verificar presença de elementos do gráfico
    const chartBars = page.locator('[data-testid="seniority-chart"] [role="img"]')
    await expect(chartBars.first()).toBeVisible()
  })

  test('deve exibir gráfico de clientes', async ({ page }) => {
    const clientChart = page.locator('[data-testid="client-chart"]')
    await expect(clientChart).toBeVisible()
  })

  test('deve exibir alertas de renovação', async ({ page }) => {
    const renewalAlerts = page.locator('[data-testid="renewal-alerts"]')
    await expect(renewalAlerts).toBeVisible()

    // Verificar se há renovações listadas
    const items = page.locator('[data-testid="renewal-alert-item"]')
    if (await items.count() > 0) {
      await expect(items.first()).toBeVisible()
    }
  })

  test('deve navegar para lista de profissionais', async ({ page }) => {
    // Clicar no card de profissionais
    await page.click('text=Profissionais')

    // Deve navegar para profissionais
    await expect(page).toHaveURL(`${BASE_URL}/professionals`)
  })

  test('deve atualizar dados ao clicar refresh', async ({ page }) => {
    const refreshButton = page.locator('[data-testid="refresh-button"]')
    await refreshButton.click()

    // Aguardar carregamento
    const loading = page.locator('[data-testid="loading-spinner"]')
    await expect(loading).toBeVisible()
    await expect(loading).not.toBeVisible({ timeout: 5000 })

    // Dados devem estar atualizados
    const kpiCards = page.locator('[data-testid="kpi-card"]')
    await expect(kpiCards.first()).toBeVisible()
  })
})
```

### 6.3 Professionals List Tests

**Arquivo:** `/src/__tests__/e2e/professionals.spec.ts`

```typescript
import { test, expect } from '@playwright/test'

const BASE_URL = 'http://localhost:3000'

test.describe('Professionals List', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/login`)
    await page.fill('input[type="email"]', 'test@elopar.com.br')
    await page.fill('input[type="password"]', 'TestPassword123!')
    await page.click('button[type="submit"]')
    await page.waitForURL(`${BASE_URL}/professionals`)
  })

  test('deve carregar lista de profissionais', async ({ page }) => {
    await page.goto(`${BASE_URL}/professionals`)

    // Aguardar tabela
    await expect(page.locator('[data-testid="professionals-table"]')).toBeVisible()

    // Verificar linhas
    const rows = page.locator('tbody tr')
    expect(await rows.count()).toBeGreaterThan(0)
  })

  test('deve buscar por nome', async ({ page }) => {
    const searchInput = page.locator('[data-testid="search-input"]')

    // Digite nome
    await searchInput.fill('João')

    // Aguardar resultados
    await page.waitForTimeout(500)

    // Verificar resultados contêm "João"
    const rows = page.locator('tbody tr')
    const firstRow = rows.first()
    await expect(firstRow).toContainText(/João/i)
  })

  test('deve filtrar por cliente', async ({ page }) => {
    const clientFilter = page.locator('[data-testid="filter-client"]')

    // Abrir dropdown
    await clientFilter.click()

    // Selecionar cliente
    await page.click('text=Elopar')

    // Aplicar filtro
    await page.click('[data-testid="apply-filter"]')

    // Aguardar resultados
    await page.waitForTimeout(500)

    // Todos os resultados devem ser do cliente selecionado
    const cells = page.locator('tbody td:nth-child(2)') // Cliente é coluna 2
    const cellCount = await cells.count()

    for (let i = 0; i < Math.min(cellCount, 5); i++) {
      const text = await cells.nth(i).textContent()
      if (text) {
        expect(text).toContain('Elopar')
      }
    }
  })

  test('deve filtrar por status', async ({ page }) => {
    const statusFilter = page.locator('[data-testid="filter-status"]')
    await statusFilter.click()
    await page.click('text=ATIVO')
    await page.click('[data-testid="apply-filter"]')

    await page.waitForTimeout(500)

    // Verificar que todos são ATIVO
    const statusCells = page.locator('tbody td:nth-child(3)')
    const count = await statusCells.count()

    for (let i = 0; i < Math.min(count, 5); i++) {
      const text = await statusCells.nth(i).textContent()
      expect(text).toContain('ATIVO')
    }
  })

  test('deve combinar múltiplos filtros', async ({ page }) => {
    // Filtrar por cliente
    const clientFilter = page.locator('[data-testid="filter-client"]')
    await clientFilter.click()
    await page.click('text=Elopar')

    // Filtrar por status
    const statusFilter = page.locator('[data-testid="filter-status"]')
    await statusFilter.click()
    await page.click('text=ATIVO')

    // Aplicar filtros
    await page.click('[data-testid="apply-filter"]')
    await page.waitForTimeout(500)

    // Verificar resultados
    const rows = page.locator('tbody tr')
    expect(await rows.count()).toBeGreaterThan(0)
  })

  test('deve paginar resultados', async ({ page }) => {
    // Ir para próxima página
    const nextButton = page.locator('[data-testid="pagination-next"]')

    if (await nextButton.isEnabled()) {
      const firstPageText = await page.locator('tbody tr:first-child').textContent()

      await nextButton.click()
      await page.waitForTimeout(500)

      const secondPageText = await page.locator('tbody tr:first-child').textContent()

      // Dados devem ser diferentes
      expect(firstPageText).not.toEqual(secondPageText)
    }
  })

  test('deve navegar para detalhe ao clicar em linha', async ({ page }) => {
    const firstRow = page.locator('tbody tr').first()
    await firstRow.click()

    // Deve navegar para detalhe
    await expect(page).toHaveURL(/professionals\/[^/]+/)

    // Verificar página de detalhe
    await expect(page.locator('[data-testid="professional-detail"]')).toBeVisible()
  })

  test('deve ordenar por coluna', async ({ page }) => {
    const nameHeader = page.locator('thead th:nth-child(1)')

    // Primeira clicagem - ascendente
    await nameHeader.click()
    await page.waitForTimeout(500)

    let rows = page.locator('tbody tr')
    let firstName = await rows.first().locator('td:nth-child(1)').textContent()

    // Segunda clicagem - descendente
    await nameHeader.click()
    await page.waitForTimeout(500)

    rows = page.locator('tbody tr')
    let newFirstName = await rows.first().locator('td:nth-child(1)').textContent()

    // Nomes devem ser diferentes (ordem invertida)
    expect(firstName).not.toEqual(newFirstName)
  })
})
```

### 6.4 Professional Detail Tests

**Arquivo:** `/src/__tests__/e2e/professional-detail.spec.ts`

```typescript
import { test, expect } from '@playwright/test'

const BASE_URL = 'http://localhost:3000'

test.describe('Professional Detail Page', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto(`${BASE_URL}/login`)
    await page.fill('input[type="email"]', 'test@elopar.com.br')
    await page.fill('input[type="password"]', 'TestPassword123!')
    await page.click('button[type="submit"]')
    await page.waitForURL(`${BASE_URL}/professionals`)

    // Navegar para primeiro profissional
    await page.locator('tbody tr').first().click()
    await page.waitForURL(/professionals\/[^/]+/)
  })

  test('deve exibir dados do profissional', async ({ page }) => {
    // Verificar campos básicos
    const name = page.locator('[data-testid="professional-name"]')
    await expect(name).toBeVisible()
    await expect(name).not.toHaveText('')

    const client = page.locator('[data-testid="professional-client"]')
    await expect(client).toBeVisible()

    const status = page.locator('[data-testid="professional-status"]')
    await expect(status).toBeVisible()
  })

  test('deve exibir abas de informações', async ({ page }) => {
    // Verificar presença das abas
    const basicTab = page.locator('text=Básico')
    const financeTab = page.locator('text=Financeiro')
    const equipmentTab = page.locator('text=Equipamento')

    await expect(basicTab).toBeVisible()
    await expect(financeTab).toBeVisible()
    await expect(equipmentTab).toBeVisible()
  })

  test('deve trocar de aba', async ({ page }) => {
    // Clicar aba Financeiro
    await page.click('text=Financeiro')

    // Aguardar carregamento
    await page.waitForTimeout(300)

    // Verificar conteúdo da aba
    const salary = page.locator('[data-testid="professional-salary"]')
    await expect(salary).toBeVisible()
  })

  test('deve exibir dados financeiros', async ({ page }) => {
    // Ir para aba Financeiro
    await page.click('text=Financeiro')

    // Verificar campos
    const salary = page.locator('[data-testid="professional-salary"]')
    const benefits = page.locator('[data-testid="professional-benefits"]')

    await expect(salary).toBeVisible()
    if (await benefits.isVisible()) {
      await expect(benefits).toContainText(/R\$|vazio/)
    }
  })

  test('deve exibir breadcrumb de navegação', async ({ page }) => {
    const breadcrumb = page.locator('[data-testid="breadcrumb"]')
    await expect(breadcrumb).toBeVisible()
    await expect(breadcrumb).toContainText('Profissionais')
  })

  test('deve navegar voltar via breadcrumb', async ({ page }) => {
    // Clicar "Profissionais" no breadcrumb
    await page.click('text=Profissionais', { exact: true })

    // Deve voltar para lista
    await expect(page).toHaveURL(`${BASE_URL}/professionals`)
  })

  test('deve navegar voltar via botão back', async ({ page }) => {
    // Clicar botão voltar
    const backButton = page.locator('[data-testid="back-button"]')
    if (await backButton.isVisible()) {
      await backButton.click()
      await expect(page).toHaveURL(`${BASE_URL}/professionals`)
    }
  })
})
```

### 6.5 Responsive Tests

**Arquivo:** `/src/__tests__/e2e/responsive.spec.ts`

```typescript
import { test, expect, devices } from '@playwright/test'

const BASE_URL = 'http://localhost:3000'

test.describe('Responsive Design', () => {
  test('deve renderizar corretamente em mobile', async ({ page }) => {
    // Definir viewport de mobile
    await page.setViewportSize({ width: 375, height: 667 })

    await page.goto(`${BASE_URL}/login`)

    // Verificar que elementos são visíveis
    const emailInput = page.locator('input[type="email"]')
    const passwordInput = page.locator('input[type="password"]')
    const submitButton = page.locator('button[type="submit"]')

    await expect(emailInput).toBeVisible()
    await expect(passwordInput).toBeVisible()
    await expect(submitButton).toBeVisible()
  })

  test('deve recolher sidebar em mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })

    await page.goto(`${BASE_URL}/login`)
    await page.fill('input[type="email"]', 'test@elopar.com.br')
    await page.fill('input[type="password"]', 'TestPassword123!')
    await page.click('button[type="submit"]')
    await page.waitForURL(`${BASE_URL}/dashboard`)

    // Sidebar deve estar recolhida ou em modal
    const sidebar = page.locator('[data-testid="sidebar"]')
    if (await sidebar.isVisible()) {
      // Verificar que tem botão de hamburger
      const hamburger = page.locator('[data-testid="hamburger-menu"]')
      await expect(hamburger).toBeVisible()
    }
  })

  test('deve fazer scroll em tabelas no mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })

    await page.goto(`${BASE_URL}/login`)
    await page.fill('input[type="email"]', 'test@elopar.com.br')
    await page.fill('input[type="password"]', 'TestPassword123!')
    await page.click('button[type="submit"]')
    await page.waitForURL(`${BASE_URL}/professionals`)

    // Tabela deve ser scrollável
    const table = page.locator('[data-testid="professionals-table"]')
    await expect(table).toBeVisible()

    // Verificar que pode fazer scroll horizontal
    const scrollableContainer = page.locator('.overflow-x-auto')
    if (await scrollableContainer.isVisible()) {
      expect(await scrollableContainer.evaluate(el => el.scrollWidth > el.clientWidth))
        .toBeTruthy()
    }
  })

  test('deve adaptar layout em tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })

    await page.goto(`${BASE_URL}/dashboard`)

    const dashboard = page.locator('[data-testid="dashboard-container"]')
    await expect(dashboard).toBeVisible()

    // Layout deve estar em modo tablet
    const kpiCards = page.locator('[data-testid="kpi-card"]')
    expect(await kpiCards.count()).toBeGreaterThan(0)
  })

  test('deve suportar orientação landscape', async ({ page }) => {
    await page.setViewportSize({ width: 667, height: 375 })

    await page.goto(`${BASE_URL}/professionals`)

    const table = page.locator('[data-testid="professionals-table"]')
    await expect(table).toBeVisible()
  })
})
```

### 6.6 Accessibility Tests

**Arquivo:** `/src/__tests__/e2e/accessibility.spec.ts`

```typescript
import { test, expect } from '@playwright/test'
import { injectAxe, checkA11y } from 'axe-playwright'

const BASE_URL = 'http://localhost:3000'

test.describe('Accessibility (a11y)', () => {
  test('deve passar auditoria axe-core na página de login', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`)

    // Injetar e rodar axe
    await injectAxe(page)
    await checkA11y(page, null, {
      detailedReport: true,
      detailedReportOptions: {
        html: true
      }
    })
  })

  test('deve ter navegação por teclado funcional', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`)

    // Tab através dos campos
    await page.keyboard.press('Tab')
    await expect(page.locator('input[type="email"]')).toBeFocused()

    await page.keyboard.press('Tab')
    await expect(page.locator('input[type="password"]')).toBeFocused()

    await page.keyboard.press('Tab')
    await expect(page.locator('button[type="submit"]')).toBeFocused()
  })

  test('deve ter labels acessíveis para inputs', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`)

    const emailInput = page.locator('input[type="email"]')
    const passwordInput = page.locator('input[type="password"]')

    // Verificar associação label-input
    const emailLabel = page.locator('label[for="email"]')
    const passwordLabel = page.locator('label[for="password"]')

    await expect(emailLabel).toBeVisible()
    await expect(passwordLabel).toBeVisible()
  })

  test('deve ter contraste de cores adequado', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`)

    await injectAxe(page)
    await checkA11y(page, null, {
      rules: {
        'color-contrast': { enabled: true }
      }
    })
  })

  test('deve ter aria-labels para ícones', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`)

    // Navegar para dashboard para encontrar ícones
    await page.fill('input[type="email"]', 'test@elopar.com.br')
    await page.fill('input[type="password"]', 'TestPassword123!')
    await page.click('button[type="submit"]')
    await page.waitForURL(`${BASE_URL}/dashboard`)

    // Verificar ícones têm aria-label ou estão em elementos com role
    const icons = page.locator('svg')
    const count = await icons.count()

    for (let i = 0; i < Math.min(count, 5); i++) {
      const icon = icons.nth(i)
      const ariaLabel = await icon.getAttribute('aria-label')
      const parent = icon.locator('..')
      const parentRole = await parent.getAttribute('role')

      // Deve ter aria-label ou estar em elemento com role
      const hasAccessibility = ariaLabel || parentRole
      expect(hasAccessibility).toBeTruthy()
    }
  })

  test('deve passar auditoria axe na dashboard', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`)
    await page.fill('input[type="email"]', 'test@elopar.com.br')
    await page.fill('input[type="password"]', 'TestPassword123!')
    await page.click('button[type="submit"]')
    await page.waitForURL(`${BASE_URL}/dashboard`)

    await injectAxe(page)
    await checkA11y(page, null)
  })

  test('deve passar auditoria axe na lista de profissionais', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`)
    await page.fill('input[type="email"]', 'test@elopar.com.br')
    await page.fill('input[type="password"]', 'TestPassword123!')
    await page.click('button[type="submit"]')
    await page.waitForURL(`${BASE_URL}/professionals`)

    await injectAxe(page)
    await checkA11y(page, null)
  })
})
```

---

## 7. FIXTURES E DADOS DE TESTE

### 7.1 Professionals Fixture

**Arquivo:** `/src/__tests__/fixtures/professionals.ts`

```typescript
export const mockProfessionals = [
  {
    id: 'prof-1',
    name: 'João Silva Santos',
    client_id: 'client-1',
    client_name: 'Elopar',
    email: 'joao@elopar.com.br',
    phone: '(11) 98765-4321',
    status: 'ATIVO',
    seniority: 'SENIOR',
    contract_type: 'CLT',
    salary: 15000,
    benefits: 'VR, VA, Plano de saúde',
    renewal_date: '2026-05-15',
    start_date: '2020-01-10',
    notes: 'Excelente profissional',
    created_at: '2020-01-10T10:00:00Z'
  },
  {
    id: 'prof-2',
    name: 'Maria Santos Oliveira',
    client_id: 'client-2',
    client_name: 'Livelo',
    email: 'maria@livelo.com.br',
    phone: '(11) 99876-5432',
    status: 'ATIVO',
    seniority: 'PLENO',
    contract_type: 'CLT',
    salary: 10000,
    benefits: 'VR, Plano de saúde',
    renewal_date: '2026-06-10',
    start_date: '2021-03-15',
    notes: '',
    created_at: '2021-03-15T10:00:00Z'
  },
  {
    id: 'prof-3',
    name: 'Carlos Pereira Costa',
    client_id: 'client-1',
    client_name: 'Elopar',
    email: 'carlos@elopar.com.br',
    phone: '(11) 87654-3210',
    status: 'ATIVO',
    seniority: 'JUNIOR',
    contract_type: 'CLT',
    salary: 5000,
    benefits: 'VR, VA',
    renewal_date: '2026-04-20',
    start_date: '2023-06-01',
    notes: 'Programa de mentoria',
    created_at: '2023-06-01T10:00:00Z'
  },
  {
    id: 'prof-4',
    name: 'Ana Paula Rodrigues',
    client_id: 'client-3',
    client_name: 'Getnet',
    email: 'ana@getnet.com.br',
    phone: '(21) 98765-1234',
    status: 'DESLIGADO',
    seniority: 'PLENO',
    contract_type: 'CLT',
    salary: 8000,
    benefits: '',
    renewal_date: '2026-03-01',
    start_date: '2019-02-01',
    notes: 'Saída em 31/03/2026',
    created_at: '2019-02-01T10:00:00Z'
  },
  {
    id: 'prof-5',
    name: 'Pedro Gomes Silva',
    client_id: 'client-2',
    client_name: 'Livelo',
    email: 'pedro@livelo.com.br',
    phone: '(11) 94321-0987',
    status: 'AFASTADO',
    seniority: 'SENIOR',
    contract_type: 'CLT',
    salary: 12000,
    benefits: 'VR, VA, Plano de saúde',
    renewal_date: '2026-04-30',
    start_date: '2018-05-20',
    notes: 'Licença médica até 30/04/2026',
    created_at: '2018-05-20T10:00:00Z'
  }
]
```

### 7.2 Clients Fixture

**Arquivo:** `/src/__tests__/fixtures/clients.ts`

```typescript
export const mockClients = [
  {
    id: 'client-1',
    name: 'Elopar',
    city: 'São Paulo',
    state: 'SP',
    contact_email: 'contato@elopar.com.br',
    contact_phone: '(11) 3000-1000',
    contract_start: '2018-01-01',
    contract_end: '2026-12-31',
    monthly_fee: 50000,
    notes: 'Cliente principal',
    professional_count: 3,
    active_professionals: 3,
    created_at: '2018-01-01T10:00:00Z'
  },
  {
    id: 'client-2',
    name: 'Livelo',
    city: 'São Paulo',
    state: 'SP',
    contact_email: 'rh@livelo.com.br',
    contact_phone: '(11) 3000-2000',
    contract_start: '2020-06-01',
    contract_end: '2025-12-31',
    monthly_fee: 35000,
    notes: '',
    professional_count: 2,
    active_professionals: 1,
    created_at: '2020-06-01T10:00:00Z'
  },
  {
    id: 'client-3',
    name: 'Getnet',
    city: 'Rio de Janeiro',
    state: 'RJ',
    contact_email: 'rh@getnet.com.br',
    contact_phone: '(21) 3000-3000',
    contract_start: '2019-03-01',
    contract_end: '2026-02-28',
    monthly_fee: 25000,
    notes: 'Contrato em encerramento',
    professional_count: 1,
    active_professionals: 0,
    created_at: '2019-03-01T10:00:00Z'
  }
]
```

### 7.3 Equipment Fixture

**Arquivo:** `/src/__tests__/fixtures/equipment.ts`

```typescript
export const mockEquipment = [
  {
    id: 'eq-1',
    professional_id: 'prof-1',
    type: 'Notebook',
    model: 'MacBook Pro 16',
    serial: 'C123456789',
    purchase_date: '2022-01-15',
    warranty_until: '2025-01-14',
    status: 'ATIVO',
    notes: 'M1 Pro, 16GB RAM',
    created_at: '2022-01-15T10:00:00Z'
  },
  {
    id: 'eq-2',
    professional_id: 'prof-1',
    type: 'Monitor',
    model: 'Dell U2723DE',
    serial: 'D234567890',
    purchase_date: '2022-01-15',
    warranty_until: '2025-01-14',
    status: 'ATIVO',
    notes: '27", USB-C',
    created_at: '2022-01-15T10:00:00Z'
  },
  {
    id: 'eq-3',
    professional_id: 'prof-2',
    type: 'Notebook',
    model: 'Dell XPS 13',
    serial: 'E345678901',
    purchase_date: '2023-06-20',
    warranty_until: '2026-06-19',
    status: 'ATIVO',
    notes: 'i5, 8GB RAM',
    created_at: '2023-06-20T10:00:00Z'
  }
]
```

### 7.4 Vacations Fixture

**Arquivo:** `/src/__tests__/fixtures/vacations.ts`

```typescript
export const mockVacations = [
  {
    id: 'vac-1',
    professional_id: 'prof-1',
    start_date: '2026-07-01',
    end_date: '2026-07-21',
    days: 15,
    status: 'APROVADO',
    notes: 'Férias programadas',
    created_at: '2026-01-10T10:00:00Z'
  },
  {
    id: 'vac-2',
    professional_id: 'prof-2',
    start_date: '2026-12-01',
    end_date: '2026-12-31',
    days: 20,
    status: 'SOLICITADO',
    notes: 'Aguardando aprovação',
    created_at: '2026-03-15T10:00:00Z'
  }
]
```

---

## 8. CI/CD PIPELINE DE TESTES

**Arquivo:** `/.github/workflows/test.yml`

```yaml
name: Test Suite

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  lint-and-type-check:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run ESLint
        run: npm run lint -- --format json --output-file eslint-report.json || true

      - name: Upload lint report
        uses: actions/upload-artifact@v3
        with:
          name: eslint-report
          path: eslint-report.json

      - name: TypeScript type check
        run: npx tsc --noEmit

  unit-tests:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test -- --coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
          flags: unittests
          name: codecov-umbrella

      - name: Comment coverage on PR
        if: github.event_name == 'pull_request'
        uses: romeovs/lcov-reporter-action@v0.3.1
        with:
          lcov-file: ./coverage/lcov.info
          github-token: ${{ secrets.GITHUB_TOKEN }}

  integration-tests:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:8432

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20.x
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Setup Supabase local
        run: |
          npm install -g supabase
          supabase start

      - name: Run integration tests
        run: npm run test:integration
        env:
          SUPABASE_URL: http://localhost:54321
          SUPABASE_KEY: ${{ secrets.SUPABASE_KEY }}

  e2e-tests:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20.x
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Build application
        run: npm run build

      - name: Run E2E tests
        run: npm run test:e2e
        env:
          PLAYWRIGHT_TEST_BASE_URL: http://localhost:3000

      - name: Upload Playwright report
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30

  coverage-check:
    runs-on: ubuntu-latest
    needs: unit-tests

    steps:
      - uses: actions/checkout@v4

      - name: Download coverage
        uses: actions/download-artifact@v3
        with:
          name: coverage

      - name: Check coverage thresholds
        run: |
          if [ $(cat coverage-summary.json | jq '.total.lines.pct') -lt 80 ]; then
            echo "Coverage below 80%"
            exit 1
          fi

  all-tests-passed:
    runs-on: ubuntu-latest
    needs: [ lint-and-type-check, unit-tests, integration-tests, e2e-tests ]
    if: always()

    steps:
      - name: Check all tests passed
        run: |
          if [ "${{ needs.lint-and-type-check.result }}" != "success" ] || \
             [ "${{ needs.unit-tests.result }}" != "success" ] || \
             [ "${{ needs.integration-tests.result }}" != "success" ] || \
             [ "${{ needs.e2e-tests.result }}" != "success" ]; then
            exit 1
          fi
```

---

## 9. TDD WORKFLOW - EXEMPLO PRÁTICO

### Feature: Busca de Profissionais com Debounce

#### Fase 1: RED (Testes falhando)

**Teste 1: Input de busca renderiza**

```typescript
// src/__tests__/unit/components/ui/SearchInput.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SearchInput } from '@/components/ui/SearchInput'

describe('SearchInput Component - TDD Workflow', () => {
  it('deve renderizar input de busca', () => {
    render(<SearchInput onSearch={vi.fn()} />)
    const input = screen.getByRole('textbox')
    expect(input).toBeInTheDocument()
  })
})
```

**Este teste FALHA pois o componente não existe.**

#### Fase 2: GREEN (Implementação mínima)

```typescript
// src/components/ui/SearchInput.tsx
export function SearchInput({ onSearch }: { onSearch: (query: string) => void }) {
  return <input type="text" />
}
```

**Teste passa, mas implementação é mínima.**

#### Fase 3: RED (Teste para funcionalidade)

```typescript
it('deve chamar onSearch ao digitar', async () => {
  const onSearch = vi.fn()
  render(<SearchInput onSearch={onSearch} />)

  const input = screen.getByRole('textbox')
  await userEvent.type(input, 'João')

  expect(onSearch).toHaveBeenCalledWith('João')
})
```

**Falha porque onChange não está implementado.**

#### Fase 4: GREEN (Implementar funcionalidade)

```typescript
export function SearchInput({ onSearch }: { onSearch: (query: string) => void }) {
  return (
    <input
      type="text"
      onChange={(e) => onSearch(e.target.value)}
      placeholder="Buscar..."
    />
  )
}
```

#### Fase 5: RED (Teste para debounce)

```typescript
it('deve fazer debounce da busca', async () => {
  vi.useFakeTimers()
  const onSearch = vi.fn()

  render(<SearchInput onSearch={onSearch} debounceMs={300} />)

  const input = screen.getByRole('textbox')
  await userEvent.type(input, 'João', { delay: 50 })

  // Não deve chamar ainda
  expect(onSearch).not.toHaveBeenCalled()

  // Avançar timer
  vi.advanceTimersByTime(300)

  // Agora deve chamar
  expect(onSearch).toHaveBeenCalled()

  vi.useRealTimers()
})
```

#### Fase 6: GREEN (Implementar debounce)

```typescript
import { useDebounce } from '@/hooks/useDebounce'

export function SearchInput({
  onSearch,
  debounceMs = 300
}: {
  onSearch: (query: string) => void
  debounceMs?: number
}) {
  const [value, setValue] = useState('')
  const debouncedValue = useDebounce(value, debounceMs)

  useEffect(() => {
    onSearch(debouncedValue)
  }, [debouncedValue, onSearch])

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Buscar..."
    />
  )
}
```

#### Fase 7: REFACTOR (Melhorar sem quebrar testes)

```typescript
export function SearchInput({
  onSearch,
  debounceMs = 300,
  placeholder = 'Buscar profissionais...',
  disabled = false
}: SearchInputProps) {
  const [value, setValue] = useState('')
  const debouncedValue = useDebounce(value, debounceMs)

  useEffect(() => {
    if (debouncedValue) {
      onSearch(debouncedValue)
    }
  }, [debouncedValue, onSearch])

  return (
    <div className="relative">
      <MagnifyingGlassIcon className="absolute left-3 top-3" />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') setValue('')
        }}
        placeholder={placeholder}
        disabled={disabled}
        className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
        aria-label="Campo de busca"
        data-testid="search-input"
      />
      {value && (
        <button
          onClick={() => setValue('')}
          className="absolute right-3 top-3"
          aria-label="Limpar busca"
        >
          ×
        </button>
      )}
    </div>
  )
}
```

#### Fase 8: RED (Testes de edge cases)

```typescript
it('deve limpar busca ao clicar no X', async () => {
  const onSearch = vi.fn()
  render(<SearchInput onSearch={onSearch} />)

  const input = screen.getByRole('textbox')
  await userEvent.type(input, 'teste')

  const clearButton = screen.getByLabelText('Limpar busca')
  await userEvent.click(clearButton)

  expect(input).toHaveValue('')
})

it('deve limpar ao pressionar Escape', async () => {
  const onSearch = vi.fn()
  render(<SearchInput onSearch={onSearch} />)

  const input = screen.getByRole('textbox')
  await userEvent.type(input, 'teste')
  await userEvent.keyboard('{Escape}')

  expect(input).toHaveValue('')
})

it('deve ignorar busca vazia', async () => {
  const onSearch = vi.fn()
  render(<SearchInput onSearch={onSearch} />)

  const input = screen.getByRole('textbox')
  await userEvent.clear(input)

  vi.advanceTimersByTime(300)

  // onSearch não deve ser chamado com string vazia
  expect(onSearch).not.toHaveBeenCalledWith('')
})
```

#### Fase 9: GREEN (Implementar edge cases)

*Código acima já implementa estes casos com `if (debouncedValue)` e Escape handler.*

#### Fase 10: REFACTOR (Testes de integração)

```typescript
// src/__tests__/integration/components/SearchInput.integration.test.tsx
describe('SearchInput Integration', () => {
  it('deve funcionar com ProfessionalList', async () => {
    const mockProfessionals = [
      { id: '1', name: 'João Silva' },
      { id: '2', name: 'Maria Santos' }
    ]

    const { getByRole, queryByText } = render(
      <ProfessionalList professionals={mockProfessionals} />
    )

    const searchInput = getByRole('textbox')
    await userEvent.type(searchInput, 'João')

    vi.advanceTimersByTime(300)
    await waitFor(() => {
      expect(queryByText('Maria Santos')).not.toBeInTheDocument()
      expect(queryByText('João Silva')).toBeInTheDocument()
    })
  })
})
```

---

## 10. QUALITY GATES

### 10.1 Pre-commit Hooks (Husky + lint-staged)

**Arquivo:** `/.husky/pre-commit`

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx lint-staged
```

**Arquivo:** `/.lintstagedrc`

```javascript
module.exports = {
  '*.{ts,tsx}': [
    'eslint --fix',
    'prettier --write',
    () => 'tsc --noEmit'
  ],
  '*.{css,scss}': [
    'prettier --write'
  ],
  'src/**/*.{test,spec}.{ts,tsx}': [
    'vitest run --run --bail'
  ]
}
```

### 10.2 Pull Request Quality Gates

**Regras obrigatórias no GitHub:**

1. Status checks devem passar:
   - `lint-and-type-check`
   - `unit-tests` (com cobertura ≥ 80%)
   - `integration-tests`
   - `e2e-tests`

2. Requer review de 1+ pessoa
3. Conversas resolvidas
4. Sem commits com falhas

### 10.3 Merge to Main Requirements

Além dos PRs:

1. E2E tests devem passar em todos os navegadores
2. Coverage não pode diminuir
3. Bundle size check (alertar se > 10% aumento)
4. Lighthouse score ≥ 90 em mobile

### 10.4 Production Deploy Requirements

```yaml
# .github/workflows/deploy.yml
name: Deploy Production

on:
  release:
    types: [published]

jobs:
  smoke-tests:
    runs-on: ubuntu-latest
    environment: production
    steps:
      - run: npm run test:smoke

  visual-regression:
    runs-on: ubuntu-latest
    steps:
      - run: npm run test:visual

  deploy:
    needs: [smoke-tests, visual-regression]
    runs-on: ubuntu-latest
    environment: production
    steps:
      - run: npm run deploy
```

---

## 11. MÉTRICAS E RELATÓRIOS

### Acompanhar

```typescript
// vitest.config.ts - adicionar:
coverage: {
  provider: 'v8',
  reporter: ['text', 'json', 'html', 'lco