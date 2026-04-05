# Sistema de Design - Elopar Professional Management System

## Documento de Referência Técnica para Desenvolvimento Frontend

Versão: 1.0
Data: Abril de 2026
Projeto: Elopar Professional Management System
Stack: Next.js 16 + React 19 + TypeScript + Tailwind CSS v4 + shadcn/ui

---

## Sumário

1. [Direção Estética](#1-direção-estética)
2. [Paleta de Cores](#2-paleta-de-cores)
3. [Tipografia](#3-tipografia)
4. [Espaçamento e Grid](#4-espaçamento-e-grid)
5. [Componentes shadcn/ui](#5-componentes-shadcnui)
6. [Padrões de UI](#6-padrões-de-ui)
7. [Layout Padrão](#7-layout-padrão)
8. [Configuração Tailwind CSS v4](#8-configuração-tailwind-css-v4)
9. [Mapa de Páginas (Sitemap)](#9-mapa-de-páginas-sitemap)
10. [Componentes Customizados](#10-componentes-customizados)
11. [Diretrizes de Acessibilidade](#11-diretrizes-de-acessibilidade)
12. [Estados de Carregamento e Erro](#12-estados-de-carregamento-e-erro)

---

## 1. Direção Estética

### 1.1 Visão Geral

O Elopar adopta um estilo **Corporate Modern Dashboard Profissional**, inspirado em sistemas como Linear, Vercel Dashboard e Notion. A proposta estética balanceia:

- **Confiança:** Interface limpa, clara e previsível
- **Eficiência:** Densidade de informação adequada, acesso rápido a dados
- **Data-driven:** Visualizações que destacam métricas e indicadores
- **Moderno:** Uso adequado de tipografia, espaçamento e micro-interações

### 1.2 Tom e Voz Visual

- **Corporativo, mas acessível:** Não robótico, com toques humanizados
- **Foco em usuário de negócios:** Executivos, gerentes, RH, gestores
- **Orientado a dados:** Números, gráficos e tendências são protagonistas
- **Confiável:** Erros claros, feedback imediato, ações reversíveis quando possível

### 1.3 Diferenciador

**Cards com indicadores visuais de urgência para renovações de vigência:**
- Cores (vermelho, âmbar, amarelo, azul) com base em dias até vencimento
- Bordas coloridas à esquerda (left-border) dos cards
- Countdown visual para gerar sensação de urgência
- Status badges com ícones para quick-scan

### 1.4 Referências Visuais

- [Linear.app](https://linear.app) - Navegação limpa, cards espaçosos
- [Vercel Dashboard](https://vercel.com/dashboard) - KPI cards, gráficos, tabelas
- [Notion](https://notion.so) - Tipografia, espaçamento, flexibilidade

---

## 2. Paleta de Cores

### 2.1 Sistema de Cores CSS (Tailwind v4)

Utilize as variáveis CSS configuradas no arquivo `globals.css` e/ou `tailwind.config.ts` para manter consistência.

```css
/* Exemplo de configuração para Tailwind v4 */
@theme {
  --color-primary-50: #eff6ff;
  --color-primary-100: #dbeafe;
  --color-primary-200: #bfdbfe;
  --color-primary-300: #93c5fd;
  --color-primary-400: #60a5fa;
  --color-primary-500: #3b82f6; /* Brand Primary */
  --color-primary-600: #2563eb;
  --color-primary-700: #1d4ed8;
  --color-primary-800: #1e40af;
  --color-primary-900: #1e3a8a;

  --color-success-50: #f0fdf4;
  --color-success-500: #22c55e;
  --color-success-600: #16a34a;
  --color-success-700: #15803d;

  --color-warning-50: #fffbeb;
  --color-warning-500: #f59e0b;
  --color-warning-600: #d97706;
  --color-warning-700: #b45309;

  --color-danger-50: #fef2f2;
  --color-danger-500: #ef4444;
  --color-danger-600: #dc2626;
  --color-danger-700: #b91c1c;

  --color-info-50: #eff6ff;
  --color-info-500: #3b82f6;
  --color-info-600: #2563eb;

  --color-neutral-500: #6b7280;
  --color-neutral-600: #4b5563;
  --color-neutral-700: #374151;

  --color-slate-900: #0f172a;
  --color-slate-800: #1e293b;
}
```

### 2.2 Cores por Categoria

#### Brand Colors

| Cor | Código | Uso | Token Tailwind |
|-----|--------|-----|----------------|
| **Primary Blue** | #2563EB | Ações principais, links, botões | `bg-blue-600` / `text-blue-600` |
| **Secondary Slate** | #64748B | Textos secundários, bordas | `text-slate-500` |

#### Status Colors

| Status | Cor | Código | Uso | Token |
|--------|-----|--------|-----|-------|
| **Ativo / Success** | Verde | #22C55E | Profissional ativo | `bg-green-500` / `text-green-600` |
| **Renovação Próxima** | Âmbar | #F59E0B | 30 dias até vencimento | `bg-amber-500` / `text-amber-600` |
| **Crítico** | Vermelho | #EF4444 | Vigência vencida | `bg-red-500` / `text-red-600` |
| **Info Geral** | Azul | #3B82F6 | Informações adicionais | `bg-blue-500` / `text-blue-600` |
| **Desligado / Neutral** | Cinza | #6B7280 | Profissional desligado | `bg-gray-500` / `text-gray-600` |

#### Background Colors

| Modo | Cor Base | Código | Uso |
|------|----------|--------|-----|
| **Light (Default)** | White | #FFFFFF | Background principal |
| **Light** | Gray-50 | #F9FAFB | Áreas secundárias |
| **Dark** | Slate-900 | #0F172A | Background principal |
| **Dark** | Slate-800 | #1E293B | Áreas secundárias |

### 2.3 Gradientes Suportados

Para cards especiais de KPI ou destaque:

```css
/* Gradient Success */
background: linear-gradient(135deg, #10b981 0%, #059669 100%);

/* Gradient Warning */
background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);

/* Gradient Danger */
background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
```

### 2.4 Elevação e Sombras

Use Tailwind's shadow utilities:

```css
/* Padrão para cards */
.shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
.shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
.shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
.shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
```

---

## 3. Tipografia

### 3.1 Fonte Primária: Geist Sans

A fonte **Geist Sans** já está configurada no arquivo `src/app/layout.tsx` e aplicada globalmente via CSS variable `--font-geist-sans`.

```html
<!-- Já aplicado globalmente -->
<html className="font-sans">
```

Características:
- Família moderna, limpa
- Excelente legibilidade em telas
- Suporta múltiplos pesos (400, 500, 600, 700)
- Otimizada para interfaces digitais

### 3.2 Fonte Monoespacial: Geist Mono

Configurada para dados numéricos, códigos, valores monetários.

```html
<!-- Aplicar quando necessário -->
<span className="font-mono">R$ 45.000,00</span>
```

### 3.3 Escala Tipográfica

Defina usando Tailwind's utility classes:

| Elemento | Tamanho | Peso | Line-height | Tailwind | Uso |
|----------|---------|------|-------------|----------|-----|
| **H1** | 32px / 2rem | 700 | 1.2 | `text-4xl font-bold` | Títulos de página |
| **H2** | 24px / 1.5rem | 700 | 1.33 | `text-2xl font-bold` | Seções principais |
| **H3** | 20px / 1.25rem | 600 | 1.4 | `text-xl font-semibold` | Sub-seções, card titles |
| **H4** | 18px / 1.125rem | 600 | 1.44 | `text-lg font-semibold` | Labels, form titles |
| **Body Large** | 16px / 1rem | 400 | 1.5 | `text-base` | Texto principal |
| **Body** | 14px / 0.875rem | 400 | 1.57 | `text-sm` | Texto secundário, tabelas |
| **Caption** | 12px / 0.75rem | 400 | 1.67 | `text-xs` | Descrições, datas, hints |
| **Label** | 13px / 0.8125rem | 500 | 1.54 | `text-xs font-medium` | Form labels, badges |
| **KPI Number** | 40px / 2.5rem | 700 | 1 | `text-5xl font-bold font-mono` | Valores monetários, contadores |

### 3.4 Variações e Composições

```tsx
// Exemplo de componente com escala tipográfica
<article>
  <h1 className="text-4xl font-bold mb-2">Título da Página</h1>
  <p className="text-sm text-gray-500 mb-8">Subtítulo ou descrição</p>

  <section>
    <h2 className="text-2xl font-bold mb-4">Seção</h2>
    <p className="text-base leading-relaxed mb-4">Parágrafo principal.</p>
    <p className="text-sm text-gray-600 mb-4">Texto secundário.</p>
  </section>
</article>
```

---

## 4. Espaçamento e Grid

### 4.1 Unidade Base

**4px** é a unidade base para todas as medidas de espaçamento.

```
Multiplicadores: 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 56px, 64px
```

### 4.2 Espaçamentos Comuns

| Situação | Espaçamento | Tailwind | Exemplo |
|----------|-------------|----------|---------|
| **Muito comprimido** | 4px | `p-1` | Badges, ícones |
| **Comprimido** | 8px | `p-2` | Inputs pequenos |
| **Normal** | 12px | `p-3` | Padding mínimo de componentes |
| **Padrão** | 16px | `p-4` | Padding de cards, inputs |
| **Generoso** | 20px | `p-5` | Seções em página |
| **Muito generoso** | 24px | `p-6` | Card padding padrão (desktop) |
| **Espaço grande** | 32px | `p-8` | Separação entre seções |
| **Separação seções** | 40-48px | `p-10`/`p-12` | Gaps entre sections (desktop) |

### 4.3 Card Padding

```css
/* Mobile (até 640px) */
.card { @apply p-4; } /* 16px */

/* Tablet/Desktop (640px+) */
@media (min-width: 640px) {
  .card { @apply p-6; } /* 24px */
}
```

### 4.4 Section Gaps

```css
/* Mobile */
section + section { @apply mt-6; } /* 24px */

/* Desktop */
@media (min-width: 1024px) {
  section + section { @apply mt-8; } /* 32px */
}
```

### 4.5 Grid System

Use Tailwind's grid utilities:

```tsx
// Grid responsivo: 1 coluna mobile, 2 tablets, 3+ desktop
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <Card /> {/* Cada card com padding interno de 24px */}
  <Card />
  <Card />
</div>
```

### 4.6 Breakpoints

| Tamanho | Breakpoint | Uso |
|---------|-----------|-----|
| **Mobile** | < 640px | Telas pequenas (smartphones) |
| **Small (sm)** | 640px | Tablets pequenos |
| **Medium (md)** | 768px | Tablets em portrait |
| **Large (lg)** | 1024px | Tablets landscape, desktops pequenos |
| **XL (xl)** | 1280px | Desktops padrão |
| **2XL (2xl)** | 1536px | Desktops grandes |

---

## 5. Componentes shadcn/ui

### 5.1 Instalação e Configuração

shadcn/ui é um conjunto de componentes reutilizáveis construídos com Radix UI e Tailwind CSS.

```bash
# Instalar shadcn/ui CLI (se ainda não instalado)
npx shadcn-ui@latest init

# Componentes serão instalados em src/components/ui/
```

### 5.2 Componentes Necessários por Seção

#### Layout & Navigation

| Componente | shadcn | Uso | Notas |
|------------|--------|-----|-------|
| **Sidebar** | `sidebar` | Navegação lateral fixa | Collapsible, responsive |
| **Sheet** | `sheet` | Mobile nav (drawer) | Overlay, fullscreen ou lado |
| **Separator** | `separator` | Divisor visual | Entre seções |
| **Breadcrumb** | `breadcrumb` | Navegação hierárquica | Dashboard > Profissionais > João |
| **Navigation Menu** | `navigation-menu` | Menu horizontal | Futuro: dropdown menus |

```tsx
// Exemplo: Sidebar collapsible
import { Sidebar, SidebarContent, SidebarTrigger } from "@/components/ui/sidebar"

<Sidebar className="w-64">
  <SidebarTrigger /> {/* Ícone hamburger para mobile */}
  <SidebarContent>
    {/* Nav items */}
  </SidebarContent>
</Sidebar>
```

#### Data Display

| Componente | shadcn | Uso | Notas |
|------------|--------|-----|-------|
| **Table** | `table` | Listas de profissionais, equipamentos | Sticky header, striped rows |
| **Card** | `card` | Containers de conteúdo | KPI, summaries, detail sections |
| **Badge** | `badge` | Status, seniority, contract type | Variantes de cores |
| **Avatar** | `avatar` | Iniciais ou foto do profissional | Fallback com iniciais |
| **Tooltip** | `tooltip` | Informações adicionais ao hover | Para campos complexos |
| **Skeleton** | `skeleton` | Placeholder de carregamento | Enquanto dados carregam |

```tsx
// Exemplo: Card de KPI
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

<Card>
  <CardHeader className="pb-2">
    <CardTitle className="text-sm font-medium">Total Profissionais</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="text-4xl font-bold">248</div>
  </CardContent>
</Card>
```

#### Tabs & Pagination

| Componente | shadcn | Uso | Notas |
|------------|--------|-----|-------|
| **Tabs** | `tabs` | Seções na página de detalhe | Informações, Contrato, Financeiro, Histórico |
| **Pagination** | `pagination` | Navegar entre páginas | Tabelas grandes |

```tsx
// Exemplo: Tabs de detalhe do profissional
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

<Tabs defaultValue="info">
  <TabsList>
    <TabsTrigger value="info">Informações</TabsTrigger>
    <TabsTrigger value="contract">Contrato</TabsTrigger>
    <TabsTrigger value="financial">Financeiro</TabsTrigger>
  </TabsList>
  <TabsContent value="info">{/* Conteúdo */}</TabsContent>
</Tabs>
```

#### Forms & Inputs

| Componente | shadcn | Uso | Notas |
|------------|--------|-----|-------|
| **Input** | `input` | Campos de texto | Search, nome, email |
| **Select** | `select` | Dropdowns | Filtros, Cliente, Senioridade |
| **Button** | `button` | Ações | Variantes: primary, secondary, outline, ghost |
| **Dropdown Menu** | `dropdown-menu` | Menu de ações | Editar, deletar, exportar |
| **Dialog** | `dialog` | Modal de confirmação ou form | CRUD futuro |
| **Popover** | `popover` | Conteúdo flutuante | Filtros avançados |

```tsx
// Exemplo: Select com filtro
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

<Select>
  <SelectTrigger className="w-48">
    <SelectValue placeholder="Selecione cliente" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="livelo">Livelo</SelectItem>
    <SelectItem value="natura">Natura</SelectItem>
  </SelectContent>
</Select>
```

#### Feedback & States

| Componente | shadcn | Uso | Notas |
|------------|--------|-----|-------|
| **Alert** | `alert` | Avisos, erros, info | Renovações vencidas |
| **Toast** | `sonner` ou `toast` | Notificações | Ações completadas, erros |
| **Loading** | Custom + Skeleton | Estados de carregamento | Spinners, skeletons |
| **Empty State** | Custom | Tabelas vazias | Ícone + mensagem |

```tsx
// Exemplo: Alert para renovação vencida
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

<Alert variant="destructive">
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>Renovação Vencida</AlertTitle>
  <AlertDescription>João Silva - Vigência venceu em 15 de março.</AlertDescription>
</Alert>
```

#### Charts

| Biblioteca | Uso | Integração |
|-----------|-----|-----------|
| **Recharts** | Gráficos de dados | Já disponível com shadcn |
| **Pie Chart** | Distribuição por senioridade | Dashboard |
| **Bar Chart** | Distribuição por cliente | Dashboard |
| **Area Chart** | Tendência de faturamento | Futuro (Sprint 5+) |

```tsx
// Exemplo: Pie chart com Recharts
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

const data = [
  { name: 'Junior', value: 45, fill: '#3b82f6' },
  { name: 'Pleno', value: 120, fill: '#10b981' },
  { name: 'Sênior', value: 65, fill: '#f59e0b' },
  { name: 'Especialista', value: 18, fill: '#8b5cf6' },
]

<ResponsiveContainer width="100%" height={300}>
  <PieChart>
    <Pie data={data} cx="50%" cy="50%" labelLine={false} label />
  </PieChart>
</ResponsiveContainer>
```

### 5.3 Command Palette (Busca Global)

Para implementar busca rápida via `Command`:

```tsx
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"

// Dispara com Cmd+K ou Ctrl+K
<CommandDialog open={open} onOpenChange={setOpen}>
  <CommandInput placeholder="Buscar profissional, cliente..." />
  <CommandList>
    <CommandEmpty>Nenhum resultado.</CommandEmpty>
    <CommandGroup heading="Profissionais">
      <CommandItem>João Silva</CommandItem>
    </CommandGroup>
  </CommandList>
</CommandDialog>
```

---

## 6. Padrões de UI

### 6.1 Cards de KPI

**Padrão de layout:** Icon + Label (topo) + Value (grande) + Trend/Change (abaixo)

```tsx
// src/components/KPICard.tsx
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function KPICard({
  icon: Icon,
  label,
  value,
  trend,
  trendDirection = "up",
  accentColor = "blue"
}) {
  const borderColors = {
    green: "border-l-green-500",
    amber: "border-l-amber-500",
    red: "border-l-red-500",
    blue: "border-l-blue-500",
  }

  return (
    <Card className={`border-l-4 ${borderColors[accentColor]}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">{label}</span>
          {Icon && <Icon className="w-5 h-5 text-gray-400" />}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold font-mono mb-2">{value}</div>
        {trend && (
          <p className={`text-sm ${trendDirection === "up" ? "text-green-600" : "text-red-600"}`}>
            {trendDirection === "up" ? "↑" : "↓"} {trend}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
```

**Cores por categoria:**
- Verde: Profissionais ativos
- Âmbar: Renovações próximas
- Vermelho: Vencidas
- Azul: Info geral

### 6.2 Tabelas com Dados

**Padrão:** Header sticky, striped rows, hover highlight, badges inline

```tsx
// src/components/DataTable.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export function ProfessionalsTable({ data }) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50 sticky top-0">
          <TableRow>
            <TableHead className="w-12">OS</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Senioridade</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Vigência</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, idx) => (
            <TableRow
              key={row.id}
              className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
            >
              <TableCell className="font-mono text-sm">{row.os}</TableCell>
              <TableCell className="font-medium">{row.name}</TableCell>
              <TableCell>{row.client}</TableCell>
              <TableCell>
                <Badge variant="outline">{row.seniority}</Badge>
              </TableCell>
              <TableCell>
                <StatusBadge status={row.status} />
              </TableCell>
              <TableCell>{row.expiry}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
```

### 6.3 Status Badges

**Padrão:** Dot indicator + texto, cores conforme status

```tsx
// src/components/StatusBadge.tsx
import { Badge } from "@/components/ui/badge"

const statusConfig = {
  ativo: { label: "Ativo", className: "bg-green-100 text-green-800" },
  desligado: { label: "Desligado", className: "bg-gray-100 text-gray-800" },
}

const seniorityConfig = {
  junior: { label: "Junior", className: "bg-blue-50 border border-blue-200 text-blue-700" },
  pleno: { label: "Pleno", className: "bg-green-50 border border-green-200 text-green-700" },
  senior: { label: "Sênior", className: "bg-amber-50 border border-amber-200 text-amber-700" },
  especialista: { label: "Especialista", className: "bg-purple-50 border border-purple-200 text-purple-700" },
}

const contractConfig = {
  clt: { label: "CLT", className: "bg-blue-50 text-blue-700" },
  pj: { label: "PJ", className: "bg-orange-50 text-orange-700" },
  "clt-estrategico": { label: "CLT Estratégico", className: "bg-indigo-50 text-indigo-700" },
}

export function StatusBadge({ type = "status", value }) {
  const config =
    type === "status" ? statusConfig[value] :
    type === "seniority" ? seniorityConfig[value] :
    type === "contract" ? contractConfig[value] :
    {}

  return (
    <div className="flex items-center gap-2">
      <span className="inline-block w-2 h-2 rounded-full bg-current" />
      <Badge className={config.className}>{config.label}</Badge>
    </div>
  )
}
```

### 6.4 Cards de Alertas de Renovação

**Padrão:** Urgência visual, countdown, informações do profissional

```tsx
// src/components/RenewalCard.tsx
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, Clock } from "lucide-react"

export function RenewalCard({ professional, daysUntil }) {
  const getUrgencyColor = (days) => {
    if (days < 0) return { border: "border-l-red-500", bg: "bg-red-50" }
    if (days <= 30) return { border: "border-l-amber-500", bg: "bg-amber-50" }
    if (days <= 60) return { border: "border-l-yellow-400", bg: "bg-yellow-50" }
    return { border: "border-l-blue-500", bg: "bg-blue-50" }
  }

  const { border, bg } = getUrgencyColor(daysUntil)

  return (
    <Card className={`border-l-4 ${border} ${bg}`}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{professional.name}</h3>
            <p className="text-sm text-gray-600">{professional.client}</p>
          </div>
          {daysUntil < 0 && (
            <div className="ml-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 mb-1">Vencimento</p>
            <p className="text-sm font-mono">{professional.expiryDate}</p>
          </div>
          <div className="text-right">
            <Clock className="w-5 h-5 inline mr-2 text-gray-500" />
            <span className="font-bold">{Math.abs(daysUntil)} dias</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
```

**Cores de urgência:**
- Vermelho (border-l-red-500): Vencida (< 0 dias)
- Âmbar (border-l-amber-500): 1-30 dias
- Amarelo (border-l-yellow-400): 31-60 dias
- Azul (border-l-blue-500): 61-90 dias

### 6.5 Filtro Bar

**Padrão:** Filtros dispostos horizontalmente, com clear button, persistência em URL params

```tsx
// src/components/FilterBar.tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export function FilterBar({ filters, onChange, onClear }) {
  return (
    <div className="flex gap-4 items-end flex-wrap bg-gray-50 p-4 rounded-lg mb-6">
      <div className="flex-1 min-w-48">
        <label className="text-xs font-medium text-gray-700 mb-1 block">Cliente</label>
        <Select value={filters.client} onValueChange={(v) => onChange("client", v)}>
          <SelectTrigger>
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos</SelectItem>
            <SelectItem value="livelo">Livelo</SelectItem>
            <SelectItem value="natura">Natura</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 min-w-48">
        <label className="text-xs font-medium text-gray-700 mb-1 block">Status</label>
        <Select value={filters.status} onValueChange={(v) => onChange("status", v)}>
          <SelectTrigger>
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos</SelectItem>
            <SelectItem value="ativo">Ativo</SelectItem>
            <SelectItem value="desligado">Desligado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={onClear}
        className="gap-2"
      >
        <X className="w-4 h-4" />
        Limpar Filtros
      </Button>
    </div>
  )
}
```

### 6.6 Empty States

**Padrão:** Ícone, título, descrição, ação (opcional)

```tsx
// src/components/EmptyState.tsx
import { Button } from "@/components/ui/button"
import { InboxIcon } from "lucide-react"

export function EmptyState({
  icon: Icon = InboxIcon,
  title = "Nenhum dado",
  description = "Não há registros para exibir",
  action
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Icon className="w-16 h-16 text-gray-300 mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 mb-6">{description}</p>
      {action && (
        <Button onClick={action.onClick}>{action.label}</Button>
      )}
    </div>
  )
}
```

---

## 7. Layout Padrão

### 7.1 Estrutura de Página

```
┌─────────────────────────────────────────────────────────┐
│                    Header (Sticky)                       │
│  Logo  |  Search  |  Breadcrumb  |  Theme  |  User Menu │
├────────┬─────────────────────────────────────────────────┤
│        │                                                 │
│        │                                                 │
│ Sidebar│          Main Content Area                      │
│ 256px  │          (max-width: 1440px, centered)         │
│        │                                                 │
│        │                                                 │
└────────┴─────────────────────────────────────────────────┘
```

### 7.2 Sidebar (Desktop)

**Comportamento:**
- Fixed, 256px width
- Collapsible para 64px (icons only) via button no header
- Scroll interno se necessário
- Cores: Background diferente do body
- Items com hover e active states

```tsx
// src/components/Sidebar.tsx
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { LayoutDashboard, Users, Briefcase, AlertCircle, Cpu, Calendar } from "lucide-react"

export function AppSidebar() {
  return (
    <Sidebar className="border-r">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/dashboard" className="flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/profissionais" className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>Profissionais</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {/* Mais itens */}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
```

### 7.3 Header (Sticky)

**Componentes:**
- Logo/Branding (esquerda)
- Search input com ícone (centro-esquerda)
- Breadcrumb (centro)
- Theme toggle, user menu (direita)

```tsx
// src/components/Header.tsx
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Moon, Sun, LogOut } from "lucide-react"
import { useState } from "react"

export function Header() {
  const [theme, setTheme] = useState("light")

  return (
    <header className="sticky top-0 z-40 border-b bg-white">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg" />
          <span className="font-bold hidden sm:inline">Elopar</span>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-sm mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar profissional..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </Button>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline text-sm">João Doe</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Perfil</DropdownMenuItem>
              <DropdownMenuItem>Configurações</DropdownMenuItem>
              <DropdownMenuItem>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
```

### 7.4 Content Area

```tsx
// Padrão de página
<main className="flex-1 p-6 md:p-8">
  <div className="max-w-7xl mx-auto">
    {/* Page header com breadcrumb */}
    <PageHeader
      title="Profissionais"
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Profissionais", href: "/profissionais" }
      ]}
    />

    {/* Filtros */}
    <FilterBar filters={filters} onChange={handleFilter} />

    {/* Conteúdo principal */}
    <ProfessionalsTable data={data} />
  </div>
</main>
```

### 7.5 Mobile Layout

**Breakpoint: < 768px (md)**

- Sidebar → Sheet (slide-out drawer)
- Stack layout (colunas simples)
- Reduzir padding: `p-4` ao invés de `p-6`
- Headers menores
- Tabelas → scrolláveis horizontalmente ou card-based

```tsx
// Exemplo: Drawer mobile
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

export function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64">
        <AppSidebar />
      </SheetContent>
    </Sheet>
  )
}
```

### 7.6 Responsividade

Use classes Tailwind para responsividade:

```tsx
// Exemplo de layout responsivo
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* Colunas: 1 em mobile, 2 em tablet, 4 em desktop */}
  <KPICard />
</div>

<div className="flex flex-col lg:flex-row gap-6">
  {/* Stack em mobile, lado a lado em desktop */}
  <div className="flex-1">Chart 1</div>
  <div className="flex-1">Chart 2</div>
</div>
```

---

## 8. Configuração Tailwind CSS v4

### 8.1 Estrutura de Arquivos

```
src/
├── app/
│   ├── globals.css          (Variáveis CSS, temas)
│   └── layout.tsx           (Provider de tema)
├── components/
│   ├── ui/                  (shadcn/ui components)
│   ├── custom/              (Componentes customizados)
│   └── layout/              (Header, Sidebar, etc.)
└── styles/
    └── variables.css        (Variáveis de cor, espaçamento)
```

### 8.2 globals.css

```css
/* src/app/globals.css */

@import "tailwindcss/preflight";
@import "tailwindcss/utilities";

@theme {
  --color-primary-50: #eff6ff;
  --color-primary-100: #dbeafe;
  --color-primary-200: #bfdbfe;
  --color-primary-300: #93c5fd;
  --color-primary-400: #60a5fa;
  --color-primary-500: #3b82f6;
  --color-primary-600: #2563eb;
  --color-primary-700: #1d4ed8;
  --color-primary-800: #1e40af;
  --color-primary-900: #1e3a8a;

  /* Status colors */
  --color-success-50: #f0fdf4;
  --color-success-500: #22c55e;
  --color-success-600: #16a34a;

  --color-warning-50: #fffbeb;
  --color-warning-500: #f59e0b;
  --color-warning-600: #d97706;

  --color-danger-50: #fef2f2;
  --color-danger-500: #ef4444;
  --color-danger-600: #dc2626;

  --color-info-50: #eff6ff;
  --color-info-500: #3b82f6;
  --color-info-600: #2563eb;

  --color-neutral-500: #6b7280;
  --color-neutral-600: #4b5563;

  /* Font */
  --font-family-sans: var(--font-geist-sans);
  --font-family-mono: var(--font-geist-mono);

  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
}

/* Light mode (default) */
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 3.6%;
    --card: 0 0% 100%;
    --card-foreground: 0 0% 3.6%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 210 40% 98%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 220 13% 91%;
    --muted-foreground: 217.2 32.6% 17.5%;
    --accent: 220 13% 91%;
    --accent-foreground: 217.2 91.2% 59.8%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 220 13% 91%;
    --input: 220 13% 91%;
    --ring: 217.2 91.2% 59.8%;
    --radius: 0.5rem;
  }
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    --background: 220 13% 13%;
    --foreground: 210 40% 98%;
    --card: 217.2 32.6% 17.5%;
    --card-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 220 13% 13%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 210 40% 98%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 220 13% 13%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 217.2 91.2% 59.8%;
  }
}

/* Custom utilities */
@layer utilities {
  .text-balance {
    text-wrap: balance;
  }

  .truncate-lines-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .card-shadow {
    @apply shadow-md;
  }

  .card-hover {
    @apply hover:shadow-lg transition-shadow;
  }

  .badge-success {
    @apply bg-green-100 text-green-800;
  }

  .badge-warning {
    @apply bg-amber-100 text-amber-800;
  }

  .badge-danger {
    @apply bg-red-100 text-red-800;
  }
}

/* Font imports (se necessário) */
@supports (font-variation-settings: normal) {
  /* Fallback caso Geist não carregue via next/font */
}
```

### 8.3 tailwind.config.ts

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)"],
        mono: ["var(--font-geist-mono)"],
      },
      colors: {
        primary: "hsl(var(--color-primary))",
        success: "hsl(var(--color-success))",
        warning: "hsl(var(--color-warning))",
        danger: "hsl(var(--color-danger))",
        info: "hsl(var(--color-info))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-in": {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-in-out",
        "slide-in": "slide-in 0.3s ease-in-out",
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## 9. Mapa de Páginas (Sitemap)

### 9.1 Estrutura de Rotas

```
App Router (src/app)
├── (auth)/                    # Grupo não-autenticado
│   └── login/
│       └── page.tsx
├── (protected)/               # Grupo autenticado
│   ├── dashboard/
│   │   └── page.tsx
│   ├── profissionais/
│   │   ├── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   ├── clientes/
│   │   ├── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   ├── renovacoes/
│   │   └── page.tsx
│   ├── equipamentos/
│   │   └── page.tsx
│   └── ferias/
│       └── page.tsx
└── layout.tsx                 # Root layout
```

### 9.2 Página: `/login`

**Tipo:** Public page (não requer autenticação)
**Sprint:** 1 (MVP)

**Objetivo:**
Autenticar usuários via email e senha, integrado com Supabase Auth.

**Layout:**
- Tela de login simples, centralizada
- Logo do Elopar (topo)
- Email input
- Password input
- "Lembrar-me" checkbox
- Botão "Entrar"
- Link "Esqueceu senha?" (futuro)
- Link "Não tem conta?" → "Cadastre-se" (futuro)

**Estados:**
- Idle (inicial)
- Loading (enviando credenciais)
- Error (credenciais inválidas)
- Success (redireciona para /dashboard)

**Componentes:**
- Input (email)
- Input (password)
- Button (submit)
- Alert (erro)

**URL:** `/login`

**Redirecionamento:**
- Sucesso: → `/dashboard`
- Usuário já autenticado: → `/dashboard`

```tsx
// src/app/(auth)/login/page.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Supabase auth call aqui
      // await supabase.auth.signInWithPassword({ email, password })
      // router.push("/dashboard")
    } catch (err) {
      setError("Email ou senha inválidos")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-blue-600 rounded-lg mx-auto mb-4" />
            <h1 className="text-2xl font-bold">Elopar</h1>
            <p className="text-gray-500 mt-2">Gestão de Profissionais</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Email
              </label>
              <Input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Senha
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Carregando..." : "Entrar"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
```

### 9.3 Página: `/dashboard`

**Tipo:** Protected page (requer autenticação)
**Sprint:** 1 (MVP)
**Layout:** Header + Sidebar + Content

**Objetivo:**
Visão geral dos dados, KPIs principais, gráficos, alertas de renovação.

**Seções:**

#### 9.3.1 KPI Cards (4 cards em grid)

```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│ Total Prof.  │ Profissionais│ Desligados   │ Renovações   │
│    248       │   Ativos 210 │   38         │ Pendentes 12 │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

- **Card 1:** Total Profissionais = 248 (contagem simples)
- **Card 2:** Ativos = 210 (WHERE status = 'ativo')
- **Card 3:** Desligados = 38 (WHERE status = 'desligado')
- **Card 4:** Renovações Pendentes = 12 (WHERE vigência <= 90 dias)

Cada card com:
- Ícone relevante (Users, CheckCircle, XCircle, AlertCircle)
- Label descritivo
- Valor grande (mono font)
- Trend (% mudança ou delta desde mês anterior)
- Cor de border-left conforme categoria

#### 9.3.2 Gráficos (2 colunas em desktop, stack em mobile)

**Gráfico 1: Distribuição por Senioridade (Pie Chart)**

```
                Especialista
               /    |    \
          Sênior     |    Junior
               \     |    /
                 Pleno
```

Dados:
- Junior: 45 (18%)
- Pleno: 120 (48%)
- Sênior: 65 (26%)
- Especialista: 18 (8%)

Cores: Blue, Green, Amber, Purple

**Gráfico 2: Distribuição por Cliente (Bar Chart)**

```
Livelo         ████████████████
Natura         ███████
Boticário      ████
Outros         █
```

Top 5 clientes com maior número de profissionais.

#### 9.3.3 Tabela de Alertas de Renovação

| Profissional | Cliente | Vencimento | Dias | Status |
|---|---|---|---|---|
| João Silva | Livelo | 2026-04-15 | 10 | ⚠️ Crítico |
| Maria Santos | Natura | 2026-05-01 | 26 | ⚠️ Próximo |

**Filtro:** Período (Próximos 30 dias, 60 dias, 90 dias)

**Componentes:**
- 4× KPICard
- 2× Charts (Recharts)
- DataTable com status badges
- Select filtro (período)

**Estados de Carregamento:**
- Skeleton cards enquanto dados carregam
- Empty state se nenhuma renovação pendente

```tsx
// src/app/(protected)/dashboard/page.tsx
"use client"

import { KPICard } from "@/components/custom/KPICard"
import { DataTable } from "@/components/custom/DataTable"
import { PieChart, BarChart } from "@/components/charts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, CheckCircle, AlertCircle, TrendingUp } from "lucide-react"
import { useState, useEffect } from "react"

export default function DashboardPage() {
  const [period, setPeriod] = useState("90")
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Carregar dados do servidor
    // const data = await fetchDashboardData(period)
    // setData(data)
    setLoading(false)
  }, [period])

  if (loading) {
    return <div>Carregando...</div>
  }

  return (
    <main className="flex-1 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <KPICard
            icon={Users}
            label="Total de Profissionais"
            value="248"
            trend="+12"
            accentColor="blue"
          />
          <KPICard
            icon={CheckCircle}
            label="Profissionais Ativos"
            value="210"
            trend="+5"
            accentColor="green"
          />
          <KPICard
            icon={AlertCircle}
            label="Desligados"
            value="38"
            trend="+2"
            accentColor="red"
          />
          <KPICard
            icon={TrendingUp}
            label="Renovações Pendentes"
            value="12"
            trend="+3"
            accentColor="amber"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Senioridade</CardTitle>
            </CardHeader>
            <CardContent>
              <PieChart data={data?.seniorityData} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Cliente</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart data={data?.clientData} />
            </CardContent>
          </Card>
        </div>

        {/* Renewal Alerts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Alertas de Renovação</CardTitle>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">Próximos 30 dias</SelectItem>
                <SelectItem value="60">Próximos 60 dias</SelectItem>
                <SelectItem value="90">Próximos 90 dias</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <DataTable columns={renewalColumns} data={data?.renewals || []} />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
```

### 9.4 Página: `/profissionais`

**Tipo:** Protected page
**Sprint:** 2 (MVP)

**Objetivo:**
Lista completa de profissionais com filtros e search, acesso rápido a detalhes.

**Layout:**
- Filter bar (Cliente, Status, Senioridade, Tipo de Contrato)
- Search input (Nome, Email, OS)
- Table com paginação

**Colunas da Tabela:**

| OS | Nome | Cargo | Cliente | Senioridade | Status | Vigência | Ações |
|---|---|---|---|---|---|---|---|
| ELP-001 | João Silva | Dev Full Stack | Livelo | Sênior | ✓ Ativo | 2026-05-15 | ... |

**Filtros:**
- Cliente (dropdown, multi-select)
- Status (Ativo / Desligado)
- Senioridade (Junior, Pleno, Sênior, Especialista)
- Tipo de Contrato (CLT, PJ, CLT Estratégico)

**Search:**
- Nome do profissional
- Email
- OS

**Paginação:**
- 25 itens por página (padrão)
- Prev/Next buttons
- Ir para página X

**URL Params:**
```
/profissionais?client=livelo&status=ativo&seniority=senior&page=2&search=joão
```

**Ações:**
- Click na linha → `/profissionais/[id]`
- Hover → Ações (Menu dropdown) - futuro para edit, delete

```tsx
// src/app/(protected)/profissionais/page.tsx
"use client"

import { DataTable } from "@/components/custom/DataTable"
import { FilterBar } from "@/components/custom/FilterBar"
import { PageHeader } from "@/components/custom/PageHeader"
import { useSearchParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"

export default function ProfessionalsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  const filters = {
    client: searchParams.get("client") || "",
    status: searchParams.get("status") || "",
    seniority: searchParams.get("seniority") || "",
    contract: searchParams.get("contract") || "",
    search: searchParams.get("search") || "",
    page: searchParams.get("page") || "1",
  }

  const handleFilterChange = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams)
    if (value) {
      newParams.set(key, value)
    } else {
      newParams.delete(key)
    }
    newParams.set("page", "1")
    router.push(`/profissionais?${newParams.toString()}`)
  }

  const handleClearFilters = () => {
    router.push("/profissionais")
  }

  useEffect(() => {
    // Buscar dados com filtros
    // const data = await fetchProfessionals(filters)
    // setData(data)
    setLoading(false)
  }, [filters])

  return (
    <main className="flex-1 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <PageHeader
          title="Profissionais"
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Profissionais" }
          ]}
        />

        <FilterBar
          filters={filters}
          onChange={handleFilterChange}
          onClear={handleClearFilters}
        />

        <DataTable
          columns={professionalsColumns}
          data={data}
          loading={loading}
          onRowClick={(row) => router.push(`/profissionais/${row.id}`)}
        />
      </div>
    </main>
  )
}
```

### 9.5 Página: `/profissionais/[id]`

**Tipo:** Protected page
**Sprint:** 2 (MVP)

**Objetivo:**
Detalhes completos de um profissional, separados em abas.

**Layout:**
- Breadcrumb: Dashboard > Profissionais > João Silva
- Header com nome, status badge, ações (futuro: editar, deletar)
- 4 abas: Informações, Contrato, Financeiro, Histórico

#### Aba 1: Informações

```
┌─────────────────────────────────────┐
│ Nome              │ João Silva      │
│ Email             │ joao@livelo.com │
│ Gestor            │ Maria Santos    │
│ Contato           │ (11) 98765-4321 │
│ Perfil/Função     │ Dev Full Stack  │
│ Cargo             │ Senior Engineer │
└─────────────────────────────────────┘
```

#### Aba 2: Contrato

```
┌─────────────────────────────────────┐
│ OS                │ ELP-001         │
│ Senioridade       │ Sênior          │
│ Status            │ Ativo ✓         │
│ Tipo Contrato     │ CLT             │
│ Data Início       │ 2023-01-15      │
│ Vigência Atual    │ 2026-05-15      │
│ Dias até Vencimento │ [countdown]   │
│ Status Renovação  │ Pendente        │
└─────────────────────────────────────┘
```

Com destaque visual de countdown com cores (verde, âmbar, vermelho).

#### Aba 3: Financeiro

```
┌──────────────────────────────────────┐
│ Valor CLT         │ R$ 8.500,00      │
│ Valor Estratégico │ R$ 4.200,00      │
│ Total Mensal      │ R$ 12.700,00     │
│ Horas Extras      │ 40h / mês        │
│ Taxa Elopar       │ 15%              │
│ Faturamento       │ R$ 14.605,00     │
│ Período de Pág.   │ Mensal           │
└──────────────────────────────────────┘
```

#### Aba 4: Histórico (Futuro Sprint 4+)

Timeline de mudanças, eventos, renovações anteriores.

**Componentes:**
- Tabs (shadcn)
- Card para cada campo
- RenewalCountdown para visual de urgência
- Badge para status

```tsx
// src/app/(protected)/profissionais/[id]/page.tsx
"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/custom/PageHeader"
import { RenewalCountdown } from "@/components/custom/RenewalCountdown"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function ProfessionalDetailPage() {
  const { id } = useParams()
  const [professional, setProfessional] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Buscar dados do profissional
    // const data = await fetchProfessional(id)
    // setProfessional(data)
    setLoading(false)
  }, [id])

  if (loading) return <div>Carregando...</div>

  return (
    <main className="flex-1 p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <PageHeader
          title={professional?.name}
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Profissionais", href: "/profissionais" },
            { label: professional?.name }
          ]}
        />

        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="info">Informações</TabsTrigger>
            <TabsTrigger value="contract">Contrato</TabsTrigger>
            <TabsTrigger value="financial">Financeiro</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
          </TabsList>

          <TabsContent value="info">
            <Card>
              <CardHeader>
                <CardTitle>Dados Pessoais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Nome</label>
                    <p className="text-lg font-semibold">{professional?.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p className="text-lg">{professional?.email}</p>
                  </div>
                  {/* Mais campos */}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contract">
            <Card>
              <CardHeader>
                <CardTitle>Informações Contratuais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Campos do contrato */}
                <RenewalCountdown expiryDate={professional?.expiryDate} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Mais abas */}
        </Tabs>
      </div>
    </main>
  )
}
```

### 9.6 Página: `/clientes`

**Tipo:** Protected page
**Sprint:** 2 (MVP)

**Objetivo:**
Lista de clientes em formato de cards com resumo.

**Layout:**
- Grid responsivo: 2 colunas (desktop), 1 coluna (mobile)
- Cada card exibe:
  - Inicial/Logo do cliente
  - Nome
  - Total de profissionais
  - Faturamento total
  - Status indicator
- Click → `/clientes/[id]`

**Componentes:**
- Grid com cards customizados (ClientCard)
- Empty state se nenhum cliente

```tsx
// src/app/(protected)/clientes/page.tsx
"use client"

import { ClientCard } from "@/components/custom/ClientCard"
import { PageHeader } from "@/components/custom/PageHeader"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

export default function ClientsPage() {
  const router = useRouter()
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Buscar clientes
    // const data = await fetchClients()
    // setClients(data)
    setLoading(false)
  }, [])

  return (
    <main className="flex-1 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <PageHeader
          title="Clientes"
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Clientes" }
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map(client => (
            <ClientCard
              key={client.id}
              client={client}
              onClick={() => router.push(`/clientes/${client.id}`)}
            />
          ))}
        </div>
      </div>
    </main>
  )
}
```

### 9.7 Página: `/clientes/[id]`

**Tipo:** Protected page
**Sprint:** 2 (MVP)

**Objetivo:**
Resumo do cliente e lista de profissionais vinculados.

**Layout:**
- Header com informações do cliente
- KPI cards: Total profissionais, Ativo, Desligado, Faturamento
- Tabela de profissionais do cliente (com filtros)

### 9.8 Página: `/renovacoes`

**Tipo:** Protected page
**Sprint:** 3 (MVP)

**Objetivo:**
Visualização centralizada de renovações urgentes.

**Layout:**
- Tabs por urgência:
  - **Vencidas** (vermelho)
  - **1-30 dias** (âmbar)
  - **31-60 dias** (amarelo)
  - **61-90 dias** (azul)

Cada aba mostra cards de renovação com:
- Nome profissional
- Cliente
- Data de vencimento
- Countdown
- Ação: "Marcar como proposta enviada" (futuro)

```tsx
// src/app/(protected)/renovacoes/page.tsx
"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RenewalCard } from "@/components/custom/RenewalCard"
import { PageHeader } from "@/components/custom/PageHeader"
import { useState, useEffect } from "react"

export default function RenewalsPage() {
  const [renewals, setRenewals] = useState({
    expired: [],
    critical: [],
    warning: [],
    pending: [],
  })

  useEffect(() => {
    // Buscar renovações por categoria
    // const data = await fetchRenewals()
    // setRenewals(data)
  }, [])

  return (
    <main className="flex-1 p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <PageHeader
          title="Renovações"
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Renovações" }
          ]}
        />

        <Tabs defaultValue="critical">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="expired" className="bg-red-50">Vencidas</TabsTrigger>
            <TabsTrigger value="critical" className="bg-amber-50">1-30 dias</TabsTrigger>
            <TabsTrigger value="warning" className="bg-yellow-50">31-60 dias</TabsTrigger>
            <TabsTrigger value="pending" className="bg-blue-50">61-90 dias</TabsTrigger>
          </TabsList>

          <TabsContent value="expired" className="space-y-4">
            {renewals.expired.map(renewal => (
              <RenewalCard key={renewal.id} professional={renewal} daysUntil={-1} />
            ))}
          </TabsContent>

          {/* Mais abas */}
        </Tabs>
      </div>
    </main>
  )
}
```

### 9.9 Página: `/equipamentos`

**Tipo:** Protected page
**Sprint:** 3 (MVP)

**Objetivo:**
Inventário de equipamentos dos profissionais.

**Layout:**
- Search input (Profissional, Modelo, Empresa)
- Tabela com colunas:
  - Profissional
  - Empresa
  - Modelo
  - Tipo (Notebook, Desktop, Monitor, etc.)
  - Pacote Office (Sim/Não)
  - Software (lista)

### 9.10 Página: `/ferias`

**Tipo:** Protected page
**Sprint:** 3 (MVP)

**Objetivo:**
Acompanhamento de férias dos profissionais.

**Layout:**
- Calendar view (futuro)
- Tabela com colunas:
  - Área
  - Liderança
  - Profissional
  - Período Aquisitivo
  - Saldo de dias
  - Datas de férias marcadas

### 9.11 Páginas Futuras (Sprints 4+)

#### 9.11.1 `/profissionais/novo`
Form para criar novo profissional.

**Tipo:** Protected page
**Sprint:** 4 (CRUD)

**Campos:**
- Nome
- Email
- Gestor (select)
- Contato
- Perfil
- Cargo
- Senioridade
- Tipo de Contrato
- Cliente
- Data de início
- Salário/Valores
- Etc.

#### 9.11.2 `/profissionais/[id]/editar`
Form para editar profissional existente.

**Tipo:** Protected page
**Sprint:** 4 (CRUD)

**Mesmos campos do form de criação.**

#### 9.11.3 `/relatorios`
Relatórios exportáveis em PDF ou CSV.

**Tipo:** Protected page
**Sprint:** 5 (Relatórios)

**Tipos de relatórios:**
- Profissionais por cliente
- Renovações pendentes
- Faturamento
- Seniority distribution
- Etc.

#### 9.11.4 `/configuracoes`
Configurações do sistema (futuro: admin only).

**Tipo:** Protected page
**Sprint:** 5 (Admin)

**Seções:**
- Preferências
- Integrações
- Usuários (futuro: multi-user)
- Logs de auditoria (futuro)

#### 9.11.5 `/perfil`
Perfil do usuário logado.

**Tipo:** Protected page
**Sprint:** 5

**Campos:**
- Avatar
- Nome
- Email
- Preferências de tema
- Notificações
- Logout

---

## 10. Componentes Customizados

### 10.1 Estrutura de Diretórios

```
src/components/
├── ui/                      # shadcn/ui components (instalados)
├── custom/                  # Componentes próprios
│   ├── KPICard.tsx
│   ├── StatusBadge.tsx
│   ├── RenewalCountdown.tsx
│   ├── DataTable.tsx
│   ├── FilterBar.tsx
│   ├── SearchInput.tsx
│   ├── ClientCard.tsx
│   ├── RenewalCard.tsx
│   └── EmptyState.tsx
├── layout/                  # Componentes de layout
│   ├── Sidebar.tsx
│   ├── Header.tsx
│   ├── PageHeader.tsx
│   └── MainLayout.tsx
└── charts/                  # Gráficos (Recharts)
    ├── PieChart.tsx
    └── BarChart.tsx
```

### 10.2 KPICard

**Propósito:** Card de métrica com ícone, label, valor grande, trend

**Props:**
```typescript
interface KPICardProps {
  icon?: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  trend?: string;
  trendDirection?: "up" | "down";
  accentColor?: "green" | "amber" | "red" | "blue";
  onClick?: () => void;
}
```

**Exemplo:**
```tsx
<KPICard
  icon={Users}
  label="Total Profissionais"
  value={248}
  trend="+12"
  accentColor="blue"
/>
```

### 10.3 StatusBadge

**Propósito:** Badge com cor baseada em status, senioridade ou tipo de contrato

**Props:**
```typescript
interface StatusBadgeProps {
  type: "status" | "seniority" | "contract";
  value: string;
  size?: "sm" | "md" | "lg";
}
```

**Exemplo:**
```tsx
<StatusBadge type="status" value="ativo" />
<StatusBadge type="seniority" value="senior" />
<StatusBadge type="contract" value="clt" />
```

### 10.4 RenewalCountdown

**Propósito:** Visual countdown para renovações com cor por urgência

**Props:**
```typescript
interface RenewalCountdownProps {
  expiryDate: string | Date;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}
```

**Exemplo:**
```tsx
<RenewalCountdown expiryDate="2026-05-15" size="lg" />
```

**Retorna:**
```
Vigência: 2026-05-15 (41 dias) ← Verde se > 60d, Amarelo se 30-60d, Âmbar se 1-30d, Vermelho se < 0
```

### 10.5 DataTable

**Propósito:** Wrapper reutilizável para tabelas com sorting, filtering, pagination

**Props:**
```typescript
interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  loading?: boolean;
  pageSize?: number;
  onRowClick?: (row: T) => void;
  sortable?: boolean;
  filterable?: boolean;
}
```

**Exemplo:**
```tsx
const columns = [
  { accessorKey: "os", header: "OS" },
  { accessorKey: "name", header: "Nome" },
  { accessorKey: "status", header: "Status", cell: (row) => <StatusBadge {...} /> },
]

<DataTable
  columns={columns}
  data={professionals}
  onRowClick={(row) => router.push(`/profissionais/${row.id}`)}
  pageSize={25}
/>
```

### 10.6 FilterBar

**Propósito:** Barra de filtros composável

**Props:**
```typescript
interface FilterBarProps {
  filters: Record<string, string>;
  onChange: (key: string, value: string) => void;
  onClear: () => void;
  filterDefinitions?: FilterDefinition[];
}

interface FilterDefinition {
  key: string;
  label: string;
  type: "select" | "multiselect" | "search";
  options?: { label: string; value: string }[];
}
```

**Exemplo:**
```tsx
<FilterBar
  filters={{ client: "livelo", status: "ativo" }}
  onChange={(k, v) => router.push(`?${k}=${v}`)}
  onClear={() => router.push("/")}
/>
```

### 10.7 SearchInput

**Propósito:** Input com debounce e ícone

**Props:**
```typescript
interface SearchInputProps {
  placeholder?: string;
  onSearch: (value: string) => void;
  debounceMs?: number;
}
```

**Exemplo:**
```tsx
<SearchInput
  placeholder="Buscar profissional..."
  onSearch={(value) => handleSearch(value)}
  debounceMs={300}
/>
```

### 10.8 ClientCard

**Propósito:** Card de resumo do cliente

**Props:**
```typescript
interface ClientCardProps {
  client: {
    id: string;
    name: string;
    initial?: string;
    professionalCount: number;
    totalBilling: number;
    status: "ativo" | "inativo";
  };
  onClick?: () => void;
}
```

**Exemplo:**
```tsx
<ClientCard
  client={client}
  onClick={() => router.push(`/clientes/${client.id}`)}
/>
```

### 10.9 RenewalCard

**Propósito:** Card de renovação com urgência visual

**Props:**
```typescript
interface RenewalCardProps {
  professional: Professional;
  daysUntil: number;
  onAction?: (action: string) => void;
}
```

**Exemplo:**
```tsx
<RenewalCard
  professional={pro}
  daysUntil={15}
  onAction={(action) => handleAction(action)}
/>
```

### 10.10 EmptyState

**Propósito:** Estado vazio com ícone, mensagem e ação

**Props:**
```typescript
interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>;
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

### 10.11 PageHeader

**Propósito:** Header de página com breadcrumb e ações

**Props:**
```typescript
interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: { label: string; href?: string }[];
  actions?: { label: string; onClick: () => void }[];
}
```

### 10.12 Sidebar

**Propósito:** Navegação lateral responsiva

**Comportamento:**
- Desktop: Fixed, 256px
- Mobile: Sheet (drawer)
- Collapsible com toggle button

### 10.13 Header

**Propósito:** Header sticky com logo, search, theme toggle, user menu

**Comportamentos:**
- Sticky no top
- z-index suficiente (40)
- Responsive (menu collapsa em mobile)

### 10.14 ThemeToggle

**Propósito:** Toggle dark/light mode

**Implementação:**
- Salva preferência em localStorage
- Atualiza `prefers-color-scheme`
- Smooth transition

---

## 11. Diretrizes de Acessibilidade

### 11.1 WCAG 2.1 Level AA

Seguir as recomendações WCAG 2.1 nível AA para garantir acessibilidade:

- **Contraste:** Mínimo 4.5:1 para textos normais
- **Foco:** Indicadores visuais claros (outline, border)
- **Rótulos:** Todo input deve ter `<label>` associada
- **Semântica:** Usar tags HTML5 semânticas (`<button>`, `<a>`, `<nav>`, etc.)
- **ARIA:** Atributos ARIA quando necessário (role, aria-label, aria-describedby)

### 11.2 Keyboard Navigation

- Tab order lógico
- Todos os inputs navegáveis por teclado
- Modals com focus trap
- Esc para fechar modals

### 11.3 Leitores de Tela

```tsx
// Exemplo: Ícone com aria-label
<Button aria-label="Abrir menu do usuário">
  <Menu className="w-5 h-5" />
</Button>

// Exemplo: Input com label
<label htmlFor="email">Email</label>
<Input id="email" placeholder="seu@email.com" />

// Exemplo: Badge descritiva
<Badge aria-label="Status: ativo">
  <span className="w-2 h-2 bg-green-500 rounded-full" />
  Ativo
</Badge>
```

---

## 12. Estados de Carregamento e Erro

### 12.1 Skeleton Loading

Usar **Skeleton** do shadcn/ui para simular estrutura enquanto dados carregam:

```tsx
// src/components/custom/LoadingSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton"

export function KPICardSkeleton() {
  return (
    <div className="border rounded-lg p-6 space-y-4">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-10 w-32" />
      <Skeleton className="h-3 w-20" />
    </div>
  )
}

export function DataTableSkeleton({ rows = 5 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
        </div>
      ))}
    </div>
  )
}
```

### 12.2 Error States

```tsx
// Exemplo: Alert de erro
<Alert variant="destructive">
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>Erro ao carregar</AlertTitle>
  <AlertDescription>
    Não foi possível carregar os dados. Tente novamente.
  </AlertDescription>
  <Button variant="outline" size="sm" onClick={() => refetch()}>
    Tentar Novamente
  </Button>
</Alert>
```

### 12.3 Success Messages

```tsx
// Exemplo: Toast de sucesso (usando sonner)
import { toast } from "sonner"

toast.success("Profissional atualizado com sucesso!")
toast.error("Erro ao salvar profissional")
toast.loading("Salvando...")
```

---

## Conclusão

Este documento serve como **referência completa** para o desenvolvimento do Elopar Professional Management System. Segua estas diretrizes para garantir:

✅ Consistência visual
✅ Acessibilidade
✅ Responsividade
✅ Escalabilidade
✅ Manutenibilidade

**Dúvidas ou atualizações?** Consulte a especificação completa do projeto ou discuta com o time de product.

---

**Data de criação:** Abril de 2026
**Última atualização:** 2026-04-05
**Mantido por:** Tide Cardoso (Dev Fullstack)
