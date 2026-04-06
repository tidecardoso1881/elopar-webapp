# Guia de Testes E2E com Playwright

Este projeto inclui uma suite completa de testes E2E (End-to-End) usando Playwright, cobrindo autenticação, navegação e funcionalidades principais da aplicação.

## Instalação

```bash
# Instalar Playwright como dependência de desenvolvimento
npm install --save-dev @playwright/test

# Instalar browsers do Playwright
npx playwright install chromium
```

## Configuração

### Variáveis de Ambiente

Crie um arquivo `.env.local` (copie de `.env.example`) e configure:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon

# Testes E2E
E2E_PASSWORD=sua-senha-teste
```

### Credenciais de Teste

Os testes usam as seguintes credenciais:
- **Email**: tidebatera@gmail.com
- **Senha**: variável `E2E_PASSWORD` do `.env.local`

Certifique-se de que esse usuário existe no Supabase com essa senha.

## Executando os Testes

### Modo Interativo (recomendado para desenvolvimento)

```bash
# Abrir o Test Inspector do Playwright
npx playwright test --ui
```

### Modo Headless (CI/CD)

```bash
# Executar todos os testes
npx playwright test

# Executar testes específicos
npx playwright test e2e/auth.spec.ts
npx playwright test e2e/dashboard.spec.ts

# Executar um único teste
npx playwright test -g "Login com credenciais válidas"
```

### Modo Debug

```bash
# Abrir debugger interativo
npx playwright test --debug

# Ou com UI e debug juntos
npx playwright test --ui --debug
```

## Estrutura dos Testes

```
e2e/
├── fixtures/
│   └── auth.ts              # Fixture de autenticação reutilizável
├── auth.spec.ts             # Testes de login, logout, erros
├── dashboard.spec.ts        # Testes do dashboard e navegação
├── profissionais.spec.ts    # Testes de listagem e busca
├── clientes.spec.ts         # Testes de clientes
├── equipamentos.spec.ts     # Testes de equipamentos
└── ferias.spec.ts           # Testes de férias
```

## Testes Inclusos

### auth.spec.ts (4 testes)
- Login com credenciais válidas
- Acesso a rota protegida sem login
- Logout
- Login com senha incorreta

### dashboard.spec.ts (6 testes)
- Carregamento de KPI cards
- Sidebar e navegação
- Links para profissionais, clientes, equipamentos, férias, renovações

### profissionais.spec.ts (5 testes)
- Listagem
- Busca por nome
- Filtro por status
- Detalhe de profissional
- Formulário de novo profissional

### clientes.spec.ts (3 testes)
- Listagem com cards
- Exibição de dados
- Novo cliente

### equipamentos.spec.ts (3 testes)
- Carregamento
- Tabela de dados
- Filtro de busca

### ferias.spec.ts (3 testes)
- Carregamento
- Toggle entre calendário e lista
- Visualização

**Total: 28 testes**

## Reports

Os testes geram reports automáticos:

```bash
# Visualizar report HTML
npx playwright show-report
```

Os reports estão em `playwright-report/`.

## Dicas de Desenvolvimento

### Usar o Fixture de Autenticação

```typescript
import { test, expect } from './fixtures/auth'

test('Meu teste autenticado', async ({ authenticatedPage: page }) => {
  // page já está autenticado
  await page.goto('/dashboard')
  await expect(page).toHaveTitle(/Dashboard/)
})
```

### Seletores Recomendados

Prefira seletores semanticamente robustos:

```typescript
// Bom - baseado em role e label
await page.getByRole('button', { name: /entrar/i }).click()
await page.getByLabel(/email/i).fill('test@example.com')

// Evitar - seletores frágeis
await page.click('.btn-submit') // Pode quebrar com refatoração CSS
```

### Aguardar Navegação

```typescript
// Aguardar URL
await page.waitForURL('**/dashboard')

// Aguardar elemento visível
await expect(page.locator('.kpi-card')).toBeVisible()

// Aguardar rede idle
await page.waitForLoadState('networkidle')
```

## Troubleshooting

### Erro: "Timeout waiting for navigation"
- Verifique se a rota existe e está implementada
- Aumente timeout: `{ timeout: 15000 }`
- Verifique logs do servidor Next.js

### Erro: "Element not found"
- Use `--debug` para inspecionar o DOM
- Verifique seletores com `page.getByRole('button').count()`

### Erro: "403 Forbidden" ao acessar npm
- Problema com acesso ao npm registry
- Configure um .npmrc alternativo ou use yarn

## CI/CD Integration

Para integrar nos workflows GitHub Actions:

```yaml
- name: Instalar dependências
  run: npm ci && npx playwright install chromium

- name: Rodar testes E2E
  run: npx playwright test
  env:
    E2E_PASSWORD: ${{ secrets.E2E_PASSWORD }}

- name: Upload reports
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report/
```

## Manutenção

- Review seletores quando o design mudar
- Atualizar credenciais de teste no secrets do CI/CD
- Manter testes independentes - cada um deve poder rodar sozinho
- Adicionar novos testes para novas features conforme desenvolvidas

## Contato

Para dúvidas sobre testes, consulte a documentação do Playwright:
https://playwright.dev/
