# Sprint 5 - Backlog Detalhado

**Sprint:** 5 | **Período:** 2-15 de junho de 2026 | **Velocidade:** 34 story points

---

## EP-032: Formulário de criação de profissional

**Tipo:** Feature
**Story Points:** 8
**Prioridade:** P0 (Must Have)
**Status:** TODO

### Descrição

Como gerenciador, quero criar novos profissionais através de um formulário completo, para adicionar novos membros da equipe.

### Critérios de Aceitação

- [ ] Formulário com campos:
  - [ ] Nome (obrigatório)
  - [ ] Email (obrigatório, único)
  - [ ] Telefone
  - [ ] CPF/CNPJ (obrigatório, validado)
  - [ ] Senioridade (dropdown)
  - [ ] Data de Nascimento
  - [ ] Endereço
  - [ ] Tipo de Contrato (PJ, CLT, Freelancer)
- [ ] Validação em tempo real
- [ ] Mensagens de erro claras
- [ ] Botão de "Salvar" e "Cancelar"
- [ ] Após salvar, redireciona para detalhes
- [ ] Tratamento de erro se email duplicado

### Tarefas Técnicas

- [ ] Criar página `app/profissionais/novo/page.tsx`
- [ ] Usar React Hook Form + Zod
- [ ] Criar schema de validação completo
- [ ] Server action para inserir no Supabase
- [ ] Tratamento de erros
- [ ] Toast notification após sucesso

### Notas

- Reutilizar componentes em formulário de edição
- Considerar modo draft auto-save

---

## EP-033: Formulário de edição de profissional

**Tipo:** Feature
**Story Points:** 5
**Prioridade:** P0 (Must Have)
**Status:** TODO

### Descrição

Como gerenciador, quero editar informações de um profissional existente, para manter dados atualizados.

### Critérios de Aceitação

- [ ] Formulário pré-preenchido com dados atuais
- [ ] Mesmos campos da criação
- [ ] Versão do timestamp para otimistic locking
- [ ] Botão "Atualizar" apenas se houver mudanças
- [ ] Confirmação antes de salvar
- [ ] Histórico de quem editou e quando

### Tarefas Técnicas

- [ ] Criar página `app/profissionais/[id]/editar/page.tsx`
- [ ] Refatorar formulário como componente reutilizável
- [ ] Implementar versioning/optimistic locking
- [ ] Server action para UPDATE
- [ ] Audit log de alterações

---

## EP-034: Exclusão de profissional com confirmação

**Tipo:** Feature
**Story Points:** 3
**Prioridade:** P0 (Must Have)
**Status:** TODO

### Descrição

Como gerenciador, quero deletar um profissional quando necessário, com confirmação para evitar acidentes.

### Critérios de Aceitação

- [ ] Botão de deletar na página de detalhes
- [ ] Modal de confirmação mostrando dados
- [ ] Aviso se profissional tem contratos ativos
- [ ] Após deletar, redireciona para listagem
- [ ] Soft delete (marcar como inativo) em vez de físico

### Tarefas Técnicas

- [ ] Criar componente `DeleteConfirmationModal`
- [ ] Server action para soft delete
- [ ] Validação de contratos ativos
- [ ] Audit log de deleção

---

## EP-035: CRUD de clientes

**Tipo:** Feature
**Story Points:** 5
**Prioridade:** P0 (Must Have)
**Status:** TODO

### Descrição

Como gerenciador, quero gerenciar clientes (criar, editar, deletar), para manter informações de clients atualizadas.

### Critérios de Aceitação

- [ ] Páginas de criação, edição, detalhes
- [ ] Mesma estrutura de CRUD de profissionais
- [ ] Campos: Nome, CNPJ, Contato, Email, Telefone
- [ ] Validação CNPJ
- [ ] Confirmação antes de deletar

### Tarefas Técnicas

- [ ] Criar páginas em `app/clientes/`
- [ ] Reutilizar padrões de profissionais
- [ ] Server actions para CRUD

---

## EP-036: Validação de formulários (Zod + React Hook Form)

**Tipo:** Feature
**Story Points:** 5
**Prioridade:** P0 (Must Have)
**Status:** TODO

### Descrição

Como desenvolvedor, quero ter validação robusta de todos os formulários, para garantir integridade dos dados.

### Critérios de Aceitação

- [ ] Schema Zod para profissional
- [ ] Schema Zod para cliente
- [ ] Validações:
  - [ ] Email válido
  - [ ] CPF/CNPJ válido
  - [ ] Campos obrigatórios
  - [ ] Comprimento mínimo/máximo
  - [ ] Data válida
- [ ] Erros exibidos em campo
- [ ] Sumário de erros no topo

### Tarefas Técnicas

- [ ] Criar `lib/validations.ts` com schemas
- [ ] Integrar com React Hook Form
- [ ] Componente `FormError`
- [ ] Testes de validação

---

## EP-037: Optimistic updates e loading states

**Tipo:** Feature
**Story Points:** 3
**Prioridade:** P1 (Should Have)
**Status:** TODO

### Descrição

Como usuário, quero feedback imediato ao submeter um formulário, sem esperar resposta do servidor.

### Critérios de Aceitação

- [ ] Botão de submit desabilitado durante envio
- [ ] Spinner visual no botão
- [ ] Dados aparecem na UI antes da confirmação
- [ ] Se erro, revertido (rollback)
- [ ] Mensagem de sucesso/erro após resposta

### Tarefas Técnicas

- [ ] Usar useTransition do React
- [ ] Implementar optimistic state
- [ ] Toast notifications

---

## EP-038: Testes unitários e integração CRUD

**Tipo:** Testing
**Story Points:** 5
**Prioridade:** P1 (Should Have)
**Status:** TODO

### Descrição

Como desenvolvedor, quero testar todas as operações CRUD de forma completa.

### Critérios de Aceitação

- [ ] Testes para:
  - [ ] Criar profissional (sucesso e erro)
  - [ ] Editar profissional
  - [ ] Deletar profissional
  - [ ] CRUD de clientes
  - [ ] Validação de formulários
- [ ] Mocks de Supabase
- [ ] Testes de integ integração

### Tarefas Técnicas

- [ ] Testes Vitest para componentes
- [ ] Testes de server actions
- [ ] Cobertura > 80%

---

## Resumo da Sprint

| ID | Story | Pts | P | Status |
|---|---|---|---|---|
| EP-032 | Formulário de criação de profissional | 8 | P0 | TODO |
| EP-033 | Formulário de edição de profissional | 5 | P0 | TODO |
| EP-034 | Exclusão de profissional com confirmação | 3 | P0 | TODO |
| EP-035 | CRUD de clientes | 5 | P0 | TODO |
| EP-036 | Validação de formulários (Zod + React Hook Form) | 5 | P0 | TODO |
| EP-037 | Optimistic updates e loading states | 3 | P1 | TODO |
| EP-038 | Testes unitários e integração CRUD | 5 | P1 | TODO |

**Total:** 34 story points

---

**Última atualização:** 5 de abril de 2026
