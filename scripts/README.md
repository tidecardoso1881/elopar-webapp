# Scripts de Seed - Elopar

Scripts para popular o banco de dados Supabase com dados de profissionais a partir do arquivo Excel.

## Estrutura

- **seed.ts** — Script principal que lê dados do Excel e insere no Supabase

## Pré-requisitos

1. Arquivo Excel em `docs/02-dados/CONTROLE_PROFISSIONAIS_GRUPO_ELOPAR.xlsx`
2. Clientes já criados na tabela `clients` (Alelo, Livelo, Veloe, Pede Pronto, Idea Maker, Zamp)
3. Variáveis de ambiente configuradas (`.env.seed` ou `.env.local`)

## Configuração

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Crie um arquivo `.env.seed` na raiz do projeto:

```bash
cp .env.seed.example .env.seed
```

Edite `.env.seed` e adicione suas credenciais:

```env
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=seu-service-role-key
```

## Uso

### Dry-run (testar sem inserir dados)

```bash
npm run seed:dry
```

Mostra quantos registros seriam inseridos e valida os dados sem fazer alterações no banco.

### Reset + Seed (limpar e repopular)

```bash
npm run seed:reset
```

Limpa a tabela `professionals` e insere todos os dados do Excel.

### Seed simples (apenas inserir)

```bash
npm run seed
```

Insere os profissionais do Excel no banco de dados.

## O que o script faz

1. **Extração**: Lê o arquivo Excel com múltiplas abas (uma por cliente)
2. **Transformação**:
   - Normaliza valores de senioridade (JÚNIOR → Junior, SÊNIOR → Senior, etc.)
   - Normaliza tipos de contrato (CLT ESTRÁTEGICO → CLT Estratégico)
   - Parseia datas do Excel para formato ISO (YYYY-MM-DD)
   - Normaliza emails (lowercase, valida @)
   - Valida dados obrigatórios
3. **Carregamento**: Insere dados no Supabase usando SERVICE_ROLE_KEY (bypass RLS)
4. **Relatório**: Mostra estatísticas de sucesso/erro

## Estrutura do Excel

O arquivo espera as seguintes abas:
- **Alelo** — Profissionais da Alelo
- **Livelo** — Profissionais da Livelo
- **Veloe** — Profissionais da Veloe
- **Pede Pronto** — Profissionais da Pede Pronto
- **Idea Maker** — Profissionais da Idea Maker
- **Zamp** — Profissionais da Zamp
- **Desligados** — Profissionais desligados (opcional para seed)

Cada aba deve ter um cabeçalho na linha 3 com colunas como:
- PROFISSIONAL (obrigatório) → name
- E-mail → email
- SENIORIDADE → seniority
- CARGO → role
- SQUAD → squad
- TIPO DE CONTRATAÇÃO → contract_type
- DATA INÍCIO → contract_start
- DATA DE SAÍDA → contract_end
- STATUS → status
- OBSERVAÇÕES → observations

## Normalização de Valores

### Senioridade

| Entrada | Saída |
|---------|-------|
| JÚNIOR, JUNIOR, Júnior | Junior |
| PLENO, Pleno | Pleno |
| SÊNIOR, SENIOR, Sênior, Senior | Senior |
| SÊNIOR II, SENIOR II, Sênior II | Senior II |
| ESPECIALISTA | Especialista |
| LÍDER, LIDER | Lider |
| GESTOR | Gestor |
| DIRETOR | Diretor |

### Tipo de Contrato

| Entrada | Saída |
|---------|-------|
| CLT ESTRÁTEGICO, CLT ESTRATÉGICO | CLT Estratégico |
| CLT | CLT |
| PJ | PJ |
| ESTÁGIO, ESTAGIO | Estágio |

### Status

| Entrada | Saída |
|---------|-------|
| ATIVO, Ativo | Ativo |
| INATIVO, Inativo | Inativo |
| DESLIGADO, Desligado | Desligado |
| FÉRIAS, Férias, ferias | Ferias |

## Tratamento de Erros

O script é robusto e:
- Ignora linhas com nome vazio
- Valida emails (deve conter @)
- Parseia datas flexivelmente (Excel serial, ISO, etc.)
- Reporta erros de cada linha sem parar a execução
- Mostra resumo final com total de sucesso/erro

## Idempotência

O script usa `insert()` que não duplica dados se executado múltiplas vezes com os mesmos dados (a menos que não haja constraint UNIQUE na tabela).

Para uma execução verdadeiramente idempotente, use `--reset`:

```bash
npm run seed:reset
```

## Troubleshooting

### "SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY não configurados"

- Verifique se `.env.seed` ou `.env.local` está na raiz do projeto
- Confirme que variáveis estão sem aspas
- Reinicie o shell se mudou variáveis de ambiente

### "Arquivo não encontrado"

- Verifique se `docs/02-dados/CONTROLE_PROFISSIONAIS_GRUPO_ELOPAR.xlsx` existe
- Execute o script da raiz do projeto

### "Aba não encontrada"

- Confirme que o Excel tem abas nomeadas: Alelo, Livelo, Veloe, Pede Pronto, Idea Maker, Zamp
- Verifique espaçamento e acentuação dos nomes

### "Cliente X não encontrado no banco"

- Execute primeiro o seed de clientes:
  ```sql
  INSERT INTO clients (name) VALUES
    ('Alelo'), ('Livelo'), ('Veloe'),
    ('Pede Pronto'), ('Idea Maker'), ('Zamp')
  ON CONFLICT (name) DO NOTHING;
  ```

## Próximos Passos

Após seed bem-sucedido:
1. Validar dados no Supabase Dashboard
2. Testar permissões RLS na aplicação
3. Consultar dados via API

## Referências

- Skill ETL: `/sessions/zealous-sharp-fermi/mnt/skills/excel-to-database-etl/SKILL.md`
- Arquivo Excel: `docs/02-dados/CONTROLE_PROFISSIONAIS_GRUPO_ELOPAR.xlsx`
- Supabase Docs: https://supabase.com/docs
