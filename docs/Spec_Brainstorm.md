ESPECIFICAÇÃO DO PROJETO
Sistema Web de Gestão de Profissionais - Grupo Elopar

Data: 04 de Abril de 2026
Versão: 1.0 - MVP
Status: Especificação Inicial
Stack: React + TypeScript + Node.js + PostgreSQL

Sumário Executivo
Este documento apresenta a especificação técnica e funcional para o desenvolvimento de um sistema web de gestão de profissionais do Grupo Elopar, focado em controlar equipes alocadas por cliente.
O MVP será desenvolvido em 1-2 meses utilizando React, TypeScript e Node.js, atendendo principalmente aos gestores de projeto.
O sistema consolidará dados de múltiplos clientes (Alelo, Livelo, Veloe, Pede Pronto, Idea Maker, Zamp) com controle de alocações, faturamento e informações administrativas.

1. Visão e Objetivos do Projeto
1.1 Visão Geral
Desenvolver uma plataforma web intuitiva e escalável que permita gestores de projeto visualizar, gerenciar e acompanhar profissionais alocados em diferentes clientes do Grupo Elopar, consolidando informações atualmente dispersas em planilhas Excel.
1.2 Objetivos Principais

Centralizar dados de profissionais em uma única plataforma web
Permitir filtros e buscas por cliente, senioridade, status e perfil
Visualizar informações críticas: alocações, datas de vigência, faturamento
Facilitar renovações de contratos com alertas para datas próximas
Gerar relatórios e dashboards para tomada de decisão
Melhorar a experiência do usuário em relação às planilhas

1.3 Problema que Resolve
Atualmente, o controle de profissionais é feito através de planilhas Excel com múltiplos sheets, dificultando a visualização consolidada, causando inconsistências de dados e tornando difícil acompanhar renovações e alertas.

2. Escopo do MVP (1-2 meses)
2.1 Funcionalidades Principais
Dashboard

Visão consolidada de profissionais por cliente
Contadores: Total de profissionais, Ativos, Desligados
Gráficos simples: Distribuição por senioridade, Status
Alertas: Vigências vencidas ou próximas do vencimento (30 dias)

Gestão de Profissionais

Listagem completa com filtros: Cliente, Status, Senioridade, Perfil
Visualizar detalhes: Nome, E-mail, Gestor, Datas, Cargo
Busca por nome ou e-mail
Ordenação por nome, data de início, data de saída

Gestão de Clientes

Visualizar profissionais agrupados por cliente
Resumo por cliente: Número de alocações, faturamento total

Alertas e Renovações

Listagem de profissionais com vigência próxima do vencimento
Marcação de propostas enviadas para renovação
Histórico de status (Ativo, Desligado)

2.2 Funcionalidades Futuras (Fases 2+)

Edição de dados diretamente no sistema
Gestão de equipamentos e férias
Relatórios avançados (Excel export)
Integração com sistema de RH/Folha
Autenticação e controle de acesso por papel
Notificações por e-mail
Mobile responsive completo

2.3 Exclusões do MVP

Edição de dados (será read-only)
Integração com sistemas externos
Multi-idioma
Relatórios em PDF/Excel
Autenticação social ou SSO


3. Usuários e Personas
3.1 Gestor de Projeto (Usuário Principal)
Descrição: Principal usuário do sistema
Necessidades principais:

Visualizar sua equipe alocada
Acompanhar datas de vigência
Verificar informações de contato dos profissionais
Receber alertas sobre renovações próximas

3.2 Administrativo/Financeiro (Usuário Secundário)
Descrição: Usuário com acesso para análise gerencial
Necessidades principais:

Visualizar faturamento por cliente
Acompanhar renovações
Gerar relatórios para análise


