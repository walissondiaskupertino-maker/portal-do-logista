---
name: Documentação e entrega
description: Use ao atualizar README, Spec, Plan, Check, Verification ou docs/API, mantendo rastreabilidade, coerência e evidências reais da entrega.
---

# Documentação e entrega

## Documentos e responsabilidades

| Arquivo | Papel |
| --- | --- |
| `README.md` | quickstart, stack, contrato, estrutura e roteiro de demo |
| `Spec.md` | contexto, objetivo, requisitos, regras, NFRs e critérios de aceite |
| `Plan.md` | estratégia, fases, arquitetura, decisões (ADR) e riscos |
| `Check.md` | checklist, matriz de rastreabilidade e resultados |
| `Verification.md` | comandos, saídas reais, evidências e limitações |
| `docs/API.md` | contrato consumido, payloads e erros |

## Regras

- Escreva em pt-BR e sem emojis. Use status em texto: Aprovado, Atenção, Pendente.
- Mantenha a cadeia requisito → implementação → teste → evidência.
- Toda mudança de comportamento atualiza os documentos afetados.
- Rode os comandos antes de registrar números de testes, módulos, chunks ou checks.
  Nunca invente resultados.
- Registre premissas, pendências e limitações de forma explícita.
- Mantenha links relativos válidos entre os documentos.
- Não altere o escopo silenciosamente: se uma decisão mudar, registre em `Plan.md`.

## Checklist de entrega

1. `npm run typecheck` sem erros.
2. `npm test` verde e contagem atualizada.
3. `npm run build` sem erros, com tamanhos de chunk atualizados.
4. QA responsivo e cenários registrados em `Verification.md`.
5. `Check.md` com CA/RF/RNF refletindo o estado real.
6. `README.md` ainda permite rodar o projeto do zero.
7. Pendências externas (mockup, git, backend) declaradas.

## Coerência

- Nomes de arquivos, caminhos, scripts e endpoints devem existir de fato.
- Números de teste/build/QA devem bater entre README, Check e Verification.
- Evite duplicar regras extensas: referencie `Spec.md` quando possível.
