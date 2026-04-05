---
name: excel-to-database-etl
description: "Extract, transform, and load data from Excel/CSV files into databases (Supabase, PostgreSQL, SQLite). ALWAYS use this skill when: importing spreadsheet data to a database, migrating from Excel to Supabase, seeding databases from Excel files, converting spreadsheets to SQL, cleaning and normalizing spreadsheet data, building data pipelines from files to databases, or any task involving Excel/CSV to database migration or data import."
---

# Excel-to-Database ETL Skill

## Overview

ETL (Extract, Transform, Load) is a three-phase process for moving data from one system to another:

- **Extract**: Read data from source files (Excel, CSV, TSV)
- **Transform**: Clean, normalize, and map column names to database schema
- **Load**: Insert validated data into the database with error handling

This skill provides production-ready patterns for common ETL workflows.

### Common Use Cases

- Seeding new databases from Excel spreadsheets
- Importing employee/client data into Supabase
- Migrating from Excel-based workflows to database systems
- Normalizing inconsistent data across multiple sheets
- Building recurring data import pipelines
- Consolidating data from multiple Excel files into a single table

### Supported Formats

- `.xlsx` (Microsoft Excel 2007+)
- `.xls` (Excel 97-2003)
- `.csv` (Comma-separated values)
- `.tsv` (Tab-separated values)
- `.ods` (OpenDocument Spreadsheet)

## Dependencies

### Python Stack

```bash
# Core ETL libraries
pip install pandas openpyxl

# For better performance with large files
pip install xlrd

# For database connections
pip install supabase psycopg2-binary
```

### Node.js Stack

```bash
npm install xlsx
npm install @supabase/supabase-js  # for Supabase
npm install pg                      # for direct PostgreSQL
```

## ETL Pipeline Architecture

```
[Excel File]
     ↓
[Extract Phase] → Read file, get raw data
     ↓
[Raw Data] → Columns: ['PROFISSIONAL', 'E-mail', 'SENIORIDADE', ...]
     ↓
[Transform Phase] → Rename columns, convert types, normalize values
     ↓
[Clean Data] → Columns: ['name', 'email', 'seniority', ...]
     ↓
[Validate Phase] → Check required fields, verify enum values, detect duplicates
     ↓
[Valid Data] → Ready for database insertion
     ↓
[Load Phase] → Batch insert into database with conflict handling
     ↓
[Database] → Data persisted with audit trail
```

## Extract Phase

### Python (pandas + openpyxl)

```python
import pandas as pd
import openpyxl

# Read specific sheet
df = pd.read_excel('file.xlsx', sheet_name='Sheet1', header=3)

# Read all sheets into dictionary
all_sheets = pd.read_excel('file.xlsx', sheet_name=None)

# Handle merged cells and skip rows
df = pd.read_excel('file.xlsx', skiprows=3, header=0)

# Read CSV with custom delimiter
df = pd.read_csv('data.csv', sep=',', encoding='utf-8')

# Print column info for inspection
print(df.columns.tolist())
print(df.head(10))
print(df.info())
```

### Node.js (xlsx)

```typescript
import * as XLSX from 'xlsx';

const workbook = XLSX.readFile('file.xlsx');
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });

// Read specific sheet by name
const allSheets = XLSX.utils.sheet_to_json(workbook.Sheets['SheetName']);
```

## Transform Phase: Common Operations

### Column Mapping (Excel → Database)

Map Excel column names to database schema:

```python
COLUMN_MAP = {
    'PROFISSIONAL': 'name',
    'E-mail': 'email',
    'Gestor': 'manager',
    'SENIORIDADE': 'seniority',
    'STATUS': 'status',
    'TIPO DE CONTRATAÇÃO': 'contract_type',
    'DATA INÍCIO': 'date_start',
    'DATA DE SAÍDA': 'date_end',
    'VIGÊNCIA OS: INÍCIO': 'contract_start',
    'VIGÊNCIA OS: DATA FIM': 'contract_end',
    'VALOR CLT': 'value_clt',
    'VALOR ESTRATÉGICO': 'value_strategic',
}

df = df.rename(columns=COLUMN_MAP)
```

