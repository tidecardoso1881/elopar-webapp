# Importação da Base — Elopar

Templates Excel para importação limpa dos dados no lançamento oficial.

## Pré-requisitos

```bash
pip install openpyxl requests python-dotenv
```

Configure a **service role key** no `.env.local` (nunca commite):

```env
NEXT_PUBLIC_SUPABASE_URL=https://pzqxbiutlnssnlthlyay.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # Settings → API → service_role key
```

## Ordem de preenchimento e importação

| # | Template | Tabela | Observação |
|---|---|---|---|
| 1 | `1_template_clientes.xlsx` | `clients` | Preencher **primeiro** |
| 2 | `2_template_profissionais.xlsx` | `professionals` | Requer clientes já importados |
| 3 | `3_template_equipamentos.xlsx` | `equipment` | Requer profissionais já importados |
| 4 | `4_template_ferias.xlsx` | `vacations` | Requer profissionais já importados |

## Como usar

1. Abra cada template e preencha a partir da **linha 3** (linha 2 é exemplo, pode apagar)
2. Consulte a aba **"Instruções"** de cada template para ver campos obrigatórios e valores aceitos
3. Execute o script a partir da raiz do projeto:

```bash
python scripts/import/import_from_excel.py
```

4. Confirme quando solicitado
5. Verifique o log gerado em `scripts/import/import_log_YYYY-MM-DD.txt`

## Regras de importação

- A importação é **idempotente** — rodar múltiplas vezes não duplica dados (upsert por nome)
- Clientes: upsert por `name` (único)
- Profissionais: upsert por `name` — se existir, atualiza os campos
- Equipamentos e férias: inserção direta por `professional_name`
- Linhas com campos obrigatórios vazios são **ignoradas** (aparecem no log)

## Campos com lista suspensa (validação no Excel)

| Template | Campo | Valores aceitos |
|---|---|---|
| Profissionais | Senioridade | `JUNIOR` / `PLENO` / `SENIOR` / `ESPECIALISTA` |
| Profissionais | Status | `ATIVO` / `DESLIGADO` |
| Profissionais | Tipo de Contrato | `CLT_ESTRATEGICO` / `PJ` / `CLT_ILATI` |
| Equipamentos | Pacote Office? | `SIM` / `NÃO` |
