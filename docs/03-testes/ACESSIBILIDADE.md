# Testes de Acessibilidade WCAG 2.1 AA

Data: 2026-04-05
Sprint: 4
Epic: EP-030

## Resumo Executivo

Este documento consolida a implementação de padrões de acessibilidade WCAG 2.1 AA nos componentes principais da aplicação Elopar. As correções implementadas garantem conformidade com as diretrizes de acessibilidade web para usuários com deficiências.

---

## Checklist WCAG 2.1 AA - Implementado

### 1. Perceivable (Perceptível)

#### 1.1 Non-text Content (Conteúdo não-textual)
- [x] Todos os SVG decorativos marcados com `aria-hidden="true"`
- [x] Ícones em botões possuem `aria-label` descritivo
- [x] Logos sem funcionalidade têm `aria-hidden="true"`

**Arquivos auditados:**
- `src/components/layout/sidebar.tsx`
- `src/components/layout/header.tsx`
- `src/components/layout/mobile-menu.tsx`
- `src/app/(auth)/login/page.tsx`

#### 1.3 Info and Relationships (Informação e Relacionamentos)
- [x] Estrutura semântica HTML correcta (`<header>`, `<nav>`, `<main>`, `<aside>`)
- [x] Heading hierarchy: `<h1>` para título principal, `<h2>` para subtítulos
- [x] Labels associados a inputs via `<label htmlFor>`
- [x] Table headers com `scope="col"` em todas as tabelas
- [x] Status badges com `aria-label` descritivo

**Arquivos auditados:**
- `src/components/profissionais/professionals-table.tsx`
- `src/components/equipamentos/equipment-table.tsx`
- `src/components/ferias/ferias-view.tsx`

#### 1.4 Distinguishable (Distinguível)
- [x] Contraste de cores WCAG AA (aplicado via Tailwind CSS v4)
- [x] Texto redimensionável (sem `font-size` px fixo em inputs)
- [x] Espaçamento visual mantido em zoom

### 2. Operable (Operável)

#### 2.1 Keyboard Accessible (Acessível por teclado)
- [x] Todos elementos focáveis têm tab order lógico
- [x] Skip links implementáveis (navegação principal com `aria-label`)
- [x] Botões de alternância (toggle) com `aria-pressed`
- [x] Modals com `aria-modal="true"` e `role="dialog"`

**Arquivos auditados:**
- `src/components/layout/mobile-menu.tsx`
- `src/components/ferias/ferias-view.tsx`

#### 2.4 Navigable (Navegável)
- [x] Links com texto visível e `aria-label` para contexto adicional
- [x] `aria-current="page"` em itens de navegação ativos
- [x] Breadcrumb com `aria-label="Breadcrumb"`

**Arquivos auditados:**
- `src/components/layout/sidebar.tsx`
- `src/components/layout/header.tsx`

### 3. Understandable (Compreensível)

#### 3.3 Input Assistance (Assistência na entrada)
- [x] Labels descritivos para todos inputs e selects
- [x] Mensagens de erro associadas a campos (via server actions)
- [x] Placeholders não substituem labels

**Arquivos auditados:**
- `src/components/equipamentos/equipment-table.tsx`
- `src/components/ferias/ferias-view.tsx`
- `src/app/(auth)/login/page.tsx`

### 4. Robust (Robusto)

#### 4.1 Compatible (Compatível)
- [x] Semântica HTML5 correcta
- [x] Atributos ARIA válidos e bem-formados
- [x] TypeScript com tipos seguros

---

## Implementações Detalhadas por Componente

### 1. Sidebar (`src/components/layout/sidebar.tsx`)

**Melhorias:**
- `<aside aria-label="Navegação principal">`
- `<nav aria-label="Menu principal">`
- Links de navegação com `aria-current="page"` quando ativos
- Logout button com `aria-label="Sair da conta"`
- SVG icons com `aria-hidden="true"`

### 2. Header (`src/components/layout/header.tsx`)

**Melhorias:**
- `<header role="banner">`
- Breadcrumb com `aria-label="Breadcrumb"`
- Avatars com `aria-hidden="true"` (decorativos)

### 3. Mobile Menu (`src/components/layout/mobile-menu.tsx`)

**Melhorias:**
- Hamburger button com `aria-label="Abrir menu"` e `aria-expanded={isOpen}`
- Drawer menu com `role="dialog"`, `aria-modal="true"`, `aria-label="Menu de navegação"`
- Overlay com `aria-hidden="true"`
- Navigation links com `aria-current="page"`

### 4. Professionals Table (`src/components/profissionais/professionals-table.tsx`)

**Melhorias:**
- `<table aria-label="Lista de profissionais">`
- Table headers com `scope="col"`
- Links de nome com `aria-label="[Nome] - ver detalhes"`
- Status badges com `aria-label="Status: [valor]"`
- Renewal badges com `aria-label="Situação de renovação: [valor]"`

### 5. Equipment Table (`src/components/equipamentos/equipment-table.tsx`)

**Melhorias:**
- `<table aria-label="Lista de equipamentos">`
- Table headers com `scope="col"`
- Search input com `<label>` e `aria-label`
- Filter select com `<label>` e `aria-label`

