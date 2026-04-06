# Sprint 6 - Backlog Detalhado

**Sprint:** 6 | **Período:** 16-29 de junho de 2026 | **Velocidade:** 40 story points

---

## EP-039: Export para Excel

**Tipo:** Feature
**Story Points:** 8
**Prioridade:** P0 (Must Have)
**Status:** TODO

### Descrição

Como gerenciador, quero exportar dados de profissionais e clientes para Excel, para análises externas e backup.

### Critérios de Aceitação

- [ ] Botões de export em cada página (Profissionais, Clientes, Equipamentos, Férias)
- [ ] Exporta dados aplicando filtros atuais
- [ ] Arquivo com nome descritivo e data
- [ ] Múltiplas abas no Excel se múltiplas tabelas
- [ ] Formatação legível (headers em negrito, colunas redimensionadas)
- [ ] Inclui totalizadores/sumários
- [ ] Performance: < 5s mesmo com 10k registros
- [ ] Feedback visual durante export

### Tarefas Técnicas

- [ ] Usar biblioteca `xlsx` ou `exceljs`
- [ ] Criar utility `exportToExcel()`
- [ ] Server action para montar dados
- [ ] Formatação de células (datas, moedas, etc.)
- [ ] Testes com grandes datasets

### Notas

- Considerar export de gráficos em futuro
- Documentar compatibilidade (Excel, LibreOffice, Sheets)

---

## EP-040: Relatórios básicos

**Tipo:** Feature
**Story Points:** 8
**Prioridade:** P1 (Should Have)
**Status:** TODO

### Descrição

Como gerenciador, quero gerar relatórios básicos (por cliente, por período), para análises de negócio.

### Critérios de Aceitação

- [ ] Relatórios disponíveis:
  - [ ] Profissionais por Cliente
  - [ ] Contratos por Período
  - [ ] Equipamentos por Profissional
- [ ] Filtros por data (data de início e fim)
- [ ] Sumários e totalizadores
- [ ] Gráficos simples (barras, pizza)
- [ ] Exportável para PDF
- [ ] Printable com formatação

### Tarefas Técnicas

- [ ] Criar página `app/relatorios/page.tsx`
- [ ] Componentes para cada tipo de relatório
- [ ] Queries otimizadas para aggregations
- [ ] PDF generation com `jspdf` + `html2canvas`
- [ ] Testes de geração

---

## EP-041: Audit log de mudanças

**Tipo:** Feature
**Story Points:** 5
**Prioridade:** P2 (Could Have)
**Status:** TODO

### Descrição

Como sistema, quero manter registro de todas as mudanças (quem, quando, o quê), para compliance e debugging.

### Critérios de Aceitação

- [ ] Tabela `audit_log` com:
  - [ ] Usuário que fez mudança
  - [ ] Timestamp
  - [ ] Tabela afetada
  - [ ] Operação (INSERT, UPDATE, DELETE)
  - [ ] Dados antigos e novos
- [ ] Trigger automático em UPDATE/DELETE
- [ ] Página de visualização de audit log
- [ ] Filtro por tabela/usuário/data
- [ ] Retenção de 1 ano

### Tarefas Técnicas

- [ ] Criar migration para tabela `audit_log`
- [ ] Triggers em PostgreSQL
- [ ] RLS policy para audit log
- [ ] Página de visualização
- [ ] Testes de triggers

---

## EP-042: Notificações por email

**Tipo:** Feature
**Story Points:** 8
**Prioridade:** P2 (Could Have)
**Status:** TODO

### Descrição

Como sistema, quero enviar notificações por email de eventos importantes (alertas de renovação, criação de usuário).

### Critérios de Aceitação

- [ ] Eventos que disparam email:
  - [ ] Contrato próximo de renovação
  - [ ] Novo profissional criado
  - [ ] Equipamento indisponível
- [ ] Templates de email profissionais
- [ ] Suporte a variáveis (nome, data, etc.)
- [ ] Histórico de emails enviados
- [ ] Opt-out de emails
- [ ] Fallback em caso de falha de envio

