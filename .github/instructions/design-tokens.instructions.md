---
applyTo: "src/**/*.css,frontend/**/*.css"
---

# Design tokens e CSS

- A fonte única das primitivas visuais é `frontend/src/styles/tokens.css`,
  importada no topo de `src/styles/global.css`. Não crie outro bloco `:root`.
- Use `var(--token)` para cores, raios, sombras e tipografia. Valores literais só
  são aceitos em casos decorativos pontuais e devem ser justificados no código.
- Se um valor se repetir ou tiver significado semântico, promova-o a token em
  `tokens.css` com nome por papel (`--brand-hover`, `--gold-ink`), não por hex.
- Nomeie classes no padrão BEM: `bloco`, `bloco__elemento`, `bloco--modificador`.
- Preserve `prefers-reduced-motion`, estilos de impressão, foco visível e os
  breakpoints existentes (1180, 1080, 1000, 940, 720 e 520 px).
- Não introduza Tailwind, styled-components, CSS Modules ou CSS-in-JS.
- Após mudanças visuais, valide contraste, responsividade e ausência de overflow.