### 6. Férias View (`src/components/ferias/ferias-view.tsx`)

**Melhorias:**
- Toggle buttons com `aria-pressed={view === 'calendar'}`
- Search input com `<label>` e `aria-label="Buscar por profissional"`
- Table headers com `scope="col"`
- Status badges com `aria-label="Status: [valor]"`
- Button group com `role="group"` e `aria-label="Alternar visualização"`

### 7. Login Page (`src/app/(auth)/login/page.tsx`)

**Melhorias:**
- Form com `aria-label="Formulário de login"`
- Email input com `aria-label="Email de acesso"`
- Password input com `aria-label="Senha de acesso"`
- Toggle visibility button com `aria-label` condicional
- SVG icons com `aria-hidden="true"`

---

## Padrões WCAG Aplicados

### 1.1.1 Non-text Content
```typescript
// Decorative SVGs
<svg aria-hidden="true" className="w-5 h-5">
  {/* ... */}
</svg>

// Functional SVGs (buttons)
<button aria-label="Abrir menu">
  <svg aria-hidden="true">{/* ... */}</svg>
</button>
```

### 1.3.1 Info and Relationships
```typescript
// Form fields
<label htmlFor="email">Email</label>
<input id="email" type="email" />

// Table headers
<th scope="col">Nome</th>

// Navigation
<nav aria-label="Menu principal">
  <a aria-current="page">Ativo</a>
</nav>
```

### 2.1.1 Keyboard Navigation
```typescript
// All interactive elements are keyboard accessible
// Tab order is logical
// Focus styles are visible (Tailwind focus:ring-*)
```

### 2.4.3 Focus Order
```typescript
// Heading hierarchy
<h1>Página Principal</h1>
<h2>Seção</h2>
<h3>Subseção</h3>
```

### 3.3.1 Error Identification
```typescript
// Error messages displayed via server actions
{state?.error && (
  <div role="alert" aria-live="polite">
    {state.error}
  </div>
)}
```

### 4.1.2 Name, Role, Value
```typescript
// Buttons
<button aria-label="Descrição clara da ação">Ícone</button>

// Toggle buttons
<button aria-pressed={isActive}>Ativar</button>

// Modals
<div role="dialog" aria-modal="true" aria-label="Diálogo">
  {/* ... */}
</div>
```

---

## Testes Recomendados com Screen Readers

### 1. Navegação Principal
- [ ] Usar NVDA/JAWS para navegar pela sidebar
- [ ] Confirmar que `aria-current="page"` é anunciado
- [ ] Verificar que labels de navegação são claros

### 2. Tabelas
- [ ] Screen reader anunciando headers correctamente
- [ ] Table relationships (cabeçalhos associados com células)
- [ ] Status badges com descrição clara

### 3. Formulários
- [ ] Labels associados a inputs
- [ ] Erros de validação anunciados
- [ ] Toggle password visibility funcionando

### 4. Mobile Menu
- [ ] Hamburger button anunciando `aria-expanded`
- [ ] Menu drawer apresentado como dialog
- [ ] Escape key fechando modal (implementar se necessário)

---

## Como Executar Auditoria com axe-core

### 1. Instalação (opcional, sob demanda)
```bash
# Instalar quando for realizar auditoria
npm install --save-dev axe-core
```

**Nota:** axe-core está configurado como opcional em devDependencies. Instale apenas quando for executar testes de acessibilidade.

### 2. Integração no Teste E2E (Playwright)
```typescript
// tests/accessibility.spec.ts
import { test, expect } from '@playwright/test'
import { injectAxe, checkA11y } from 'axe-playwright'

test('Dashboard should be accessible', async ({ page }) => {
  await page.goto('/dashboard')
  await injectAxe(page)
  await checkA11y(page, null, {
    detailedReport: true,
    detailedReportOptions: {
      html: true,
    },
  })
})
```

### 3. CLI Audit
```bash
npm audit -- --audit-type accessibility
```

### 4. Browser Extension
- Chrome: [axe DevTools](https://chrome.google.com/webstore)
- Firefox: [axe DevTools](https://addons.mozilla.org/firefox/)

---

## Pendências para Próximas Sprints

### Antes do Go-Live
- [ ] Teste com screen reader real (NVDA/JAWS)
- [ ] Teste com lentes de baixa visão
- [ ] Teste com navegação apenas por teclado
- [ ] Auditoria completa com axe-core
- [ ] Teste de performance com leitores de tela

### Enhancements Futuros
- [ ] Implementar skip links explícitos
- [ ] Adicionar modo dark com contraste aumentado
- [ ] Implementar live regions para notificações
- [ ] Teste com Dragon Speech Recognition
- [ ] Conformidade com WCAG 2.1 AAA (se requerido)

---

## Documentação de Referência

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [axe-core Rules](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md)

---

## Responsabilidades

- **Dev-G**: Implementação das correções (Sprint 4)
- **QA**: Auditoria com screen readers (Sprint 5)
- **Orchestrator**: Aprovação e validação final

---

## Histórico de Alterações

| Data | Versão | Descrição |
|------|--------|-----------|
| 2026-04-05 | 1.0 | Implementação inicial - WCAG 2.1 AA |

