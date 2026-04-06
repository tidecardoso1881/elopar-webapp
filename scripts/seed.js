import * as XLSX from 'xlsx';
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load env vars
dotenv.config({ path: path.join(process.cwd(), '.env.local') });
dotenv.config({ path: path.join(process.cwd(), '.env.seed') });

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Erro: SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY não configurados');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Normalization maps - valores devem corresponder às constraints do banco:
// seniority: JUNIOR | PLENO | SENIOR | ESPECIALISTA
// status: ATIVO | DESLIGADO
// contract_type: CLT_ESTRATEGICO | PJ | CLT_ILATI
const SENIORITY_MAP = {
  'JÚNIOR': 'JUNIOR', 'JUNIOR': 'JUNIOR', 'Júnior': 'JUNIOR', 'Junior': 'JUNIOR',
  'PLENO': 'PLENO', 'Pleno': 'PLENO',
  'SÊNIOR': 'SENIOR', 'SENIOR': 'SENIOR', 'Sênior': 'SENIOR', 'Senior': 'SENIOR',
  'SÊNIOR II': 'SENIOR', 'SENIOR II': 'SENIOR', 'Sênior II': 'SENIOR', 'Senior II': 'SENIOR',
  'ESPECIALISTA': 'ESPECIALISTA', 'Especialista': 'ESPECIALISTA',
  'LÍDER': 'ESPECIALISTA', 'LIDER': 'ESPECIALISTA', 'Líder': 'ESPECIALISTA', 'Lider': 'ESPECIALISTA',
  'GESTOR': 'ESPECIALISTA', 'Gestor': 'ESPECIALISTA',
  'DIRETOR': 'ESPECIALISTA', 'Diretor': 'ESPECIALISTA',
};

const CONTRACT_TYPE_MAP = {
  'CLT ESTRÁTEGICO': 'CLT_ESTRATEGICO', 'CLT ESTRATÉGICO': 'CLT_ESTRATEGICO',
  'clt estrategico': 'CLT_ESTRATEGICO', 'CLT Estratégico': 'CLT_ESTRATEGICO',
  'CLT_ESTRATEGICO': 'CLT_ESTRATEGICO',
  'CLT': 'CLT_ILATI', 'clt': 'CLT_ILATI', 'CLT_ILATI': 'CLT_ILATI',
  'PJ': 'PJ', 'pj': 'PJ',
  'ESTÁGIO': 'PJ', 'ESTAGIO': 'PJ', 'estágio': 'PJ', 'Estágio': 'PJ',
};

const STATUS_MAP = {
  'ATIVO': 'ATIVO', 'Ativo': 'ATIVO',
  'INATIVO': 'DESLIGADO', 'Inativo': 'DESLIGADO',
  'DESLIGADO': 'DESLIGADO', 'Desligado': 'DESLIGADO',
  'FÉRIAS': 'ATIVO', 'Férias': 'ATIVO', 'ferias': 'ATIVO',
};

const CLIENT_SHEETS = ['Alelo', 'Livelo', 'Veloe', 'Pede Pronto', 'Idea Maker', 'Zamp'];

function normalizeValue(value, type) {
  if (!value || value === null || value === '') return null;
  const str = String(value).trim();
  if (!str) return null;
  if (type === 'seniority') return SENIORITY_MAP[str] || null;
  else if (type === 'contract_type') return CONTRACT_TYPE_MAP[str] || null;
  else if (type === 'status') return STATUS_MAP[str] || null;
  return str;
}

