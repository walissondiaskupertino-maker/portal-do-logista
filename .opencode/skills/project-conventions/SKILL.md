---
name: Convenções do Portal do Lojista
description: Use no início de qualquer tarefa neste repositório para seguir stack, estrutura, comandos, estilo, commits e Definition of Done do Portal do Lojista.
---

# Convenções do projeto

## Contexto

Portal do Lojista: painel React que mostra benchmarking de ticket médio, horários
de pico, cross-shopping e disparo de cupom de 15% OFF. Os dados vêm da API do
shopping e a loja é resolvida exclusivamente pelo token.

## Stack

React 18, TypeScript estrito, Vite 5, Recharts, lucide-react, Vitest,
Testing Library, jsdom e Node.js 20+.

## Estrutura

- `src/components/` — componentes e testes de componente.
- `src/lib/` — API, HTTP, auth, mocks, ReN05 e formatação.
- `src/hooks/` — `useResource` e carregamento de dados.
- `src/styles/global.css` — layout e estilos dos componentes.
- `frontend/src/styles/tokens.css` — design tokens.
- `src/test/` — setup e fixtures tipadas.
- `docs/API.md`, `Spec.md`, `Plan.md`, `Check.md`, `Verification.md` — engenharia.

## Comandos

```bash
npm install
npm run typecheck
npm test
npm run build
npm run dev
```

Use Node 20+. Se o Node não estiver no PATH, use o binário disponível no ambiente.

## Estilo de código

- Siga `.editorconfig`: UTF-8, LF, 2 espaços, aspas simples, ponto e vírgula,
  vírgula final e newline no fim.
- Componentes em `PascalCase`; funções/variáveis em `camelCase`; constantes em
  `UPPER_SNAKE_CASE`; CSS em BEM (`bloco__elemento--modificador`).
- TypeScript estrito: sem `any`, sem variáveis/parâmetros sem uso, sem `@ts-ignore`.
- Prefira named exports; `App` é a exceção como default.
- Não adicione dependências sem necessidade comprovada.
- Não edite `dist/` nem `node_modules/`.

## Regras de produto

- Textos da interface em pt-BR e sem emojis.
- Ícones somente de `lucide-react` via `src/components/icons.tsx`.
- Cores, raios, sombras e tipografia via `frontend/src/styles/tokens.css`.
- Nenhum seletor de loja e nenhum `lojaId` em requisições.
- ReN05/K-Anonymity sempre aplicada no front com `evaluateBenchmarking`.
- Mocks apenas em desenvolvimento, por import dinâmico.

## Commits

- Use Conventional Commits: `feat`, `fix`, `test`, `docs`, `refactor`, `chore`,
  `perf`, `build`.
- Assunto em pt-BR, imperativo, com no máximo 72 caracteres.
- Um commit por mudança lógica; explique o porquê no corpo quando não for óbvio.
- Nunca inclua segredos, tokens reais ou dados de clientes.

## Definition of Done

1. `npm run typecheck` sem erros.
2. `npm test` verde.
3. `npm run build` sem erros nem avisos novos.
4. QA responsivo em 1440, 1024, 768 e 390 px para mudanças visuais.
5. Console limpo nos cenários default, bloqueado, vazio e erro.
6. Documentação afetada atualizada com evidências reais.