4. Arquitetura Técnica
4.1 Stack Tecnológico
CamadaTecnologiaFrontendReact 18 + TypeScript + ViteUI FrameworkMaterial-UI (MUI) ou Tailwind CSSBackendNode.js + Express + TypeScriptBanco de DadosPostgreSQLORMPrismaAutenticação (Futuro)JWTDeploymentDocker + AWS/Vercel
4.2 Estrutura de Pastas
frontend/
  ├─ src/
  │  ├─ components/
  │  ├─ pages/
  │  ├─ services/ (API calls)
  │  └─ styles/
  ├─ public/
  ├─ package.json
  └─ vite.config.ts

backend/
  ├─ src/
  │  ├─ routes/
  │  ├─ controllers/
  │  ├─ services/
  │  ├─ models/ (Prisma)
  │  └─ middleware/
  ├─ prisma/
  │  └─ schema.prisma
  ├─ package.json
  └─ tsconfig.json

5. Modelo de Dados
5.1 Entidades Principais
EntidadeDescriçãoClientesAlelo, Livelo, Veloe, Pede Pronto, Idea Maker, ZampProfissionaisNome, E-mail, Gestor, Cargo, Senioridade, StatusAlocaçõesProfissional + Cliente + Datas (início, saída, vigência)FaturamentoValor CLT, Valor Estratégico, Taxa, TotalEquipamentosMáquina, Software, ProfissionalFériasProfissional, Datas, Dias, Abono
5.2 Schema Principal (Prisma)
prismamodel Client {
  id        Int      @id @default(autoincrement())
  name      String   @unique
  professionals Professional[]
}

model Professional {
  id           Int      @id @default(autoincrement())
  os           Int      @unique
  name         String
  email        String   @unique
  manager      String
  profile      String
  position     String
  seniority    String   // JUNIOR, PLENO, SÊNIOR, ESPECIALISTA
  status       String   // ATIVO, DESLIGADO
  contractType String   // CLT, PJ, CLT ESTRATÉGICO

  dateStart    DateTime
  dateSaved    DateTime?
  dateVigStart DateTime?
  dateVigEnd   DateTime?

  valueCLT     Float
  valueStrategy Float
  hoursWorked  Int
  billing      Float

  client       Client   @relation(fields: [clientId], references: [id])
  clientId     Int

  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt()
}

model Equipment {
  id           Int      @id @default(autoincrement())
  name         String
  model        String
  professional String
  company      String
  officePackage Boolean
  createdAt    DateTime @default(now())
}

model Vacation {
  id           Int      @id @default(autoincrement())
  professional String
  area         String
  leader       String
  admissionDate DateTime
  acquisitionStart DateTime
  acquisitionEnd DateTime
  grantStart   DateTime
  grantEnd     DateTime
  daysBalance  Int
  daysToTake   Int
  vacationStart DateTime
  vacationEnd  DateTime
  days         Int
  createdAt    DateTime @default(now())
}

6. Fluxo de Usuário e Wireframes
6.1 User Journey Principal
Login → Dashboard → Filtrar por cliente → Visualizar profissionais → Ver detalhes → Alertas de renovação
6.2 Telas do MVP
TelaDescriçãoLoginE-mail + Senha (ou integração futura)DashboardKPIs, Gráficos, AlertasLista de ProfissionaisTabela com filtros, busca, ordenaçãoDetalhes do ProfissionalInformações completas, históricoGestão por ClienteProfissionais agrupados por clienteRenovaçõesAlertas de vigências próximas
6.3 Componentes Principais
Dashboard

Cards de KPIs (Total, Ativos, Desligados, Renovações pendentes)
Gráfico de senioridade (pie chart)
Gráfico de distribuição por cliente (bar chart)
Tabela de alertas (vigências próximas)

Lista de Profissionais

Filtros: Cliente, Status, Senioridade, Perfil
Campo de busca (nome, e-mail)
Tabela com: OS, Nome, Cargo, Cliente, Data Vigência, Status
Paginação
Exportar (futuro)

Detalhes do Profissional

Informações pessoais: Nome, E-mail, Gestor, Contato
Informações contratuais: OS, Cargo, Senioridade, Status, Tipo de contratação
Datas: Início, Saída, Vigência, Dias até vencer
Valores: CLT, Estratégico, Faturamento, Total
Histórico de status


