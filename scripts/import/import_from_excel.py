"""
Elopar — Script de Importação da Base via Excel
================================================
Lê os 4 templates Excel preenchidos e importa os dados no Supabase.

Ordem de execução obrigatória:
  1. Clientes        → 1_template_clientes.xlsx
  2. Profissionais   → 2_template_profissionais.xlsx
  3. Equipamentos    → 3_template_equipamentos.xlsx
  4. Férias          → 4_template_ferias.xlsx

Uso:
  python scripts/import/import_from_excel.py

Requisitos:
  pip install openpyxl requests python-dotenv

Variáveis de ambiente (.env.local):
  NEXT_PUBLIC_SUPABASE_URL      → URL do projeto
  SUPABASE_SERVICE_ROLE_KEY     → Service role key (nunca a anon key para imports)
"""

import os
import sys
import json
import datetime
import openpyxl
import requests
from pathlib import Path

# ─── Config ──────────────────────────────────────────────────────────────────

SCRIPT_DIR   = Path(__file__).parent
PROJECT_ROOT = SCRIPT_DIR.parent.parent
TEMPLATES    = PROJECT_ROOT / "docs" / "importacao"
LOG_FILE     = SCRIPT_DIR / f"import_log_{datetime.date.today()}.txt"

# Tentar carregar .env.local
def load_env():
    env_path = PROJECT_ROOT / ".env.local"
    if env_path.exists():
        with open(env_path, encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    k, _, v = line.partition("=")
                    os.environ.setdefault(k.strip(), v.strip())

load_env()

SUPABASE_URL      = os.environ.get("NEXT_PUBLIC_SUPABASE_URL", "").rstrip("/")
SUPABASE_KEY      = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("❌ ERRO: Configure NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env.local")
    print("   SUPABASE_SERVICE_ROLE_KEY está em: Supabase Dashboard → Settings → API → service_role key")
    sys.exit(1)

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "resolution=merge-duplicates,return=minimal",
}

# ─── Log ─────────────────────────────────────────────────────────────────────

log_lines = []

def log(msg):
    print(msg)
    log_lines.append(msg)

def save_log():
    with open(LOG_FILE, "w", encoding="utf-8") as f:
        f.write("\n".join(log_lines))
    print(f"\n📄 Log salvo em: {LOG_FILE}")

# ─── Utilitários ─────────────────────────────────────────────────────────────

def clean_value(v):
    """Normaliza valores da planilha para JSON."""
    if v is None:
        return None
    if isinstance(v, datetime.datetime):
        return v.date().isoformat()
    if isinstance(v, datetime.date):
        return v.isoformat()
    if isinstance(v, float):
        if v != v:  # NaN
            return None
        return v
    if isinstance(v, str):
        v = v.strip()
        return v if v else None
    return v

def read_sheet(path: Path, expected_header_count: int = 2):
    """Lê a aba 'Dados' e retorna lista de dicts ignorando linhas vazias e linha de exemplo."""
    if not path.exists():
        log(f"⚠️  Arquivo não encontrado, pulando: {path.name}")
        return []

    wb = openpyxl.load_workbook(path, data_only=True)
    ws = wb["Dados"]
    rows = list(ws.iter_rows(values_only=True))

    if not rows:
        return []

    headers_raw = rows[0]  # linha 1 — cabeçalhos
    # Linha 2 é o exemplo — pular. Dados começam na linha 3 (índice 2)
    data_rows = rows[2:]

    headers = []
    for h in headers_raw:
        if h is None:
            headers.append(None)
        else:
            # Remove asterisco e espaços extras do label
            headers.append(str(h).replace(" *", "").strip())

    records = []
    for row in data_rows:
        if all(v is None or str(v).strip() == "" for v in row):
            continue  # linha completamente vazia

        record = {}
        for h, v in zip(headers, row):
            if h:
                record[h] = clean_value(v)
        records.append(record)

    return records


