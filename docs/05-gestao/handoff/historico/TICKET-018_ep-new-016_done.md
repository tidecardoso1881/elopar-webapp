---
id: TICKET-018
ep: EP-NEW-016
status: done
criado_em: 2026-04-06T20:00
concluido_em: 2026-04-07
skill: senior-fullstack
team: TEAM-DELTA
---

# TICKET-018 — EP-NEW-016: PWA — Acesso Mobile Offline

## Resultado

### Build Status

- **tsc**: ✅ PASS
- **lint**: ✅ PASS
- **build**: ✅ PASS

### Git

- **Branch**: `feature/ep-new-016-pwa-offline`
- **PR**: #67
- **Status**: Aguardando merge

### O que foi implementado

- Instalado `@ducanh2912/next-pwa@10.2.9` (removido depois — conflito com Turbopack)
- Implementação manual de service worker: `public/sw.js`
  - CacheFirst para assets estáticos
  - StaleWhileRevalidate para páginas
  - NetworkFirst para `/api/*`
- `public/manifest.json` com name, theme_color (#6366f1), background_color (#0f172a), display standalone
- `public/icon-192x192.png` e `public/icon-512x512.png` gerados programaticamente
- `src/components/offline-banner.tsx` — banner âmbar "Você está offline — exibindo dados em cache"
- `src/app/layout.tsx` — metadata manifest + themeColor + appleWebApp + Script de registro SW
- `src/app/(dashboard)/layout.tsx` — adicionado `<OfflineBanner />`
- `next.config.ts` — `turbopack: {}`, headers para manifest.json e sw.js

### Observações
- `@ducanh2912/next-pwa` conflita com Turbopack (Next.js 16) — substituído por SW manual
- Conflito de merge com main resolvido em 2026-04-07 (commit f8264ef)