7. Timeline do MVP (1-2 meses)
Semana 1-2: Setup e Estrutura

 Configurar repositórios Git
 Setup inicial do banco de dados PostgreSQL
 Design do schema Prisma
 Criar estrutura React/Vite
 Criar estrutura Node.js/Express
 Definir estilos base (Tailwind/MUI)

Semana 3-4: Backend Fundamentals

 Criar migrations Prisma
 Implementar endpoints de Clientes
 Implementar endpoints de Profissionais (GET, filtros)
 Implementar autenticação básica (JWT)
 Seeding de dados da planilha

Semana 5-6: Frontend Principal

 Página de Login
 Dashboard com KPIs e gráficos
 Lista de Profissionais com filtros e busca
 Página de Detalhes do Profissional
 Página de Gestão por Cliente
 Integração com API

Semana 7: Testes e Refinement

 Testes unitários (frontend + backend)
 Testes de integração
 Ajustes de performance
 Refino de UI/UX
 Tratamento de erros

Semana 8: Deploy e Documentação

 Containerizar com Docker
 Deploy em staging
 Deploy em produção
 Documentação de API
 Manual do usuário


8. Próximos Passos

Validar requisitos com stakeholders
Refinar wireframes e design UI
Preparar dados (importação do Excel para PostgreSQL)
Iniciar desenvolvimento do backend
Setup inicial do projeto React
Criar documentação de API
Agendamento das reuniões de feedback


9. Informações da Planilha Original
9.1 Sheets Disponíveis
SheetDescriçãoAleloProfissionais alocados em AleloLiveloProfissionais alocados em LiveloVeloeProfissionais alocados em VeloePede ProntoProfissionais alocados em Pede ProntoIdea MakerProfissionais alocados em Idea MakerZampProfissionais alocados em ZampDesligadosHistórico de profissionais desligadosEquipamentoRegistro de máquinas e equipamentosFériasGestão de férias e períodos aquisitivos
9.2 Campos Principais por Profissional

OS (Ordem de Serviço)
Nome do Profissional
E-mail
Gestor/Líder
Contato
Perfil/Cargo
Senioridade (Junior, Pleno, Sênior, Especialista)
Status (Ativo, Desligado)
Tipo de Contratação (CLT, PJ, CLT ESTRATÉGICO)
Data de Início
Data de Saída
Vigência OS (Início e Fim)
Prazo para Renovação
Valor CLT
Valor Estratégico
Horas Trabalhadas
R$ Pagamento
R$ Taxa de Faturamento
Faturamento Renovação
Valor Total de Faturamento

9.3 Estatísticas da Planilha

Total de Clientes: 6 principais
Total de Profissionais: ~100+ alocados
Profissionais Desligados: ~50+
Equipamentos Registrados: ~100+
Registros de Férias: ~13+


10. Critérios de Sucesso do MVP
✅ Dashboard carregando em < 2 segundos
✅ Filtros funcionando corretamente
✅ Busca retornando resultados em < 1 segundo
✅ Alertas de renovação identificando corretamente profissionais
✅ Taxa de satisfação do usuário > 80%
✅ 0 erros críticos em produção na primeira semana

11. Glossário
TermoSignificadoMVPMinimum Viable Product (Produto Mínimo Viável)OSOrdem de ServiçoCLTConsolidação das Leis do TrabalhoPJPessoa JurídicaSenioridadeNível de experiência (Junior, Pleno, Sênior, Especialista)Vigência OSPeríodo de validade da ordem de serviçoFaturamentoValor cobrado pelo cliente pelo serviço do profissionalSprintCiclo de desenvolvimento (geralmente 1-2 semanas)

Documento preparado para: Gestores de Projeto e Stakeholders
Próxima revisão: Após feedback inicial dos usuários

Especificação criada em: 04 de Abril de 2026