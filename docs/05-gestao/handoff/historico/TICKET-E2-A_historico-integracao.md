---
id: TICKET-E2-A
para: Especialista 2
branch: feat/ep-013-historico-integracao
arquivo: src/app/(dashboard)/profissionais/[id]/page.tsx
status: pending
---

# E2-A — Integrar ProfessionalHistorico na página do profissional

O componente já existe. O import já está na linha 7. Só falta renderizar.

```bash
git checkout main && git pull origin main
git checkout -b feat/ep-013-historico-integracao
```

Abrir `src/app/(dashboard)/profissionais/[id]/page.tsx`.

Localizar o comentário `{/* Coluna lateral (1/3) */}` (linha ~357).
**Inserir imediatamente antes** desse comentário:

```tsx
          {/* Histórico de Alterações */}
          <Suspense fallback={<div className="rounded-xl border border-gray-200 bg-white p-5 text-sm text-gray-400">Carregando histórico...</div>}>
            <ProfessionalHistorico profissionalId={professional.id} />
          </Suspense>
        </div>

```

> ⚠️ Atenção: o `</div>` acima fecha a `div className="lg:col-span-2 space-y-6"`.
> Verificar que não está duplicando o fechamento — remover o `</div>` original se necessário.

```bash
npx tsc --noEmit
npm run build
git add src/app/\(dashboard\)/profissionais/\[id\]/page.tsx
git commit -m "feat(EP-013): integra histórico de alterações na página do profissional"
git push origin feat/ep-013-historico-integracao
# Abrir PR: "feat(EP-013): histórico de alterações por profissional"
```

**DoD:** tsc ok + build ok + PR aberto
**Após concluir:** criar `NOTE_e2a_done.md` com número do PR
