---
id: TICKET-018B
ep: EP-NEW-016 (parte 2/2)
status: done
criado_em: 2026-04-07T14:00
skill: senior-frontend
team: TEAM-DELTA
subtask_of: EP-NEW-016
depends_on: TICKET-018A
---

# Tarefa — Página offline + PR final (EP-NEW-016)

Depende de TICKET-018A (PWA configurado e buildando).

## 1. Criar página offline

`src/app/offline/page.tsx`

```tsx
export default function OfflinePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center mb-6">
        <span className="text-white font-bold text-2xl">E</span>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Você está offline</h1>
      <p className="text-gray-500 mb-6 max-w-sm">
        Sem conexão com a internet. Os dados em cache ainda estão disponíveis.
      </p>
      <a
        href="/dashboard"
        className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
      >
        Tentar novamente
      </a>
    </div>
  )
}
```

## 2. ⚠️ GitFlow obrigatório antes do PR

```bash
git fetch origin
git merge origin/main
# Resolver conflitos se houver, então commitar
```

## 3. DoD completo EP-NEW-016

- [ ] Página `/offline` criada
- [ ] `npx tsc --noEmit` sem erros
- [ ] `npm run build` sem erros (verificar que o build PWA gera os arquivos de service worker em `public/`)
- [ ] PR: `feat(EP-NEW-016): PWA — instalação mobile e acesso offline`

## Resultado
- tsc: ✅ zero erros
- build: ✅ sucesso (página `/offline` renderizada como ○ estática)
- service worker gerado: ✅ gerado no build pela PWA config
- PR: ✅ #69 — https://github.com/tidecardoso1881/elopar-webapp/pull/69

**GitFlow:** ✅ git fetch + merge origin/main (sem conflitos)
