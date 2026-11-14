---
name: Design tokens e CSS
description: Use ao mexer em CSS, cores, espaçamento, sombras, tipografia ou temas, garantindo o consumo dos tokens de frontend/src/styles/tokens.css.
---

# Design tokens e CSS

## Fonte única

- `frontend/src/styles/tokens.css` contém as primitivas visuais.
- `src/styles/global.css` importa esse arquivo no topo e concentra layout e
  estilos dos componentes.
- Não crie outro bloco `:root` e não duplique a importação em outro lugar.

## Uso dos tokens

- Use `var(--token)` para cores, raios, sombras e tipografia.
- Se um valor se repetir ou tiver significado, crie um token semântico com nome
  por papel (`--brand-hover`, `--gold-ink`, `--green-ink`), não por hex.
- Valores literais são aceitos apenas em casos decorativos pontuais (gradientes
  específicos, overlays) e devem ficar próximos ao componente que os usa.
- Não altere o valor de um token para “ajustar” um componente isolado; prefira um
  token novo ou um ajuste local documentado.

## Organização do CSS

- Nomeie classes em BEM: `bloco`, `bloco__elemento`, `bloco--modificador`.
- Agrupe por seções com comentários, como no arquivo atual.
- Evite `!important`, exceto em impressão ou utilitários globais já existentes.
- Mantenha os seletores próximos do componente para facilitar leitura.

## Acessibilidade visual

- Contraste adequado para texto e estados de erro/sucesso.
- Foco visível com `outline` e `outline-offset`.
- Respeite `prefers-reduced-motion`.
- Preserve os estilos de impressão existentes.

## Proibições

- Não introduza Tailwind, styled-components, CSS Modules ou CSS-in-JS.
- Não use estilos inline para cores/temas; props de layout pontuais são aceitáveis.
- Não quebre os breakpoints existentes sem validar os quatro viewports.
