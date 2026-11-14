---
applyTo: "src/lib/**/*.ts,src/hooks/**/*.ts,src/types.ts"
---

# Dados, autenticação e privacidade

- O contrato está em `docs/API.md`. Tipos compartilhados ficam em `src/types.ts`.
- HTTP somente em `src/lib/http.ts`/`src/lib/api.ts`, com normalização por
  `ApiError`. Componentes usam `useResource`; não chamam `fetch` diretamente.
- Autentique com `Authorization: Bearer <token>`. A loja é resolvida pelo token:
  nunca envie `lojaId` e nunca crie seletor de loja.
- ReN05/K-Anonymity: use `evaluateBenchmarking` de `src/lib/benchmarking.ts`.
  Libere a categoria apenas com flag true, ticket finito e `k >= mínimo` (padrão 3).
  O front revalida `k` mesmo se o backend enviar a flag ligada.
- Cupom: `POST /api/v1/campanhas` com 15% OFF, WhatsApp, validade de 7 dias,
  público do pico e `Idempotency-Key` via `crypto.randomUUID()`.
- Mocks: somente com `import.meta.env.DEV && VITE_USE_MOCKS=true`, por import
  dinâmico. Fixtures e segredos não podem entrar no bundle de produção.
- Nunca exiba dados individuais de clientes; apenas agregados.
