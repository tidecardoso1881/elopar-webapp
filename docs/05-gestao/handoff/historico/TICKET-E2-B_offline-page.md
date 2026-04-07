---
id: TICKET-E2-B
para: Especialista 2
branch: feat/ep-016-offline-page
arquivo: src/app/offline/page.tsx
status: pending
bloqueio: iniciar após E2-A ter PR aberto (não precisa estar mergeado)
---

# E2-B — Criar página offline (PWA)

```bash
git checkout main && git pull origin main
git checkout -b feat/ep-016-offline-page
```

Criar o arquivo `src/app/offline/page.tsx` com o conteúdo exato abaixo:

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

```bash
npx tsc --noEmit
npm run build
# Confirmar que `public/sw.js` ou `public/workbox-*.js` foi gerado pelo build
git add src/app/offline/page.tsx
git commit -m "feat(EP-016): página offline para PWA"
git push origin feat/ep-016-offline-page
# Abrir PR: "feat(EP-016): PWA — página offline"
```

**DoD:** tsc ok + build ok + service worker gerado + PR aberto
**Após concluir:** criar `NOTE_e2b_done.md` com número do PR e confirmar se sw.js apareceu em `public/`