def supabase_upsert(table: str, records: list, conflict_col: str) -> tuple[int, int]:
    """Faz upsert no Supabase. Retorna (inseridos/atualizados, erros)."""
    if not records:
        return 0, 0

    url = f"{SUPABASE_URL}/rest/v1/{table}"
    headers = {**HEADERS, "Prefer": f"resolution=merge-duplicates,return=representation"}

    ok = 0
    errors = 0

    # Enviar em lotes de 50
    batch_size = 50
    for i in range(0, len(records), batch_size):
        batch = records[i:i + batch_size]
        resp = requests.post(url, headers=headers, json=batch)

        if resp.status_code in (200, 201):
            ok += len(batch)
        else:
            errors += len(batch)
            log(f"   ⚠️  Erro no lote {i//batch_size + 1}: {resp.status_code} — {resp.text[:200]}")

    return ok, errors


# ─── Importações ─────────────────────────────────────────────────────────────

def import_clients() -> dict:
    """Retorna {nome: uuid} após importar."""
    log("\n📥 [1/4] Importando Clientes...")
    records = read_sheet(TEMPLATES / "1_template_clientes.xlsx")

    if not records:
        log("   ℹ️  Nenhum dado encontrado.")
        return {}

    # Validação
    valid = []
    for r in records:
        nome = r.get("Nome do Cliente")
        if not nome:
            log(f"   ⚠️  Linha ignorada — campo 'Nome' vazio: {r}")
            continue
        valid.append({"name": nome})

    log(f"   📊 {len(valid)} clientes para importar")
    ok, err = supabase_upsert("clients", valid, "name")
    log(f"   ✅ {ok} importados | ❌ {err} erros")

    # Buscar UUIDs para usar em profissionais
    resp = requests.get(
        f"{SUPABASE_URL}/rest/v1/clients",
        headers={**HEADERS, "Prefer": ""},
        params={"select": "id,name"},
    )
    if resp.status_code == 200:
        return {c["name"]: c["id"] for c in resp.json()}
    return {}


def import_professionals(client_map: dict):
    log("\n📥 [2/4] Importando Profissionais...")
    records = read_sheet(TEMPLATES / "2_template_profissionais.xlsx")

    if not records:
        log("   ℹ️  Nenhum dado encontrado.")
        return

    FIELD_MAP = {
        "OS":                       "os",
        "Nome":                     "name",
        "E-mail":                   "email",
        "Gerente":                  "manager",
        "Contato":                  "contact",
        "Perfil":                   "profile",
        "Cargo":                    "position",
        "Senioridade":              "seniority",
        "Status":                   "status",
        "Tipo de Contrato":         "contract_type",
        "Data Início":              "date_start",
        "Data Fim":                 "date_end",
        "Contrato Início":          "contract_start",
        "Contrato Fim":             "contract_end",
        "Prazo Renovação":          "renewal_deadline",
        "Valor Hora (R$)":          "hourly_rate",
        "Valor CLT (R$)":           "value_clt",
        "Valor Estratégico (R$)":   "value_strategic",
        "Horas Trabalhadas":        "hours_worked",
        "Valor Pagamento (R$)":     "payment_value",
        "Outros Valores (R$)":      "other_values",
        "Taxa Faturamento (R$)":    "billing_rate",
        "Faturamento Renovação (R$)": "renewal_billing",
        "Faturamento Total (R$)":   "total_billing",
    }

    valid = []
    skipped = 0
    for r in records:
        nome = r.get("Nome")
        if not nome:
            skipped += 1
            continue

        cliente_nome = r.get("Cliente")
        client_id = client_map.get(cliente_nome) if cliente_nome else None
        if cliente_nome and not client_id:
            log(f"   ⚠️  Cliente '{cliente_nome}' não encontrado para '{nome}' — verifique se clientes foram importados")

        if not client_id:
            skipped += 1
            log(f"   ⏭️  '{nome}' ignorado — client_id não resolvido")
            continue

        row = {"client_id": client_id}
        for excel_col, db_col in FIELD_MAP.items():
            v = r.get(excel_col)
            if v is not None:
                row[db_col] = v

        # Validar enums
        if row.get("seniority") and row["seniority"] not in ("JUNIOR", "PLENO", "SENIOR", "ESPECIALISTA"):
            log(f"   ⚠️  Senioridade inválida '{row['seniority']}' para '{nome}' — campo será nulo")
            row["seniority"] = None

        if row.get("status") not in ("ATIVO", "DESLIGADO"):
            row["status"] = "ATIVO"

        if row.get("contract_type") and row["contract_type"] not in ("CLT_ESTRATEGICO", "PJ", "CLT_ILATI"):
            log(f"   ⚠️  Tipo de contrato inválido '{row['contract_type']}' para '{nome}' — campo será nulo")
            row["contract_type"] = None

        valid.append(row)

    log(f"   📊 {len(valid)} profissionais para importar | {skipped} ignorados")
    ok, err = supabase_upsert("professionals", valid, "name")
    log(f"   ✅ {ok} importados | ❌ {err} erros")


