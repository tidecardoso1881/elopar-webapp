# Processo — Backlog de Melhorias

Esta pasta é a **caixa de entrada** de requisições, bugs e sugestões para o projeto Elopar.

## Estrutura de pastas

```
1 - backlog de melhorias/
├── [arquivo novo].docx / .md    ← entrada: requisições não lidas
├── lida/                        ← lida, catalogada, em andamento ou aguardando priorização
└── resolvido/                   ← implementada, testada e entregue
```

## Fluxo de vida de uma requisição

```
Nova requisição (pasta raiz)
        ↓ PM lê e cataloga no kanban
      lida/
        ↓ Dev implementa, testa e entrega
    resolvido/
```

## Regras do processo

### Ao receber um novo arquivo
1. **Ler** o conteúdo do arquivo
2. **Extrair** as requisições e classificar por tipo (feature, bug, melhoria, infra)
3. **Priorizar** com MoSCoW (Must / Should / Could / Won't)
4. **Registrar** no GitHub Project Board (coluna Backlog)
5. **Mover** o arquivo para a pasta `lida/`

### Ao resolver uma requisição
1. **Implementar** e passar pelos ritos de entrega (TypeScript check, testes, PR)
2. **Atualizar** o item no GitHub Project Board (coluna Produção)
3. **Mover** o arquivo de `lida/` para `resolvido/`

## Convenção de nomes

Manter o nome original do arquivo ao mover entre pastas para rastreabilidade.

---
*Processo definido em 06/04/2026 — migração para Kanban*
