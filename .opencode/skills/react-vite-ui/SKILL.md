---
name: UI React, Vite e Recharts
description: Use ao criar ou alterar componentes React, telas, gráficos Recharts, estados de interface, acessibilidade ou responsividade do Portal do Lojista.
---

# UI React, Vite e Recharts

## Componentes

- Use componentes funcionais com props tipadas; não use classes.
- Reutilize `Card`, `States` e `Toast` antes de criar estruturas novas.
- Uma responsabilidade por componente; extraia regras puras para `src/lib/`.
- Não use `useEffect` para estado derivado; calcule durante a renderização.
- Componentes não chamam `fetch`: consomem `useResource` ou recebem dados por props.

## Ícones

- Importe sempre de `src/components/icons.tsx`.
- Para um ícone novo, adicione um wrapper Lucide com `aria-hidden="true"`,
  `focusable="false"` e `strokeWidth={1.8}`.
- Não use emojis nem SVGs inline; a única exceção é `IconLogo` (marca do portal).
- Botões com ícone precisam de nome acessível (`aria-label` ou texto visível).

## Estados e erros

- Todo bloco de dados trata loading, vazio e erro.
- Loading usa skeletons; vazio explica o motivo; erro tem `role="alert"` e retry.
- Desabilite ações dependentes de dados enquanto o recurso estiver carregando ou
  em erro.

## Gráficos

- Use Recharts com `ResponsiveContainer`, eixos legíveis, tooltip e resumo textual.
- Mantenha cores coerentes com os tokens; quando o Recharts exigir valor literal,
  declare constantes nomeadas no topo do arquivo.
- Gráficos devem ser compreensíveis sem interação e não podem causar overflow.

## Acessibilidade

- Use HTML semântico: `button`, `section`, headings em ordem.
- Foco visível em todos os controles; não remova `:focus-visible`.
- Respeite `prefers-reduced-motion`.
- Ícones decorativos não entram na árvore de acessibilidade.

## Responsividade

- Valide em 1440, 1024, 768 e 390 px.
- Não pode haver rolagem horizontal (`scrollWidth <= innerWidth`).
- Use os breakpoints existentes em `src/styles/global.css`: 1180, 1080, 1000,
  940, 720 e 520 px.

## Formatação

- Use `src/lib/format.ts` para moeda, número, percentual, hora e data.
- Não replique regras de `Intl` em componentes.
