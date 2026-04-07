---
id: TICKET-004
ep: EP-NEW-010
status: done
criado_em: 2026-04-06T16:00
concluido_em: 2026-04-06T19:25
skill: senior-frontend
---

## Tarefa

Leia `docs/04-sprints/EP-NEW-010_prompt_agente.md` e implemente o EP-NEW-010 conforme descrito.

Use a skill `senior-frontend`.

Siga o mockup: `docs/00-projeto/1 - backlog de melhorias/mockups/PM014_tipografia.html`

### Resumo da Tarefa
Redesign tipografia: reduzir tamanho base de 16px para 14px em tabelas e formulários, melhorando densidade visual. Ganho esperado: +62% de linhas visíveis.

### Checklist de Implementação
- [ ] Ler prompt e mockup
- [ ] Analisar código atual (globals.css, tailwind.config, tabelas)
- [ ] Planejar mudanças (Tailwind classes vs CSS variables)
- [ ] Implementar em todos os componentes de tabela
- [ ] Revisar formulários (secundário)
- [ ] Rodar `npx tsc --noEmit` e verificar erros
- [ ] Rodar `npm run lint` e verificar warnings
- [ ] Rodar `npm run build` e garantir sucesso
- [ ] Rodar `npm run test` e garantir testes passando
- [ ] Capturar screenshots antes/depois
- [ ] Validar visualmente em navegador (dashboard, profissionais, clientes, usuários)
- [ ] Verificar acessibilidade (contraste)
- [ ] Abrir PR com descrição clara
- [ ] Notificar Tide para homologação

### Validação Pré-PR

Antes de abrir o PR, execute:

```bash
npx tsc --noEmit
npm run lint
npm run build
npm run test
```

Todos devem passar sem erros.

---

## Resultado

Preenchido pelo agente após conclusão.

### Mudanças Realizadas
- [Descrever quais arquivos foram modificados]

### Testes

**TypeScript Check:**
```
[cole saída de: npx tsc --noEmit]
```

**Lint:**
```
[cole saída de: npm run lint]
```

**Build:**
```
[cole saída de: npm run build]
```

**Testes Unitários:**
```
[cole saída de: npm run test]
```

### Validação Visual
- [ ] Dashboard: ✅ ou ❌
- [ ] Profissionais: ✅ ou ❌
- [ ] Clientes: ✅ ou ❌
- [ ] Gerenciar Usuários: ✅ ou ❌

### PR
- **Número**: [#XXX]
- **Link**: [https://github.com/elopar/elopar-webapp/pull/XXX]

### Observações
[Qualquer observação adicional sobre implementação, decisões tomadas, challenges]

---

**Status Final**: Pronto para homologação
