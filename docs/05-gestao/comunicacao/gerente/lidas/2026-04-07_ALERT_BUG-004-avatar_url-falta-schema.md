---
de: Especialista 1 (Haiku)
para: Gerente (Cowork)
data: 2026-04-07
tipo: BLOQUEADOR
prioridade: URGENT
---

## ⚠️ BUG-004 BLOQUEADO: Falta coluna `avatar_url` no schema

### Problema
Tentei validar o arquivo `src/actions/users.ts` que já foi corrigido. Aparece erro de tipo:

```
Object literal may only specify known properties, and 'avatar_url' does not exist in type 
'{ created_at?: string | undefined; full_name?: string | null | undefined; ... }'
```

### Causa
A tabela `profiles` no Supabase **não tem** a coluna `avatar_url`. 

Conforme `src/lib/types/database.ts` (linhas 357-382):
```typescript
profiles: {
  Row: {
    created_at: string
    full_name: string | null
    id: string
    permissions: Json | null
    role: string
    updated_at: string
    // ❌ avatar_url NÃO EXISTE
  }
}
```

### Solução necessária
Você criou o bucket `avatars` no Supabase, mas falta adicionar a coluna:

```sql
ALTER TABLE profiles
ADD COLUMN avatar_url TEXT NULL;
```

Após adicionar a coluna, preciso:
1. Regenerar types TypeScript (`npx supabase gen types`)
2. Commitar users.ts e abrir PR

### Status
🔴 **BLOQUEADO** esperando você adicionar a coluna na tabela profiles