### Tarefas Técnicas

- [ ] Usar provider (SendGrid, Resend ou AWS SES)
- [ ] Criar Supabase Edge Function para envio
- [ ] Configurar templates HTML
- [ ] Implementar fila de emails (se necessário)
- [ ] Logging de envios
- [ ] Testes de envio (sandbox mode)

### Notas

- Escolher provider na primeira daily
- Considerare rate limiting
- Documentar variáveis de ambiente

---

## EP-043: Teste de carga e performance final

**Tipo:** Testing
**Story Points:** 3
**Prioridade:** P1 (Should Have)
**Status:** TODO

### Descrição

Como sistema, quero validar que aplicação suporta uso esperado sem degradação.

### Critérios de Aceitação

- [ ] Teste com 100 usuários simultâneos
- [ ] Response time < 2s (p95)
- [ ] Zero errors under load
- [ ] Database connections gerenciadas
- [ ] Memory não vaza
- [ ] Relatório de resultados

### Tarefas Técnicas

- [ ] Usar k6 ou Locust para load testing
- [ ] Script de teste com cenários realistas
- [ ] Monitor de recursos durante teste
- [ ] Análise de bottlenecks
- [ ] Documentar conclusões

---

## EP-044: Documentação de deploy e manual do usuário

**Tipo:** Documentation
**Story Points:** 5
**Prioridade:** P0 (Must Have)
**Status:** TODO

### Descrição

Como desenvolvedor/usuário, quero ter documentação clara de como deployar e operar a aplicação.

### Critérios de Aceitação

- [ ] Documentação técnica:
  - [ ] Setup local (desenvolvimento)
  - [ ] Deploy em staging
  - [ ] Deploy em produção
  - [ ] Variáveis de ambiente
  - [ ] Troubleshooting comum
- [ ] Manual do usuário:
  - [ ] Visão geral das funcionalidades
  - [ ] How-to para tarefas comuns
  - [ ] Glossário
  - [ ] Screenshots/vídeos
- [ ] Runbook de operações
- [ ] Plano de contingência

### Tarefas Técnicas

- [ ] Criar documentação em Markdown
- [ ] Incluir em `README.md` do projeto
- [ ] Screenshots das páginas principais
- [ ] Exemplos de uso
- [ ] Versionamento de docs

---

## EP-045: Deploy em produção no Vercel

**Tipo:** Deployment
**Story Points:** 3
**Prioridade:** P0 (Must Have)
**Status:** TODO

### Descrição

Como sistema, quero fazer o deploy do aplicativo em produção, disponibilizando para usuários.

### Critérios de Aceitação

- [ ] Domínio customizado configurado
- [ ] SSL/TLS ativo
- [ ] Environment variables em produção
- [ ] Database em produção (Supabase prod)
- [ ] Backup automático habilitado
- [ ] Monitoring e alertas configurados
- [ ] Zero downtime deployment
- [ ] Rollback plan testado

### Tarefas Técnicas

- [ ] Conectar repositório GitHub ao Vercel
- [ ] Configurar env vars em Vercel
- [ ] Setup do domínio (DNS records)
- [ ] Teste de deploy em staging
- [ ] Deploy para produção
- [ ] Smoke tests em produção
- [ ] Monitoring (Sentry, DataDog, etc.)

### Notas

- Usar Vercel Preview Deployments para QA
- Manter CI/CD pipeline funcionando
- Documentar processo em PLANO_EXECUCAO.md

---

## Resumo da Sprint

| ID | Story | Pts | P | Status |
|---|---|---|---|---|
| EP-039 | Export para Excel | 8 | P0 | TODO |
| EP-040 | Relatórios básicos | 8 | P1 | TODO |
| EP-041 | Audit log de mudanças | 5 | P2 | TODO |
| EP-042 | Notificações por email | 8 | P2 | TODO |
| 