function parseDate(value) {
  if (!value || value === null || value === '') return null;
  if (typeof value === 'number') {
    const date = new Date((value - 25569) * 86400000);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  const str = String(value).trim();
  if (!str) return null;
  const parsed = new Date(str);
  if (!isNaN(parsed.getTime())) {
    const year = parsed.getFullYear();
    const month = String(parsed.getMonth() + 1).padStart(2, '0');
    const day = String(parsed.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  return null;
}

function normalizeEmail(email) {
  if (!email) return null;
  const str = String(email).trim().toLowerCase();
  return str && str.includes('@') ? str : null;
}

function extractColumnName(header) {
  const h = header.toUpperCase();
  if (h.includes('PROFISSIONAL') || h.includes('NOME')) return 'name';
  if (h.includes('E-MAIL') || h.includes('EMAIL')) return 'email';
  if (h.includes('SENIORIDADE') || h.includes('SÊNIOR') || h.includes('SENIOR')) return 'seniority';
  if (h.includes('CARGO') || h.includes('FUNÇÃO') || h.includes('PERFIL')) return 'role';
  if (h.includes('SQUAD') || h.includes('PROJETO')) return 'squad';
  if (h.includes('TIPO DE CONTRATAÇÃO') || h.includes('TIPO CONTRATO') || h.includes('CONTRATO')) return 'contract_type';
  if (h.includes('DATA INÍCIO') || h.includes('DATA INICIO') || h.includes('ADMISSÃO')) return 'contract_start';
  if (h.includes('DATA DE SAÍDA') || h.includes('DATA SAIDA') || h.includes('DATA FIM') || h.includes('DESLIGAMENTO')) return 'contract_end';
  if (h.includes('STATUS')) return 'status';
  if (h.includes('VIGÊNCIA') || h.includes('RENOVAÇÃO') || h.includes('RENOVACAO')) return 'renewal_deadline';
  if (h.includes('OBSERVAÇÃO') || h.includes('OBSERVACOES')) return 'observations';
  return '';
}

async function processSheet(sheetName, fileBuffer, clients, dryRun) {
  console.log(`\nProcessando aba: ${sheetName}`);
  
  const workbook = XLSX.read(fileBuffer);
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) {
    console.log(`  ❌ Aba não encontrada`);
    return { success: 0, errors: 1, errorDetails: [`Aba ${sheetName} não encontrada`] };
  }

  const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });

  // Find header row - skip empty rows and look for "PROFISSIONAL"
  let headerRowIndex = -1;
  let headerRow = [];

  for (let i = 0; i < rawData.length; i++) {
    const row = rawData[i];
    if (row && row.length > 0 && row.some(cell => cell && String(cell).toUpperCase().includes('PROFISSIONAL'))) {
      headerRowIndex = i;
      headerRow = row;
      break;
    }
  }

  if (headerRowIndex === -1 || headerRow.length === 0) {
    console.log(`  ❌ Cabeçalho não encontrado`);
    return { success: 0, errors: 1, errorDetails: [`Cabeçalho não encontrado em ${sheetName}`] };
  }

  // Map column headers to field names
  const columnMap = {};
  headerRow.forEach((header, idx) => {
    if (header) {
      const fieldName = extractColumnName(String(header));
      if (fieldName) {
        columnMap[idx] = fieldName;
      }
    }
  });

  const clientId = clients[sheetName];
  const professionals = [];
  const errors = [];

  // Process data rows (start from row after header)
  for (let i = headerRowIndex + 1; i < rawData.length; i++) {
    const row = rawData[i];
    if (!row || !row[0]) continue;

    const raw = {};
    row.forEach((cell, idx) => {
      if (columnMap[idx]) {
        raw[columnMap[idx]] = cell;
      }
    });

    // Extract and validate professional data
    const name = normalizeValue(raw.name, 'string');
    if (!name) {
      errors.push(`Linha ${i + 1}: Nome vazio`);
      continue;
    }

    const email = normalizeEmail(raw.email);
    if (!email) {
      errors.push(`Linha ${i + 1} (${name}): Email inválido`);
    }

    const seniority = raw.seniority ? normalizeValue(raw.seniority, 'seniority') : undefined;
    const status = raw.status ? normalizeValue(raw.status, 'status') || 'ATIVO' : 'ATIVO';
    const contractType = raw.contract_type ? normalizeValue(raw.contract_type, 'contract_type') : undefined;
    const contractStart = parseDate(raw.contract_start);
    const contractEnd = parseDate(raw.contract_end);
    const renewalDeadline = parseDate(raw.renewal_deadline);
    const role = normalizeValue(raw.role, 'string') || undefined;
    const squad = normalizeValue(raw.squad, 'string') || undefined;
    const observations = normalizeValue(raw.observations, 'string') || undefined;

    professionals.push({
      name,
      client_id: clientId,
      email: email || undefined,
      position: role,
      seniority,
      status,
      contract_type: contractType,
      contract_start: contractStart || undefined,
      contract_end: contractEnd || undefined,
      renewal_deadline: renewalDeadline || undefined,
    });
  }

  // Insert into database
  if (professionals.length > 0) {
    if (!dryRun) {
      const { error: insertError } = await supabase.from('professionals').insert(professionals);
      if (insertError) {
        console.error(`  ❌ Erro ao inserir: ${insertError.message}`);
        console.error(`  Detalhes: ${JSON.stringify(insertError)}`);
        // Tenta inserir um por um para identificar o problema
        let inserted = 0;
        for (const p of professionals) {
          const { error: singleError } = await supabase.from('professionals').insert(p);
          if (singleError) {
            errors.push(`${p.name}: ${singleError.message} (seniority=${p.seniority}, status=${p.status}, contract_type=${p.contract_type})`);
          } else {
            inserted++;
          }
        }
        console.log(`  ⚠️  Inserção individual: ${inserted}/${professionals.length} inseridos`);
        return { success: inserted, errors: errors.length, errorDetails: errors };
      }
      console.log(`  ✅ ${professionals.length} profissionais inseridos`);
    } else {
      console.log(`  ✅ [DRY-RUN] ${professionals.length} profissionais seriam inseridos`);
      if (professionals[0]) {
        console.log(`  Exemplo: ${professionals[0].name} | seniority=${professionals[0].seniority} | status=${professionals[0].status} | contract_type=${professionals[0].contract_type}`);
      }
    }
  }

  return { success: professionals.length, errors: errors.length, errorDetails: errors };
}