### Data Type Conversion

```python
# Convert to datetime
df['date_start'] = pd.to_datetime(df['date_start'], errors='coerce')
df['contract_end'] = pd.to_datetime(df['contract_end'], format='%d/%m/%Y', errors='coerce')

# Convert to numeric (replace errors with NaN)
df['value_clt'] = pd.to_numeric(df['value_clt'], errors='coerce')
df['hours_worked'] = df['hours_worked'].fillna(0).astype(int)

# String normalization
df['name'] = df['name'].str.strip()
df['email'] = df['email'].str.strip().str.lower()
df['status'] = df['status'].str.upper()
```

### Value Normalization (Enums & Lookups)

```python
# Seniority levels - normalize spelling variations
SENIORITY_MAP = {
    'JUNIOR': 'JUNIOR',
    'JÚNIOR': 'JUNIOR',
    'PLENO': 'PLENO',
    'SÊNIOR': 'SENIOR',
    'SÊNIOR II': 'SENIOR',
    'SENIOR': 'SENIOR',
    'ESPECIALISTA': 'ESPECIALISTA',
    'ESPECIALISTA I': 'ESPECIALISTA',
    'ESPECIALISTA II': 'ESPECIALISTA',
}
df['seniority'] = df['seniority'].map(SENIORITY_MAP)

# Contract types - fix typos and normalize
CONTRACT_MAP = {
    'CLT ESTRATÉGICO': 'CLT_ESTRATEGICO',
    'CLT ESTRÁTEGICO': 'CLT_ESTRATEGICO',  # typo correction
    'PJ': 'PJ',
    'CLT ILATI': 'CLT_ILATI',
}
df['contract_type'] = df['contract_type'].map(CONTRACT_MAP)

# Status values
STATUS_MAP = {
    'Ativo': 'ACTIVE',
    'Inativo': 'INACTIVE',
    'Afastado': 'ON_LEAVE',
    'Demitido': 'TERMINATED',
}
df['status'] = df['status'].map(STATUS_MAP)
```

### Handling Missing Data

```python
# Remove rows missing critical fields
df = df.dropna(subset=['name', 'email'])

# Fill optional fields with defaults
df['hours_worked'] = df['hours_worked'].fillna(0).astype(int)
df['value_clt'] = df['value_clt'].fillna(0.0)
df['status'] = df['status'].fillna('ACTIVE')

# Custom fill logic
df['manager'] = df['manager'].where(df['manager'].notna(), 'Unassigned')
```

## Validate Phase

Validate data before loading:

```python
def validate_row(row, errors_list):
    """Return True if valid, False if invalid"""
    errors = []

    # Required fields
    if not row.get('name') or pd.isna(row.get('name')):
        errors.append('Missing name')

    if not row.get('email') or pd.isna(row.get('email')):
        errors.append('Missing email')

    # Email format validation
    if row.get('email') and '@' not in str(row['email']):
        errors.append(f'Invalid email: {row["email"]}')

    # Enum validation
    if row.get('seniority') not in [None, 'JUNIOR', 'PLENO', 'SENIOR', 'ESPECIALISTA']:
        errors.append(f'Unknown seniority: {row["seniority"]}')

    if row.get('status') not in [None, 'ACTIVE', 'INACTIVE', 'ON_LEAVE', 'TERMINATED']:
        errors.append(f'Unknown status: {row["status"]}')

    # Date validation
    if pd.isna(row.get('date_start')):
        errors.append('Missing start date')

    if errors:
        errors_list.append({'row': row, 'errors': errors})
        return False

    return True

# Validate all rows
errors = []
valid_rows = []
for idx, row in df.iterrows():
    if validate_row(row, errors):
        valid_rows.append(row)

valid_df = pd.DataFrame(valid_rows)
print(f'Valid rows: {len(valid_df)}, Errors: {len(errors)}')
```

## Load Phase

### Supabase (Python SDK)

