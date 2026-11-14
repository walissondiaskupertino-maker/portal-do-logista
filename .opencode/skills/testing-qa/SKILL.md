---
name: Testes e QA
description: Use ao escrever testes, corrigir bugs, validar build ou executar QA headless/visual do Portal do Lojista.
---

# Testes e QA

## Pirâmide

- Unidade (Vitest): regras puras, principalmente ReN05 e formatação.
- Componente (Testing Library + user-event): fluxos de `BenchmarkCard`,
  `CouponCard` e estados de UI.
- Integração visual (Puppeteer + Chrome headless): layout, gráficos, fluxo de
  cupom, cenários e console.

## Comandos

```bash
npm run typecheck
npm test
npm run build
```

Para QA visual: `npm run dev` e validar os cenários abaixo.

## Convenções de teste

- Arquivos ao lado do código: `*.test.ts` e `*.test.tsx`.
- Use `describe`/`it` com descrições claras em pt-BR.
- Prefira `getByRole`, `getByLabelText` e texto visível. Evite snapshots e
  seletores de implementação.
- Interações usam `userEvent`; não use `fireEvent` sem motivo.
- Mocke rede com `vi.mock`; `restoreMocks` já está ativo.
- Testes devem ser determinísticos: sem rede real, timers reais ou dependência de
  ordem.
- Cubra caminho feliz, erro, vazio, loading e limites.
- Bug corrigido exige teste de regressão. Não remova testes para ficar verde.

## Casos críticos

- ReN05: flag false, `k < mínimo`, ticket nulo/NaN, ausência de `kAnonimato` e
  ticket sem fonte.
- Cupom: payload exato, sucesso com código/toast, erro com retry, público 0,
  janela de 7 dias e resumo em loading/erro.
- Formatação pt-BR: moeda, número, compacto, percentual, hora, data e inválidos.

## QA headless

Cenários: `/`, `/?cenario=bloqueado`, `/?cenario=vazio` e `/?cenario=erro`.
Viewports: 1440×900, 1024×900, 768×1024 e 390×844.

Verifique:

- ausência de overflow horizontal;
- 4 KPIs e 4 cards no layout;
- gráficos renderizados com largura maior que zero;
- fluxo de cupom e troca de período;
- console sem `error` e sem `pageerror`;
- screenshots salvos fora do repositório.

Após rodar, atualize as contagens e evidências em `Check.md` e `Verification.md`.
