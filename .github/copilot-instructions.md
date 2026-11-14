# Instruções do GitHub Copilot — Portal do Lojista

Painel React do lojista: benchmarking de ticket médio, horários de pico,
cross-shopping e cupom de 15% OFF, sempre restrito à loja do token.

## Stack

React 18, TypeScript estrito, Vite 5, Recharts, lucide-react, Vitest,
Testing Library e jsdom. Node.js 20+.

## Comandos obrigatórios

```bash
npm install
npm run typecheck
npm test
npm run build
```

Para validar visualmente: `npm run dev` e QA nos viewports 1440, 1024, 768 e 390 px.

## Regras de código

- Componentes funcionais com props tipadas; sem classes. Prefira named exports
  (`App` é a exceção como default).
- TypeScript estrito: não use `any`, não deixe variáveis/parâmetros sem uso e não
  silencie erros com `@ts-ignore`.
- Siga `.editorconfig`: UTF-8, LF, 2 espaços, aspas simples, ponto e vírgula,
  vírgula final e newline no fim.
- Nomeie componentes em `PascalCase`, funções/variáveis em `camelCase`, constantes
  em `UPPER_SNAKE_CASE` e classes CSS no padrão `bloco__elemento--modificador`.
- Não adicione dependências sem justificar. Ícones: `lucide-react` via
  `src/components/icons.tsx`. Não use emojis.
- Estilos: use os tokens de `frontend/src/styles/tokens.css`; o layout fica em
  `src/styles/global.css`. Não introduza Tailwind, styled-components ou CSS-in-JS.
- Formatação de números, moeda, percentual, hora e data: use `src/lib/format.ts`.

## Dados, privacidade e regras de negócio

- Chamadas HTTP somente por `src/lib/api.ts` + `src/lib/http.ts`. Componentes usam
  `useResource` e não chamam `fetch` diretamente.
- A loja vem exclusivamente do token (`Authorization: Bearer <token>`). Nunca
  envie `lojaId`, nunca crie seletor de loja e nunca exponha dados de clientes.
- ReN05/K-Anonymity: use `evaluateBenchmarking` de `src/lib/benchmarking.ts`.
  A média da categoria exige flag true, ticket finito e `k >= mínimo` (padrão 3).
  Bloqueado: mascare o valor e explique `k`, mínimo e lojas faltantes.
- Cupom: 15% OFF, WhatsApp, validade de 7 dias, `Idempotency-Key` com
  `crypto.randomUUID()`. CTA desabilitado com público 0 ou resumo em erro.
  Sucesso mostra código e toast; falha mostra `role="alert"` e permite retry.
- Mocks só com `import.meta.env.DEV && VITE_USE_MOCKS=true`, via import dinâmico.
  Fixtures jamais no bundle de produção.

## UI e acessibilidade

- Textos em pt-BR, sem emojis.
- Loading, vazio e erro em todos os blocos de dados, reutilizando
  `src/components/States.tsx`.
- Ícones decorativos com `aria-hidden="true"`; botões com nome acessível.
- Erros com `role="alert"`; foco visível; respeito a `prefers-reduced-motion`.
- Gráficos Recharts com `ResponsiveContainer`, tooltip e resumo textual.
- Layout sem rolagem horizontal de 390 px a 1440 px.

## Testes e documentação

- Testes ficam ao lado do código (`*.test.ts` / `*.test.tsx`).
- Use Vitest + Testing Library; prefira `getByRole`, `getByLabelText` e texto
  visível a seletores de implementação. Use `userEvent` para interações.
- Corrija bug com teste de regressão. Não remova testes para “ficar verde”.
- Toda mudança de comportamento atualiza `README.md`, `Spec.md`, `Plan.md`,
  `Check.md`, `Verification.md` e/ou `docs/API.md`, com números e evidências reais.

## Instruções detalhadas

- Skills do projeto: `.opencode/skills/`.
- Regras por caminho: `.github/instructions/*.instructions.md`.
- Contexto geral para agentes: `AGENTS.md`.