```python
from supabase import create_client
import os

supabase = create_client(
    url=os.getenv('SUPABASE_URL'),
    key=os.getenv('SUPABASE_KEY')
)

# Convert DataFrame to list of dicts
records = valid_df.to_dict('records')

# Batch insert (Supabase has request size limits)
batch_size = 100
loaded = 0

for i in range(0, len(records), batch_size):
    batch = records[i:i+batch_size]
    response = supabase.table('professionals').insert(batch).execute()
    loaded += len(batch)
    print(f'Loaded {loaded}/{len(records)}')

print(f'Successfully loaded {loaded} records')
```

### Direct SQL (MCP or psycopg2)

```python
import psycopg2

conn = psycopg2.connect(os.getenv('DATABASE_URL'))
cur = conn.cursor()

# Prepare data
insert_sql = """
INSERT INTO professionals (name, email, seniority, status, contract_type, date_start)
VALUES (%s, %s, %s, %s, %s, %s)
ON CONFLICT (email) DO UPDATE SET
    seniority = EXCLUDED.seniority,
    status = EXCLUDED.status,
    contract_type = EXCLUDED.contract_type,
    date_start = EXCLUDED.date_start
"""

# Execute batch
records = [
    (r['name'], r['email'], r['seniority'], r['status'], r['contract_type'], r['date_start'])
    for r in valid_df.to_dict('records')
]

cur.executemany(insert_sql, records)
conn.commit()
cur.close()
conn.close()

print(f'Loaded {cur.rowcount} records')
```

## Multi-Sheet Strategy

For workbooks with multiple sheets (one per client):

```python
import pandas as pd

CLIENT_SHEETS = ['Alelo', 'Livelo', 'Veloe', 'Pede Pronto', 'Idea Maker', 'Zamp']

all_professionals = []
errors_by_sheet = {}

for sheet_name in CLIENT_SHEETS:
    try:
        df = pd.read_excel('professionals.xlsx', sheet_name=sheet_name, header=3)
        df['client_name'] = sheet_name

        # Apply transformations (columns may differ per sheet)
        df = transform_sheet(df, sheet_name)

        # Validate
        valid, errors = validate_dataframe(df)
        errors_by_sheet[sheet_name] = errors

        all_professionals.append(valid)
        print(f'{sheet_name}: {len(valid)} valid, {len(errors)} errors')

    except Exception as e:
        print(f'Error reading {sheet_name}: {e}')
        errors_by_sheet[sheet_name] = [str(e)]

# Combine all sheets
combined = pd.concat(all_professionals, ignore_index=True)
print(f'Total: {len(combined)} records ready to load')
```

## Error Handling & Logging

```python
import logging
import json

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('etl.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger('etl')

# Log pipeline stats
logger.info(f'Extracted {len(df)} rows from {sheet_name}')
logger.info(f'Transformed: {len(valid_df)} valid, {len(error_df)} errors')
logger.info(f'Loaded {loaded_count} rows to database')

# Save error report
if len(error_df) > 0:
    error_df.to_csv('etl_errors.csv', index=False)
    logger.warning(f'Errors saved to etl_errors.csv')

# Log summary
summary = {
    'timestamp': str(datetime.now()),
    'file': filename,
    'extracted': len(df),
    'valid': len(valid_df),
    'errors': len(error_df),
    'loaded': loaded_count,
    'duration_seconds': duration
}
with open('etl_summary.json', 'w') as f:
    json.dump(summary, f, indent=2)
```

## Idempotent Runs

Design ETL for safe re-runs:

```python
# Use UPSERT (INSERT ... ON CONFLICT)
upsert_sql = """
INSERT INTO professionals (id, name, email, seniority)
VALUES (%s, %s, %s, %s)
ON CONFLICT (email) DO UPDATE SET
    name = EXCLUDED.name,
    seniority = EXCLUDED.seniority,
    updated_at = NOW()
"""

# Track import runs
import_meta_sql = """
INSERT INTO etl_runs (filename, imported_at, record_count, error_count)
VALUES (%s, %s, %s, %s)
"""

# Dry-run mode
DRY_RUN = True
if DR