def import_equipment():
    log("\n📥 [3/4] Importando Equipamentos...")
    records = read_sheet(TEMPLATES / "3_template_equipamentos.xlsx")

    if not records:
        log("   ℹ️  Nenhum dado encontrado.")
        return

    FIELD_MAP = {
        "Nome do Profissional":  "professional_name",
        "Empresa":               "company",
        "Modelo da Máquina":     "machine_model",
        "Tipo de Máquina":       "machine_type",
        "Pacote Office?":        "office_package",
        "Detalhes de Software":  "software_details",
    }

    valid = []
    for r in records:
        nome = r.get("Nome do Profissional")
        if not nome:
            continue
        row = {}
        for excel_col, db_col in FIELD_MAP.items():
            v = r.get(excel_col)
            if v is not None:
                if db_col == "office_package":
                    row[db_col] = str(v).upper() in ("SIM", "TRUE", "1", "YES")
                else:
                    row[db_col] = v
        valid.append(row)

    log(f"   📊 {len(valid)} equipamentos para importar")
    ok, err = supabase_upsert("equipment", valid, "professional_name")
    log(f"   ✅ {ok} importados | ❌ {err} erros")


def import_vacations():
    log("\n📥 [4/4] Importando Férias...")
    records = read_sheet(TEMPLATES / "4_template_ferias.xlsx")

    if not records:
        log("   ℹ️  Nenhum dado encontrado.")
        return

    FIELD_MAP = {
        "Área / Cliente":    "client_area",
        "Liderança":         "leadership",
        "Nome do Profissional": "professional_name",
        "Data Admissão":     "admission_date",
        "Aquisição Início":  "acquisition_start",
        "Aquisição Fim":     "acquisition_end",
        "Concessão Início":  "concession_start",
        "Concessão Fim":     "concession_end",
        "Saldo de Dias":     "days_balance",
        "Férias Início":     "vacation_start",
        "Férias Fim":        "vacation_end",
        "Dias de Abono":     "bonus_days",
        "Total de Dias":     "total_days",
    }

    valid = []
    for r in records:
        nome = r.get("Nome do Profissional")
        if not nome:
            continue
        row = {}
        for excel_col, db_col in FIELD_MAP.items():
            v = r.get(excel_col)
            if v is not None:
                row[db_col] = v
        valid.append(row)

    log(f"   📊 {len(valid)} registros de férias para importar")
    ok, err = supabase_upsert("vacations", valid, "professional_name")
    log(f"   ✅ {ok} importados | ❌ {err} erros")


# ─── Main ─────────────────────────────────────────────────────────────────────

def main():
    log("=" * 60)
    log("  Elopar — Importação de Base via Excel")
    log(f"  Data: {datetime.datetime.now().strftime('%d/%m/%Y %H:%M')}")
    log(f"  Projeto: {SUPABASE_URL}")
    log("=" * 60)

    log(f"\n📂 Lendo templates de: {TEMPLATES}")

    # Verificar templates
    templates = [
        "1_template_clientes.xlsx",
        "2_template_profissionais.xlsx",
        "3_template_equipamentos.xlsx",
        "4_template_ferias.xlsx",
    ]
    for t in templates:
        p = TEMPLATES / t
        status = "✅" if p.exists() else "❌ NÃO ENCONTRADO"
        log(f"  {status}  {t}")

    print()
    confirm = input("Confirmar importação? (s/N): ").strip().lower()
    if confirm != "s":
        log("\n⚠️  Importação cancelada pelo usuário.")
        save_log()
        return

    client_map = import_clients()
    import_professionals(client_map)
    import_equipment()
    import_vacations()

    log("\n" + "=" * 60)
    log("  ✅ Importação concluída!")
    log("=" * 60)
    save_log()


if __name__ == "__main__":
    main()
