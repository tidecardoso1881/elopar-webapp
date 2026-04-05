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

// Normalization maps
const SENIORITY_MAP: Record<string, string> = {
  'JÚNIOR': 'Junior',
  'JUNIOR': 'Junior',
  'Júnior': 'Junior',
  'PLENO': 'Pleno',
  'Pleno': 'Pleno',
  'SÊNIOR': 'Senior',
  'SENIOR': 'Senior',
  'Sênior': 'Senior',
  'Senior': 'Senior',
  'SÊNIOR II': 'Senior II',
  'SENIOR II': 'Senior II',
  'Sênior II': 'Senior II',
  'Senior II': 'Senior II',
  'ESPECIALISTA': 'Especialista',
  'Especialista': 'Especialista',
  'LÍDER': 'Lider',
  'LIDER': 'Lider',
  'Líder': 'Lider',
  'Lider': 'Lider',
  'GESTOR': 'Gestor',
  'Gestor': 'Gestor',
  'DIRETOR': 'Diretor',
  'Diretor': 'Diretor',
};

const CONTRACT_TYPE_MAP: Record<string, string> = {
  'CLT ESTRÁTEGICO': 'CLT Estratégico',
  'CLT ESTRATÉGICO': 'CLT Estratégico',
  'clt estrategico': 'CLT Estratégico',
  'CLT Estratégico': 'CLT Estratégico',
  'CLT': 'CLT',
  'clt': 'CLT',
  'PJ': 'PJ',
  'pj': 'PJ',
  'ESTÁGIO': 'Estágio',
  'ESTAGIO': 'Estágio',
  'estágio': 'Estágio',
  'Estágio': 'Estágio',
};

const STATUS_MAP: Record<string, string> = {
  'ATIVO': 'Ativo',
  'Ativo': 'Ativo',
  'INATIVO': 'Inativo',
  'Inativo': 'Inativo',
  'DESLIGADO': 'Desligado',
  'Desligado': 'Desligado',
  'FÉRIAS': 'Ferias',
  'Férias': 'Ferias',
  'FÉRIAS': 'Ferias',
  'ferias': 'Ferias',
};

const CLIENT_SHEETS = ['Alelo', 'Livelo', 'Veloe', 'Pede Pronto', 'Idea Maker', 'Zamp'];

interface RawRow {
  [key: string]: any;
}

interface Professional {
  name: string;
  client_id: string;
  email?: string;
  seniority?: string;
  status?: string;
  contract_type?: string;
  contract_start?: string;
  contract_end?: string;
  role?: string;
  squad?: string;
  observations?: string;
}

function normalizeValue(value: any, type: 'seniority' | 'contract_type' | 'status' | 'string'): string | null {
  if (!value || value === null || value === '') return null;

  const str = String(value).trim();
  if (!str) return null;

  if (type === 'seniority') {
    return SENIORITY_MAP[str] || null;
  } else if (type === 'contract_type') {
    return CONTRACT_TYPE_MAP[str] || null;
  } else if (type === 'status') {
    return STATUS_MAP[str] || null;
  }
  return str;
}

function parseDate(value: any): string | null {
  if (!value || value === null || value === '') return null;

  if (typeof value === 'number') {
    const date = new Date((value - 25569) * 86400000); // Excel date serial
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const str = String(value).trim();
  if (!str) return null;

  // Try parsing ISO or other date formats
  const parsed = new Date(str);
  if (!isNaN(parsed.getTime())) {
    const year = parsed.getFullYear();
    const month = String(parsed.getMonth() + 1).padStart(2, '0');
    const day = String(parsed.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  return null;
}

function normalizeEmail(email: any): string | null {
  if (!email) return null;
  const str = String(email).trim().toLowerCase();
  return str && str.includes('@') ? str : null;
}

function extractColumnName(header: string): string {
  // Find common column patterns
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
  if (h.includes('OBSERVAÇÃO') || h.includes('OBSERVACOES')) return 'observations';

  return '';
}

async function processSheet(
  sheetName: string,
  fileBuffer: Buffer,
  clients: Record<string, string>,
  dryRun: boolean
): Promise<{ success: number; errors: number; errorDetails: string[] }> {
  console.log(`\nProcessando aba: ${sheetName}`);

  const workbook = XLSX.read(fileBuffer);
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) {
    console.log(`  Aba não encontrada`);
    return { success: 0, errors: 1, errorDetails: [`Aba ${sheetName} não encontrada`] };
  }

  const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });

  // Find header row - skip empty rows and look for "PROFISSIONAL"
  let headerRowIndex = -1;
  let headerRow: string[] = [];

  for (let i = 0; i < rawData.length; i++) {
    const row = rawData[i] as any[];
    if (row && row.length > 0 && row.some(cell => cell && String(cell).toUpperCase().includes('PROFISSIONAL'))) {
      headerRowIndex = i;
      headerRow = row;
      break;
    }
  }

  if (headerRowIndex === -1 || headerRow.length === 0) {
    console.log(`  Cabeçalho não encontrado no padrão esperado`);
    return { success: 0, errors: 1, errorDetails: [`Cabeçalho não encontrado em ${sheetName}`] };
  }

  // Map column headers to field names
  const columnMap: Record<number, string> = {};
  headerRow.forEach((header, idx) => {
    if (header) {
      const fieldName = extractColumnName(String(header));
      if (fieldName) {
        columnMap[idx] = fieldName;
      }
    }
  });

  const clientId = clients[sheetName];
  const professionals: Professional[] = [];
  const errors: string[] = [];

  // Process data rows (start from row after header)
  for (let i = headerRowIndex + 1; i < rawData.length; i++) {
    const row = rawData[i] as any[];
    if (!row || !row[0]) continue; // Skip empty rows

    const raw: RawRow = {};
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
    const status = raw.status ? normalizeValue(raw.status, 'status') || 'Ativo' : 'Ativo';
    const contractType = raw.contract_type ? normalizeValue(raw.contract_type, 'contract_type') : undefined;
    const contractStart = parseDate(raw.contract_start);
    const contractEnd = parseDate(raw.contract_end);
    const role = normalizeValue(raw.role, 'string') || undefined;
    const squad = normalizeValue(raw.squad, 'string') || undefined;
    const observations = normalizeValue(raw.observations, 'string') || undefined;

    professionals.push({
      name,
      client_id: clientId,
      email: email || undefined,
      seniority,
      status,
      contract_type: contractType,
      contract_start: contractStart || undefined,
      contract_end: contractEnd || undefined,
      role,
      squad,
      observations,
    });
  }

  console.log(`  Lidos: ${professionals.length} profissionais, ${errors.length} erros`);

  if (dryRun) {
    console.log(`  [DRY-RUN] Não inserindo dados`);
    if (professionals.length > 0) {
      console.log(`  Exemplo: ${JSON.stringify(professionals[0])}`);
    }
    return { success: professionals.length, errors: errors.length, errorDetails: errors };
  }

  // Insert into database
  if (professionals.length > 0) {
    const { error } = await supabase.from('professionals').insert(professionals);
    if (error) {
      console.error(`  Erro ao inserir: ${error.message}`);
      return { success: 0, errors: professionals.length, errorDetails: [error.message] };
    }
    console.log(`  Inseridos com sucesso: ${professionals.length}`);
  }

  return { success: professionals.length, errors: errors.length, errorDetails: errors };
}

