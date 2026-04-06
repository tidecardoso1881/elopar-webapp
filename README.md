# Gestão de Profissionais — Grupo Elopar

Sistema web para gestão centralizada dos profissionais alocados nos clientes do Grupo Elopar. Substitui o controle via planilhas Excel por uma plataforma web segura, com acesso multi-usuário e dados em tempo real.

**Stack:** Next.js 14 · React 19 · TypeScript · Tailwind CSS v4 · Supabase (PostgreSQL + Auth) · Vercel

---

## Índice

- [Visão Geral](#visão-geral)
- [Setup Local](#setup-local)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Deploy](#deploy)
- [Documentação](#documentação)

---

## Visão Geral

O sistema gerencia ~100 profissionais ativos distribuídos em 6 clientes:

| Cliente | Segmento |
|---------|----------|
| Alelo | Benefícios |
| Livelo | Fidelidade |
| Veloe | Mobilidade |
| Pede Pronto | Delivery |
| Idea Maker | Tecnologia |
| Zamp | Alimentação |

**Funcionalidades principais:**
- Dashboard com KPIs e alertas de renovação de contrato
- Listagem, cadastro e edição de profissionais
- Gestão de clientes com visão consolidada
- Controle de renovações (crítico / atenção / ok)
- Gestão de equipamentos e férias
- Autenticação segura com Supabase Auth

---

## Setup Local

### Pré-requisitos

- Node.js 20+ e npm
- Conta no [Supabase](https://supabase.com) com projeto configurado
- Git

### Instalação

```bash
# Clone o repositório
git clone https://github.com/tidecardoso1881/elopar-webapp.git
cd elopar-webapp

# Instale as dependências
npm install

# Configure as variáveis de ambiente (veja seção abaixo)
cp .env.example .env.local
# edite .env.local com suas credenciais

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

---

## Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto baseado no arquivo `.env.example`:

```bash
cp .env.example .env.local
# Edite .env.local com suas credenciais
```

Variáveis necessárias:

```env
# Supabase — obtenha em: Supabase Dashboard > Project Settings > API
NEXT_PUBLIC_SUPABASE_URL=https://SEU_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_aqui
```

Veja `.env.example` para documentação completa de todas as variáveis.

> **Segurança:** Nunca commite `.env.local`. Ele já está no `.gitignore`.

**Para produção:** Configure essas variáveis no painel do Vercel em **Settings > Environment Variables**.

---

## Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento (localhost:3000) |
| `npm run build` | Build de produção |
| `npm run start` | Inicia o servidor de produção local |
| `npm run lint` | Verifica erros de lint (ESLint) |
| `npm run test` | Roda todos os testes (Vitest) |
| `npm run test:watch` | Testes em modo watch |
| `npm run test:coverage` | Relatório de cobertura de testes |
| `npm run seed` | Popula o banco com dados iniciais |
| `npm run seed:dry` | Simula o seed sem alterar o banco |
| `npm run seed:reset` | Reseta e repopula o banco |

---

## Deploy

O deploy é feito automaticamente pelo Vercel a cada push na branch `main`.

Para deploy manual ou configuração inicial, veja a documentação completa:

📄 **[docs/DEPLOY.md](docs/DEPLOY.md)** — Guia técnico de deploy, variáveis, troubleshooting e runbook de operações.

---

## Troubleshooting Rápido

| Problema | Solução |
|----------|---------|
| `Error: supabaseUrl is required` | Verifique se `NEXT_PUBLIC_SUPABASE_URL` está em `.env.local` |
| `Error: supabaseKey is required` | Verifique se `NEXT_PUBLIC_SUPABASE_ANON_KEY` está em `.env.local` |
| Servidor não inicia | Rode `npm install` novamente; pode haver dependências faltando |
| Tipos TypeScript errados | Rode `npx tsc --noEmit` para ver erros detalhados |
| Login não funciona | Verifique se o usuário existe em Supabase > Auth > Users |

Para mais detalhes: veja [docs/DEPLOY.md#9-troubleshooting](docs/DEPLOY.md#9-troubleshooting).

## Documentação

| Documento | Descrição |
|-----------|-----------|
| [docs/DEPLOY.md](docs/DEPLOY.md) | Guia de deploy, staging, produção e troubleshooting |
| [docs/MANUAL_USUARIO.md](docs/MANUAL_USUARIO.md) | Manual do usuário — como usar o sistema |
| [.env.example](.env.example) | Modelo de variáveis de ambiente |
| [docs/00-projeto/ESPECIFICACAO_PROJETO_v2.md](docs/00-projeto/ESPECIFICACAO_PROJETO_v2.md) | Especificação técnica do projeto |
| [docs/01-arquitetura/ARQUITETURA_SISTEMA.html](docs/01-arquitetura/ARQUITETURA_SISTEMA.html) | Diagrama de arquitetura |
| [E2E_TESTING.md](E2E_TESTING.md) | Guia de testes E2E com Playwright |

---

## Estrutura do Projeto

```
src/
├── app/
│   ├── (auth)/          # Login, reset de senha
│   ├── (dashboard)/     # Área autenticada
│   │   ├── dashboard/   # KPIs e alertas
│   │   ├── profissionais/
│   │   ├── clientes/
│   │   ├── renovacoes/
│   │   ├── equipamentos/
│   │   └── ferias/
│   └── api/             # API Routes
├── components/
│   ├── ui/              # Componentes base (shadcn/ui)
│   ├── layout/          # Sidebar, Header
│   └── ...              # Componentes por domínio
└── lib/
    ├── supabase/        # Clientes server/client
    ├── types/           # Tipos TypeScript (database.ts)
    └── utils/           # Formatação, helpers
```

---

## Licença

Uso interno — Grupo Elopar. Todos os direitos reservados.
