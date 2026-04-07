---
id: TICKET-018A
ep: EP-NEW-016 (parte 1/2)
status: done
criado_em: 2026-04-07T14:00
skill: senior-fullstack
team: TEAM-DELTA
subtask_of: EP-NEW-016
next: TICKET-018B
---

# Tarefa — Configuração PWA (manifest + next.config)

Tarefa de configuração pura. Sem componentes React.

## 1. Instalar dependência

```bash
npm install @ducanh2912/next-pwa
```

## 2. Criar `public/manifest.json`

```json
{
  "name": "Elopar — Gestão de Profissionais",
  "short_name": "Elopar",
  "description": "Gestão de profissionais técnicos",
  "start_url": "/dashboard",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#6366f1",
  "orientation": "portrait-primary",
  "icons": [
    { "src": "/icons/icon-192x192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512x512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icons/icon-512x512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

## 3. Criar ícones placeholder

Criar pasta `public/icons/` e dois arquivos PNG simples (pode ser um quadrado indigo #6366f1 com letra "E"):
- `public/icons/icon-192x192.png`
- `public/icons/icon-512x512.png`

Se não conseguir gerar PNG, crie os arquivos como cópia do favicon existente (`public/favicon.ico`) renomeados. O importante é que existam.

## 4. Atualizar `next.config.ts`

```typescript
import withPWA from '@ducanh2912/next-pwa'

const nextConfig = {
  reactStrictMode: true,
  // ... manter config existente
}

export default withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
})(nextConfig)
```

## 5. Adicionar tag no `src/app/layout.tsx`

```tsx
<link rel="manifest" href="/manifest.json" />
<meta name="theme-color" content="#6366f1" />
```

## DoD

- [ ] `npm install @ducanh2912/next-pwa` executado
- [ ] `public/manifest.json` criado
- [ ] `public/icons/` com os dois PNGs
- [ ] `next.config.ts` atualizado
- [ ] `src/app/layout.tsx` com manifest link
- [ ] `npx tsc --noEmit` sem erros
- [ ] `npm run build` sem erros
- [ ] PR NÃO ainda — aguardar TICKET-018B

## Resultado
- tsc: ✅ zero erros
- build: ✅ sucesso
- ícones criados: ✅ public/icons/icon-192x192.png e icon-512x512.png (copiados de public/)

**Alterações:**
- ✅ npm install @ducanh2912/next-pwa
- ✅ public/manifest.json criado
- ✅ public/icons/ com dois PNGs
- ✅ next.config.ts atualizado com withPWA
- ✅ src/app/layout.tsx já tinha manifest e themeColor em metadata

Pronto para TICKET-018B.
