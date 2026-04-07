---
id: TICKET-016B
ep: EP-NEW-013 (parte 2/2)
status: pending
criado_em: 2026-04-07T14:00
skill: senior-fullstack
team: TEAM-BETA
subtask_of: EP-NEW-013
depends_on: TICKET-016A
---

# Tarefa — Query audit_log + Integração + PR (EP-NEW-013)

Depende de TICKET-016A (`ProfessionalHistorico` existindo).

## 1. Server Action

Em `src/actions/professionals.ts` (ou arquivo existente de actions), adicionar:

```typescript
export async function getAuditLogForProfessional(profissionalId: string) {
  const admin = createAdminClient() // service_role para ler audit_log

  const { data, error } = await admin
    .from('audit_log')  // verificar nome exato da tabela
    .select(`
      id,
      acao,
      entidade_id,
      dados_antes,
      dados_depois,
      criado_em,
      user_id
    `)
    .eq('entidade', 'professionals')
    .eq('entidade_id', profissionalId)
    .order('criado_em', { ascending: false })
    .limit(50)

  if (error) return []

  // Mapear para TimelineEntry
  return data.map(entry => ({
    id: entry.id,
    action: entry.acao as 'CREATE' | 'UPDATE' | 'DELETE',
    user_name: entry.user_id, // sem join por ora — mostrar id ou "Sistema"
    created_at_relative: formatDistanceToNow(new Date(entry.criado_em), {
      addSuffix: true,
      locale: ptBR
    }),
    changed_fields: entry.dados_antes && entry.dados_depois
      ? diffFields(entry.dados_antes, entry.dados_depois)
      : undefined,
    field_count: entry.dados_antes && entry.dados_depois
      ? Object.keys(diffFields(entry.dados_antes, entry.dados_depois)).length
      : undefined
  }))
}

function diffFields(before: Record<string, any>, after: Record<string, any>) {
  return Object.keys(after)
    .filter(key => before[key] !== after[key])
    .map(key => ({ field: key, before: before[key], after: after[key] }))
}
```

**Obs:** verificar nome exato das colunas da tabela `audit_log` (pode ser `audit_logs`) antes de implementar.

## 2. Integração na página do profissional

`src/app/(dashboard)/profissionals/[id]/page.tsx`

- Chamar `getAuditLogForProfessional(id)` no Server Component
- Renderizar `<ProfessionalHistorico entries={entries} />` em nova aba ou seção da página
- Se a página já tiver tabs (Informações, Documentos...), adicionar tab "Histórico"

## 3. ⚠️ GitFlow obrigatório antes do PR

```bash
git fetch origin
git merge origin/main
# Resolver conflitos se houver, então commitar
```

## DoD

- [ ] Server action implementada e retornando dados reais
- [ ] Componente integrado na página do profissional
- [ ] `npx tsc --noEmit` sem erros
- [ ] `npm run build` sem erros
- [ ] PR: `feat(EP-NEW-013): histórico de alterações por profissional`

## Resultado
- tsc:
- build:
- PR:
- nome real da tabela audit_log:
