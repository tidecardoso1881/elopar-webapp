# Manual do Usuário — Gestão de Profissionais Elopar

Sistema web para gerenciamento dos profissionais alocados nos clientes do Grupo Elopar.

---

## Índice

1. [Acesso ao Sistema](#1-acesso-ao-sistema)
2. [Dashboard](#2-dashboard)
3. [Profissionais](#3-profissionais)
4. [Clientes](#4-clientes)
5. [Renovações de Contrato](#5-renovações-de-contrato)
6. [Equipamentos](#6-equipamentos)
7. [Férias](#7-férias)
8. [Tarefas Comuns (How-to)](#8-tarefas-comuns-how-to)
9. [Glossário](#9-glossário)
10. [Dúvidas Frequentes (FAQ)](#10-dúvidas-frequentes-faq)

---

## 1. Acesso ao Sistema

### Login

1. Acesse a URL do sistema (fornecida pelo responsável técnico)
2. Insira seu **e-mail** e **senha**
3. Clique em **Entrar**

Após o login, você será redirecionado automaticamente para o **Dashboard**.

### Esqueci minha senha

1. Na tela de login, clique em **Esqueci minha senha**
2. Informe seu e-mail cadastrado
3. Verifique sua caixa de entrada — você receberá um link para redefinição
4. Clique no link e defina uma nova senha
5. Faça login com a nova senha

> O link de redefinição expira em **1 hora**. Caso expire, repita o processo.

### Perfis de acesso

| Perfil | O que pode fazer | Limitações |
|--------|-----------------|-----------|
| **Admin** | Acesso total: visualizar, criar, editar e excluir qualquer registro | Nenhuma limitação |
| **Manager** | Visualizar e editar registros (exceto deleção) | Não pode excluir profissionais, clientes, equipamentos ou períodos de férias. Pode apenas editar informações. |
| **Viewer** (futuro) | Apenas visualizar dados, sem permissão de edição | Somente leitura |

> **Nota:** Seu perfil é definido pelo administrador. Contate-o se acredita que deveria ter mais permissões.

---

## 2. Dashboard

O Dashboard é a tela inicial após o login. Ele apresenta uma visão consolidada e em tempo real da situação dos profissionais.

### Cards de KPIs

No topo da página há 5 cards com indicadores principais. **Todos os cards são clicáveis** e levam direto para a listagem com filtro aplicado:

| Card | O que mostra | Cor |
|------|-------------|------|
| **Profissionais Ativos** | Total com status ATIVO (trabalhando agora). Clique para lista completa. | Verde |
| **Profissionais Inativos** | Total com status INATIVO/DESLIGADO (histórico). Clique para ver. | Cinza |
| **Renovações Críticas** | Contratos que **vencem em até 30 dias**. Clique para agir com urgência. | 🔴 Vermelho |
| **Renovações em Atenção** | Contratos que **vencem entre 31-60 dias**. Clique para planejar. | 🟡 Amarelo |
| **Total de Profissionais** | Soma de TODOS os profissionais (ativos + inativos) | Azul |

**Como usar:**
- Comece sua jornada clicando em "Renovações Críticas" se houver alguma
- Depois visualize o total de ativos para ter a visão geral
- O card de "Total" inclui histórico completo

### Tabela de Clientes

Abaixo dos cards, uma tabela mostra o resumo por cliente:

- Nome do cliente
- Quantidade de profissionais ativos
- Quantidade de profissionais desligados
- Faturamento consolidado (baseado nos salários dos ativos)

### Alertas de Renovação

Lista dos profissionais com contratos mais urgentes, com destaque por cor:

- 🔴 **Crítico** — vence em até 30 dias
- 🟡 **Atenção** — vence entre 31 e 60 dias

---

## 3. Profissionais

### Listagem

Acesse pelo menu lateral em **Profissionais**. A tabela exibe:

- Nome do profissional
- Cliente atual
- Status (ATIVO / INATIVO)
- Cargo
- Data de vencimento do contrato
- Status de renovação
- Ações (ver detalhes, editar)

**Busca e filtros:**
- Campo de busca por nome
- Filtros disponíveis conforme necessidade

### Detalhes do Profissional

Clique no nome ou no ícone de detalhes para abrir a página de detalhe. Informações disponíveis:

**Dados pessoais:**
- Nome completo, e-mail, telefone
- CPF, data de nascimento
- Endereço

**Dados contratuais:**
- Cliente, cargo, regime (CLT / PJ)
- Data de início e fim do contrato
- Salário / valor de nota fiscal
- Status do contrato

**Histórico:**
- Data de admissão e desligamento (se aplicável)
- Equipamentos vinculados
- Períodos de férias registrados

### Cadastrar Novo Profissional

1. Acesse **Profissionais** no menu
2. Clique em **Novo Profissional** (botão azul no topo)
3. Preencha os campos obrigatórios (marcados com `*`)
4. Clique em **Salvar**

**Campos obrigatórios:**
- **Nome completo** — nome exato conforme documento
- **E-mail** — deve ser válido e único no sistema
- **CPF** — apenas dígitos (sem pontos ou hífens)
- **Cliente** — selecione da lista dropdown (Alelo, Livelo, Veloe, etc.)
- **Cargo** — função exercida no cliente (Dev, Gerente, Analista, etc.)
- **Data de início** — data de admissão (formato DD/MM/AAAA)
- **Data de fim do contrato** — data de vencimento (formato DD/MM/AAAA)
  - Esta data é crítica para os alertas de renovação
- **Status** — selecione `ATIVO` para novos profissionais

**Campos opcionais:**
- Telefone
- Data de nascimento
- Endereço
- Regime (CLT ou PJ)
- Salário ou valor de NF
- Observações

> **Dica:** Erros em "Data de fim do contrato" causam alertas incorretos. Verifique duas vezes antes de salvar.

### Editar Profissional

1. Na listagem ou na página de detalhe, clique em **Editar**
2. Altere os campos desejados
3. Clique em **Salvar**

### Desligar Profissional

1. Abra o cadastro do profissional
2. Altere o **Status** para `INATIVO` ou `DESLIGADO`
3. Informe a data de desligamento
4. Salve as alterações

> Um profissional desligado continua no sistema para fins de histórico, mas não aparece nos KPIs de ativos.

---

## 4. Clientes

### Listagem

Acesse pelo menu lateral em **Clientes**. A tabela mostra:

- Nome do cliente
- Total de profissionais ativos
- Faturamento consolidado
- Ações (ver detalhes)

### Detalhes do Cliente

Clique no nome do cliente para ver:

- Informações do cliente (nome, segmento)
- Lista de profissionais **ativos** vinculados
- Lista de profissionais **desligados** (histórico)
- Faturamento total

### Cadastrar Novo Cliente

1. Acesse **Clientes** no menu
2. Clique em **Novo Cliente**
3. Preencha os campos:
   - **Nome** — nome oficial da empresa (ex: "Alelo", "Livelo")
   - **Segmento** — setor/ramo (ex: "Benefícios", "Tecnologia")
   - **Contato** — telefone ou e-mail da empresa (opcional)
   - **Endereço** — localização (opcional)
   - **Observações** — informações adicionais (opcional)
4. Clique em **Salvar**

Após criar o cliente, você poderá alocar profissionais a ele nos cadastros.

---

## 5. Renovações de Contrato

### Visão Geral

Acesse pelo menu lateral em **Renovações**. Esta tela centraliza todos os profissionais que precisam de atenção em relação ao vencimento de contrato.

### Busca por nome

Use o campo de busca no topo para localizar um profissional específico pelo nome.

### Status de renovação

| Status | Significado | Urgência |
|--------|-------------|----------|
| 🔴 Crítico | Contrato vence em até 30 dias | Alta — agir imediatamente |
| 🟡 Atenção | Contrato vence entre 31-60 dias | Média — planejar renovação |
| 🟢 OK | Contrato vence em mais de 60 dias | Baixa |
| ⚫ Inválido | Data de contrato inválida ou não informada | Verificar cadastro |

### Renovar um contrato

1. Localize o profissional na lista de **Renovações**
   - Profissionais com status "Crítico" (🔴) devem ser renovados com urgência
2. Clique em **Renovar** (botão com ícone de refresh na linha do profissional)
3. No modal que abrir:
   - **Nova Data de Vencimento** — informe a próxima data de término (formato DD/MM/AAAA)
   - Exemplo: Se o contrato vai vencer em 2026-12-31, preencha `31/12/2026`
4. Confirme clicando em **Salvar**

O status de renovação será atualizado automaticamente conforme a nova data:
- 🔴 **Crítico** se vencer em até 30 dias
- 🟡 **Atenção** se vencer entre 31-60 dias
- 🟢 **OK** se vencer em mais de 60 dias

> **Nota:** A data de vencimento também pode ser editada diretamente na página de detalhes do profissional.

---

## 6. Equipamentos

### Listagem

Acesse pelo menu lateral em **Equipamentos**. Exibe todos os equipamentos vinculados a profissionais.

Informações por equipamento:
- Tipo (notebook, celular, headset, etc.)
- Número de série ou identificador
- Profissional responsável
- Status (em uso, devolvido, etc.)

### Registrar Equipamento

1. Acesse **Equipamentos** no menu
2. Clique em **Novo Equipamento**
3. Preencha os campos:
   - **Tipo** — notebook, celular, headset, monitor, etc.
   - **Identificador** — número de série, IMEI, código interno, etc.
   - **Profissional** — selecione a pessoa responsável
   - **Status** — "Em Uso" ou "Devolvido"
   - **Observações** — detalhes adicionais (cor, configuração, etc.)
4. Clique em **Salvar**

### Editar ou Desvincular Equipamento

1. Acesse **Equipamentos** e clique no equipamento desejado
2. Clique em **Editar**
3. Altere:
   - Status (quando o profissional devolver)
   - Profissional responsável (transferência entre pessoas)
   - Observações
4. Clique em **Salvar**

> **Dica:** Ao desligar um profissional, marque seus equipamentos como "Devolvido" para manter o controle.

---

## 7. Férias

### Listagem

Acesse pelo menu lateral em **Férias**. Exibe os períodos de férias de todos os profissionais.

Informações:
- Profissional
- Cliente
- Data de início e fim das férias
- Duração (em dias)
- Status (aprovado, pendente)

### Registrar Férias

1. Acesse **Férias** no menu
2. Clique em **Novo Período de Férias**
3. Preencha os campos:
   - **Profissional** — selecione na lista
   - **Data de Início** — primeiro dia de férias (formato DD/MM/AAAA)
   - **Data de Fim** — último dia de férias (formato DD/MM/AAAA)
   - **Status** — "Aprovado" ou "Pendente"
   - **Observações** — motivo ou detalhes (opcional)
4. Clique em **Salvar**

A duração em dias é calculada automaticamente.

### Editar Período de Férias

1. Acesse **Férias** e clique no período desejado
2. Clique em **Editar**
3. Altere as datas, status ou observações
4. Clique em **Salvar**

### Filtrar por período

Use os filtros disponíveis para visualizar:
- **Férias de um período específico** — selecione o mês/ano
- **Férias de um cliente** — selecione o cliente para ver todos os seus profissionais em férias
- **Apenas aprovadas** — filtre por status

> **Dica:** Registre férias com antecedência para fins de planejamento de RH.

---

## 8. Tarefas Comuns (How-to)

### Como saber quais contratos vencem este mês?

1. Acesse o **Dashboard**
2. Clique no card **Renovações Críticas** ou **Renovações em Atenção**
3. A listagem de profissionais será exibida com filtro aplicado

Ou acesse diretamente **Renovações** no menu lateral.

### Como adicionar um profissional recém-contratado?

1. Acesse **Profissionais > Novo Profissional**
2. Preencha os dados pessoais e contratuais
3. Selecione o cliente correto e o status **ATIVO**
4. Salve — o profissional aparecerá imediatamente no Dashboard

### Como registrar o desligamento de um profissional?

1. Acesse **Profissionais** e localize o profissional
2. Clique em **Editar**
3. Altere o **Status** para `INATIVO` ou `DESLIGADO`
4. Informe a **Data de Desligamento**
5. Salve — o profissional sai dos KPIs de ativos mas permanece no histórico

### Como renovar um contrato que está prestes a vencer?

1. Acesse **Renovações** no menu lateral
2. Localize o profissional (use a busca por nome se necessário)
3. Clique em **Renovar**
4. Informe a nova data de vencimento no modal
5. Confirme — o status será atualizado automaticamente

### Como verificar todos os equipamentos de um profissional?

1. Acesse **Profissionais** e clique no nome do profissional
2. Na página de detalhes, role até a seção **Equipamentos**
3. Os equipamentos vinculados aparecerão listados

### Como ver o histórico de férias de um profissional?

1. Acesse **Profissionais** e abra a página de detalhes do profissional
2. Role até a seção **Férias**
3. Todos os períodos registrados aparecerão com datas e duração

### Como visualizar o faturamento por cliente?

1. Acesse o **Dashboard** — a tabela de clientes exibe o faturamento consolidado
2. Ou acesse **Clientes** e clique no nome do cliente para ver o detalhe

---

## 9. Glossário

| Termo | Definição |
|-------|-----------|
| **Profissional** | Pessoa alocada em um cliente do Grupo Elopar |
| **Cliente** | Empresa do Grupo onde os profissionais estão alocados (ex: Alelo, Livelo) |
| **Status ATIVO** | Profissional com contrato vigente e trabalhando atualmente |
| **Status INATIVO** | Profissional desligado ou afastado |
| **Renovação Crítica** | Contrato com vencimento em até 30 dias |
| **Renovação em Atenção** | Contrato com vencimento entre 31 e 60 dias |
| **Regime CLT** | Profissional contratado como funcionário (carteira assinada) |
| **Regime PJ** | Profissional contratado como pessoa jurídica (nota fiscal) |
| **KPI** | Key Performance Indicator — indicadores-chave exibidos no Dashboard |
| **Faturamento** | Soma dos salários/NFs dos profissionais ativos de um cliente |
| **Admin** | Perfil de usuário com acesso total ao sistema |
| **Manager** | Perfil de usuário com acesso de visualização e edição |
| **Data de Vencimento** | Data de término do contrato vigente do profissional |
| **Seed** | Processo de carga inicial de dados no sistema |

---

## 10. Dúvidas Frequentes (FAQ)

**O sistema não carrega após o login. O que fazer?**
Tente limpar o cache do navegador (Ctrl+Shift+Delete) e recarregar a página. Se persistir, entre em contato com o responsável técnico.

**Não consigo editar um profissional — o botão está desabilitado.**
Verifique seu perfil de acesso. Apenas usuários com perfil **Admin** ou **Manager** podem editar registros. Se acredita que deveria ter acesso, contate o administrador.

**Um profissional aparece como "Atenção" mesmo com contrato longo. Por quê?**
A data de vencimento do contrato pode estar preenchida incorretamente. Acesse o cadastro do profissional, verifique o campo **Data de Fim do Contrato** e corrija se necessário.

**Adicionei um profissional mas ele não aparece no Dashboard.**
O Dashboard atualiza em tempo real. Verifique se o **Status** do profissional está como `ATIVO`. Profissionais com status `INATIVO` não aparecem nos KPIs de ativos.

**Como mudo minha senha?**
Na tela de login, use a opção **Esqueci minha senha** para receber um link de redefinição por e-mail.

**Posso acessar o sistema de qualquer dispositivo?**
Sim. O sistema é responsivo e funciona em computadores, tablets e smartphones com qualquer navegador moderno (Chrome, Firefox, Edge, Safari).

**Os dados são seguros?**
Sim. O sistema usa HTTPS (criptografia em trânsito), autenticação obrigatória, e controle de acesso por perfil. Os dados são armazenados no Supabase com backups automáticos.

**Como adicionar um novo usuário ao sistema?**
Apenas administradores podem criar usuários. Entre em contato com o responsável técnico para solicitar a criação de um novo acesso.

---

## 11. Dicas e Melhores Práticas

### Segurança

1. **Não compartilhe sua senha**
   - Se outra pessoa precisa acessar, peça ao administrador para criar uma conta específica
   - Seu acesso é pessoal e rastreável

2. **Logout ao sair**
   - Sempre faça logout ao terminar sua sessão, principalmente em computadores compartilhados
   - Clique em seu nome no topo direito > **Logout**

3. **Senhas fortes**
   - Use senhas com letras maiúsculas, minúsculas, números e símbolos
   - Mude sua senha regularmente

### Eficiência

1. **Use a busca antes de navegar**
   - Procure por profissional / cliente / equipamento pelo nome em vez de rolar listas longas

2. **Filtros salvam tempo**
   - Filtre por cliente, status ou data para encontrar rapidamente o que precisa

3. **Dashboard como ponto de partida**
   - Comece pelo Dashboard para ter uma visão geral antes de mergulhar em detalhes
   - Os cards clicáveis levam direto para listas filtradas

4. **Renovações: aja com antecedência**
   - Não espere até a data crítica para renovar contratos
   - Assim que atingir "Atenção" (31-60 dias), comece o processo

### Dados

1. **Datas corretas são críticas**
   - Erros na data de vencimento afetam diretamente os alertas de renovação
   - Sempre revise a data ao criar ou editar um profissional

2. **CPF e dados pessoais**
   - Mantenha os dados pessoais atualizados para fins de auditoria e legal
   - Telefone e e-mail devem ser válidos para contato

3. **Status correto**
   - Use **ATIVO** apenas para profissionais que estão trabalhando atualmente
   - Mude para **INATIVO/DESLIGADO** no momento do desligamento, com a data correta

### Troubleshooting rápido

| Problema | Causa Comum | Solução |
|----------|-------------|---------|
| Dashboard não carrega | Conexão lenta ou erro temporário | Recarregue a página (F5) |
| Dados não aparecem | RLS ou seed não foi rodado | Contate o administrador |
| Botão desabilitado | Falta de permissão | Verifique seu perfil de acesso |
| Página em branco após login | Cache desatualizado | Limpe cache (Ctrl+Shift+Delete) |
| Tabela muito lenta | Muitos dados na tela | Use filtros para reduzir resultados |

---

*Manual do Usuário — Versão 1.1 | Abril 2026 | Sprint 6*
