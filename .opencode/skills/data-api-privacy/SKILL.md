---
name: Dados, API e privacidade
description: Use ao alterar API, autenticação por token, mocks, ReN05/K-Anonymity, cupom ou privacidade dos dados do Portal do Lojista.
---

# Dados, API e privacidade

## Camadas

- `src/lib/http.ts`: cliente HTTP, headers, normalização de erro (`ApiError`).
- `src/lib/api.ts`: endpoints e payloads.
- `src/hooks/useResource.ts`: loading, erro, abort e retry.
- Componentes não chamam `fetch`; consomem o hook ou props.
- Tipos compartilhados ficam em `src/types.ts`; o contrato está em `docs/API.md`.

## Endpoints

| Método | Endpoint | Uso |
| --- | --- | --- |
| GET | `/api/v1/loja/resumo?periodo=30d` | loja, KPIs, ticket, benchmarking e público |
| GET | `/api/v1/loja/horarios-pico?periodo=30d` | fluxo por hora e pico |
| GET | `/api/v1/loja/cross-shopping?periodo=30d` | afinidade entre categorias |
| POST | `/api/v1/campanhas` | criação do cupom |

Períodos: `7d`, `30d`, `90d`.

## Autenticação e privacidade

- Header `Authorization: Bearer <token>` em toda chamada.
- A loja é resolvida pelo token; nunca envie `lojaId`.
- Nunca crie seletor de loja, impersonação ou troca de loja.
- Não exiba dados individuais de clientes; apenas agregados.
- Não registre token, dados pessoais ou payloads sensíveis em logs.

## ReN05 / K-Anonymity

Use `evaluateBenchmarking` de `src/lib/benchmarking.ts`. A categoria só é liberada
quando todas as condições forem verdadeiras:

1. `benchmarkingDisponivel === true`;
2. `ticketMedioCategoria` é número finito;
3. `kAnonimato.k >= kAnonimato.minimo` (mínimo padrão 3).

O front revalida `k` como defesa em profundidade, mesmo com a flag ligada.
Quando bloqueado: mascare o valor (`R$ ••••,••`), explique o motivo, informe `k`,
mínimo e quantas lojas faltam, e nunca renderize o comparativo percentual.

## Cupom

- Desconto de 15%, canal WhatsApp, validade de 7 dias.
- Público: visitantes do horário de pico na janela do período.
- `Idempotency-Key` gerado com `crypto.randomUUID()`.
- CTA habilitado somente com resumo carregado e `publicoEstimadoCupom > 0`.
- Sucesso: código, status, data e toast.
- Falha: `role="alert"`, toast de erro e CTA reabilitado para retry.

## Mocks

- Só ativam com `import.meta.env.DEV && VITE_USE_MOCKS=true`.
- Carregue fixtures com `await import('./mock')` dentro do bloco condicional.
- Fixtures não podem aparecer no bundle de produção.
- Nunca use token real ou dado de cliente nas fixtures.