async function seed() {
  const dryRun = process.argv.includes('--dry-run');
  const reset = process.argv.includes('--reset');

  console.log('='.repeat(80));
  console.log('SEED SCRIPT: Excel → Supabase (Elopar Profissionais)');
  console.log('='.repeat(80));

  if (dryRun) console.log('[DRY-RUN MODE] Nenhum dado será inserido\n');
  if (reset) console.log('[RESET MODE] Tabelas serão limpas antes de inserir\n');

  // Get list of clients
  console.log('\n1. Buscando clientes...');
  const { data: clientsData, error: clientsError } = await supabase
    .from('clients')
    .select('id, name');

  if (clientsError) {
    console.error('Erro ao buscar clientes:', clientsError.message);
    process.exit(1);
  }

  const clients: Record<string, string> = {};
  clientsData?.forEach(c => {
    clients[c.name] = c.id;
  });

  console.log(`   Encontrados: ${Object.keys(clients).join(', ')}`);

  // Reset if requested
  if (reset && !dryRun) {
    console.log('\n2. Limpando tabelas...');
    const { error: deleteError } = await supabase
      .from('professionals')
      .delete()
      .neq('id', null);

    if (deleteError) {
      console.error('Erro ao limpar tabela:', deleteError.message);
      process.exit(1);
    }
    console.log('   Tabela professionals limpa');
  }

  // Read Excel file
  console.log('\n3. Lendo arquivo Excel...');
  const excelPath = path.join(process.cwd(), 'docs/02-dados/CONTROLE_PROFISSIONAIS_GRUPO_ELOPAR.xlsx');

  if (!fs.existsSync(excelPath)) {
    console.error(`Arquivo não encontrado: ${excelPath}`);
    process.exit(1);
  }

  const fileBuffer = fs.readFileSync(excelPath);

  // Process each client sheet
  console.log('\n4. Processando abas...');
  let totalSuccess = 0;
  let totalErrors = 0;
  const allErrors: string[] = [];

  for (const clientName of CLIENT_SHEETS) {
    if (!clients[clientName]) {
      console.log(`\n  Aviso: Cliente ${clientName} não encontrado no banco`);
      continue;
    }
    const result = await processSheet(clientName, fileBuffer, clients, dryRun);
    totalSuccess += result.success;
    totalErrors += result.errors;
    allErrors.push(...result.errorDetails);
  }

  // Summary
  console.log('\n' + '='.repeat(80));
  console.log('RESUMO');
  console.log('='.repeat(80));
  console.log(`Total inserido: ${totalSuccess} profissionais`);
  console.log(`Total de erros: ${totalErrors}`);

  if (allErrors.length > 0 && allErrors.length <= 10) {
    console.log('\nErros encontrados:');
    allErrors.forEach(e => console.log(`  - ${e}`));
  } else if (allErrors.length > 10) {
    console.log(`\n${allErrors.length} erros encontrados (mostrando primeiros 10):`);
    allErrors.slice(0, 10).forEach(e => console.log(`  - ${e}`));
  }

  console.log('\nSeed concluído!')
  process.exit(totalErrors > 0 ? 1 : 0)
}

seed().catch((err) => {
  console.error('Erro fatal no seed:', err)
  process.exit(1)
})