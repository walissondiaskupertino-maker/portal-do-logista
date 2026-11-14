---
applyTo: "src/components/**/*.tsx,src/App.tsx,src/main.tsx"
---

# UI React, Recharts e acessibilidade

- Componentes funcionais com props tipadas; sem classes e sem `any`.
- Reutilize `Card`, `States` e `Toast` antes de criar estruturas novas.
- Ícones somente pelos wrappers de `src/components/icons.tsx`. Para um ícone novo,
  adicione um wrapper Lucide com `aria-hidden`, `focusable="false"` e `strokeWidth`
  padrão. Não use emojis nem SVGs inline fora de `IconLogo`.
- Todo bloco com dados deve tratar loading (skeleton), vazio e erro com retry.
- Erros usam `role="alert"`; ícones decorativos usam `aria-hidden="true"`; botões
  devem ter nome acessível e foco visível.
- Gráficos Recharts: `ResponsiveContainer`, tooltip, resumo textual e cores
  coerentes com os tokens. Valide em 1440, 1024, 768 e 390 px sem overflow.
- Formate valores com `src/lib/format.ts`; não replique regras de `Intl`.
- Textos de interface em pt-BR, sem emojis.