async function seed() {
  const dryRun = process.argv.includes('--dry-run');
  console.log('================================================================================');
  console.log('SEED SCRIPT: Excel → Supabase (Elopar Profissionais)');
  console.log('================================================================================');
  if (dryRun) console.log('[DRY-RUN MODE] Nenhum dado será inserido\n');

  try {
    // 1. Fetch clients
    console.log('1. Buscando clientes...');
    const { data: clientsData, error: clientsError } = await supabase.from('clients').select('id, name');
    if (clientsError) throw clientsError;

    const clients = {};
    clientsData.forEach(c => { clients[c.name] = c.id; });
    console.log(`   Encontrados: ${Object.keys(clients).join(', ')}`);

    // 2. Read Excel
    const excelPath = path.join(process.cwd(), 'docs/02-dados/CONTROLE_PROFISSIONAIS_GRUPO_ELOPAR.xlsx');
    if (!fs.existsSync(excelPath)) throw new Error(`Arquivo não encontrado: ${excelPath}`);

    console.log('3. Lendo arquivo Excel...');
    const fileBuffer = fs.readFileSync(excelPath);
    console.log('4. Processando abas...');

    let totalSuccess = 0, totalErrors = 0;
    const allErrors = [];

    for (const sheetName of CLIENT_SHEETS) {
      const result = await processSheet(sheetName, fileBuffer, clients, dryRun);
      totalSuccess += result.success;
      totalErrors += result.errors;
      allErrors.push(...result.errorDetails);
    }

    console.log('\n================================================================================');
    console.log('RESUMO');
    console.log('================================================================================');
    console.log(`Total inserido: ${totalSuccess} profissionais`);
    console.log(`Total de erros: ${totalErrors}`);
    if (allErrors.length > 0) {
      console.log('Erros encontrados:');
   