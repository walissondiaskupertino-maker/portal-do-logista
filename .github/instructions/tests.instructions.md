---
applyTo: "src/**/*.test.ts,src/**/*.test.tsx,src/test/**/*.ts"
---

# Testes

- Use Vitest + Testing Library + jsdom. O setup fica em `src/test/setup.ts` e as
  fixtures tipadas em `src/test/fixtures.ts`.
- Testes ficam ao lado do código (`*.test.ts` / `*.test.tsx`).
- Prefira `getByRole`, `getByLabelText` e texto visível; evite seletores de
  implementação e snapshots. Interações usam `userEvent`.
- Cubra caminho feliz, erro, vazio e limites. Bug corrigido exige teste de
  regressão. Não remova nem enfraqueça testes para obter sucesso.
- ReN05: teste flag false, `k` abaixo do mínimo, ticket nulo/NaN e ausência de
  `kAnonimato`.
- Cupom: sucesso com payload, erro com retry, público 0 e resumo em erro/loading.
- Mantenha testes determinísticos: sem rede real, sem timers reais e sem
  dependência de ordem de execução.
- Ao final, rode `npm test` e atualize as contagens em `Check.md`/`Verification.md`.
