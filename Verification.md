# Verification — Portal do Lojista (front-end)

| Campo | Valor |
| --- | --- |
| Data da verificação | 2026-11-14 |
| Base | [Spec.md](Spec.md) · [Plan.md](Plan.md) · [Check.md](Check.md) |
| Ambiente | Windows (win32), Node.js 20.18.0, npm 10.8.2, Google Chrome |
| Veredito | **Aprovado nos critérios técnicos**; pendências de mockup e git registradas |

---

## 1. Ambiente

| Item | Versão / detalhe |
| --- | --- |
| Sistema operacional | Windows (win32) |
| Node.js | v20.18.0 (distribuição portátil usada no QA) |
| npm | 10.8.2 |
| Navegador | Google Chrome (`C:\Program Files\Google\Chrome\Application\chrome.exe`) |
| React / React DOM | 18.3.1 |
| TypeScript | 5.9.3 |
| Vite | 5.4.21 |
| Recharts | 2.15.4 |
| lucide-react | 0.469.0 |
| Vitest | 2.1.9 |
| Testing Library | React 16.1.0, DOM 10.4.0, user-event 14.5.2, jest-dom 6.6.3 |
| jsdom | 25.0.1 |
| Servidor de QA | Vite dev em `http://localhost:5199` (modo demo) |

> O Node não está no PATH global do ambiente; a verificação usou o binário portátil
> em `C:\Users\Eduarda\AppData\Local\Temp\opencode\node\node-v20.18.0-win-x64`.

## 2. Comandos executados

### 2.1 Typecheck

```bash
npm run typecheck
```

Resultado: **sem saída de erro**, exit code 0.

### 2.2 Testes automatizados

```bash
npm test
```

Resultado:

```
✓ src/lib/benchmarking.test.ts        (8 tests)
✓ src/lib/format.test.ts              (19 tests)
✓ src/components/BenchmarkCard.test.tsx (6 tests)
✓ src/components/CouponCard.test.tsx  (7 tests)

Test Files  4 passed (4)
Tests       40 passed (40)
Duration    ~2,9 s
```

### 2.3 Build de produção

```bash
npm run build
```

Resultado:

```
vite v5.4.21 building for production...
✓ 2197 modules transformed.
dist/index.html                  0,94 kB │ gzip:   0,49 kB
dist/assets/index-*.css         26,39 kB │ gzip:   6,13 kB
dist/assets/react-*.js           0,07 kB │ gzip:   0,09 kB
dist/assets/index-*.js          46,13 kB │ gzip:  13,60 kB
dist/assets/charts-*.js        526,67 kB │ gzip: 151,61 kB
✓ built in ~5,2 s
```

- Sem erros de TypeScript.
- Sem aviso de chunk acima do limite (limite configurado em 700 kB).
- Vendor de gráficos isolado em `charts`.

### 2.4 Auditoria de dependências

```bash
npm audit --omit=dev
```

Resultado: **0 vulnerabilidades** nas dependências de produção.

```bash
npm audit
```

Resultado: 6 avisos em dependências de desenvolvimento (`vitest`, `vite`, `esbuild`,
`tinypool`). A correção exigiria upgrade de major (`vitest@4` / `vite@6+`), fora do
escopo desta entrega. Nenhum desses pacotes é enviado ao bundle de produção.

### 2.5 QA headless

Script temporário fora do repositório:

```bash
node C:\Users\Eduarda\AppData\Local\Temp\opencode\qa-portal\qa.mjs
```

Resultado: **44/44 checks aprovados**.

### 2.6 Design system e ícones

Script complementar `qa-icons.mjs` (fora do repositório) inspecionou o DOM em modo demo:

| Item | Resultado |
| --- | --- |
| SVGs Lucide renderizados | 23 (15 ícones distintos: store, refresh-cw, trending-up/down, lock, clock, users, shopping-bag, ticket, sparkles, shield-check, log-out, chart-column, info, arrow-right) |
| Acessibilidade | Todos os wrappers com `aria-hidden="true"` e `focusable="false"` |
| Marca do portal | `IconLogo` permanece como SVG autoral (logotipo) |
| Tokens resolvidos | `--brand: #4f46e5`, `--brand-gradient`, `--gold-ink: #8a5a00`, `--font` |
| Emojis na UI | Nenhuma ocorrência em `body.innerText` |
| Emojis na documentação | Nenhuma ocorrência de status emoji nos Markdown |

O arquivo `frontend/src/styles/tokens.css` é importado no topo de
`src/styles/global.css` e aparece no CSS compilado do build.

## 3. Evidências de teste por camada

### 3.1 Unidade — ReN05 (`benchmarking.test.ts`)

| Caso | Resultado |
| --- | --- |
| Flag true, ticket presente e `k >= mínimo` | Aprovado: disponível |
| Flag true, ticket presente e `k < mínimo` | Aprovado: bloqueado (defesa em profundidade) |
| Flag false | Aprovado: bloqueado |
| Ticket `null` | Aprovado: bloqueado |
| Ticket `NaN` | Aprovado: tratado como ausente |
| `kAnonimato` ausente | Aprovado: `k = 0`, mínimo padrão 3 |
| `k` acima do mínimo | Aprovado: `faltam = 0` |
| Fonte nula | Aprovado: bloqueado |

### 3.2 Unidade — formatação pt-BR (`format.test.ts`)

Cobriu moeda BRL, números, notação compacta, percentuais, percentual com sinal,
rótulos de hora/faixa, data/hora, data, iniciais e primeiro nome, incluindo entradas
nulas, indefinidas e inválidas.

### 3.3 Componentes

**BenchmarkCard (6 testes):**

- média e comparativo visíveis quando liberado;
- bloqueio com `k = 2` mesmo com flag true;
- bloqueio com `benchmarkingDisponivel = false`;
- erro com `role="alert"` e retry acionando `reload`;
- vazio sem dados;
- skeleton no carregamento inicial.

**CouponCard (7 testes):**

- público e CTA habilitado;
- sucesso com payload exato, código, toast e chamada a `criarCampanha`;
- janela de 7 dias quando o período é `7d`;
- falha com `role="alert"`, toast e CTA reabilitado;
- público 0 desabilita e explica;
- resumo carregando desabilita;
- resumo com erro desabilita.

### 3.4 QA de browser

Cenários e viewports:

| Viewport | Overflow | KPIs | Cards | Console | Resultado |
| --- | --- | --- | --- | --- | --- |
| 1440×900 | Não | 4 | 751/501/719/533 px | Limpo | Aprovado |
| 1024×900 | Não | 4 | 574/382/549/407 px | Limpo | Aprovado |
| 768×1024 | Não | 4 | 720/720/720/720 px | Limpo | Aprovado |
| 390×844 | Não | 4 | 358/358/358/358 px | Limpo | Aprovado |

Fluxo principal validado:

- loja do token exibida (`Studio Aura`);
- média da categoria (`213,90`) e selo “Benchmarking ativo”;
- gráfico de horários com pico `19h–20h`;
- cross-shopping com `Acessórios`;
- ausência de seletor manual de loja;
- CTA de cupom habilitado;
- sucesso com “Cupom disparado!”, código `PICO15-XXXX` e toast;
- troca para `7d` refletida na tela.

Cenários:

| Cenário | Verificação | Resultado |
| --- | --- | --- |
| `?cenario=bloqueado` | Card bloqueado, `R$ ••••,••`, K-Anonymity, `faltam 1`, `k atual = 2` | Aprovado |
| `?cenario=vazio` | “Sem fluxo registrado” e “Sem afinidade calculada” | Aprovado |
| `?cenario=erro` | Erro do resumo, “Tentar novamente” e cupom desabilitado | Aprovado |

Screenshots geradas fora do repositório em
`C:\Users\Eduarda\AppData\Local\Temp\opencode\qa-portal\`:
`shot-desktop.png`, `shot-tablet.png`, `shot-tablet-portrait.png`, `shot-mobile.png`,
`shot-bloqueado.png`, `shot-vazio.png`, `shot-erro.png`.

## 4. Verificação de produção e privacidade

| Verificação | Como | Resultado |
| --- | --- | --- |
| Mock não ativa em produção | `USE_MOCKS = import.meta.env.DEV && ...` | Aprovado: Constante false no build |
| Fixtures fora do bundle | Busca por `PICO15`, `loja-000123`, `Acessórios`, `128450` nos assets | Aprovado: Nenhuma ocorrência |
| Import dinâmico do mock | `await import('./mock')` no bloco condicional | Aprovado: Tree-shaking removeu as fixtures |
| Token demo no bundle | Busca por `demo.portal-lojista` | Atenção: Constante de autenticação presente; não contém dados e só é usada no fluxo demo |
| Endpoints sem `lojaId` | Inspeção de `src/lib/api.ts` | Aprovado: Nenhum endpoint recebe loja |
| Console do browser | Listeners de `console.error` e `pageerror` | Aprovado: 0 ocorrências nos 4 cenários |

## 5. Verificação manual / exploratória

| Item | Resultado |
| --- | --- |
| Navegação por teclado nos botões principais | Aprovado: Botões nativos e foco visível |
| Textos em pt-BR e formatação | Aprovado: Revisão visual + testes |
| Estados de loading | Aprovado: Skeletons observados no carregamento dos recursos |
| Retry após erro | Aprovado: Botões presentes no cenário de erro |
| Troca de período | Aprovado: Recarrega os três recursos |
| Refresh manual | Aprovado: Botão do header dispara nova carga |
| Logout | Aprovado: Retorna à tela de acesso |
| Ícones Lucide e tokens | Aprovado: 23 SVGs `lucide-*`, atributos ARIA, tokens resolvidos e sem emojis |

> A auditoria automatizada de acessibilidade (axe) não foi executada nesta entrega.

## 6. Limitações da verificação

1. **Sem backend real** — os testes de integração usaram fixtures com o mesmo contrato.
   Não foi possível validar CORS, latência, erros reais do Spring ou o envio efetivo do
   WhatsApp.
2. **Sem mockup** — `figura3-portal-lojista.png` não existe no workspace; a validação
   visual foi baseada em consistência, hierarquia e responsividade.
3. **Sem git** — `git status` retorna `fatal: not a git repository`; não houve commit,
   PR ou merge.
4. **Ensaio ORD-14** — o roteiro foi coberto pelo QA headless, mas não houve ensaio
   formal com o time.
5. **`npm audit` completo** — 6 avisos em dependências apenas de desenvolvimento;
   produção com 0 vulnerabilidades.
6. **Estrutura híbrida de tokens** — a pasta `frontend/` contém apenas
   `src/styles/tokens.css`, criada para atender ao caminho solicitado; o app continua
   em `src/`.

## 7. Reprodução

```bash
npm install
npm run typecheck
npm test
npm run build
npm run dev
```

Para o QA manual:

1. abra `http://localhost:5173` (modo demo ativo);
2. percorra o roteiro ORD-14;
3. abra `/?cenario=bloqueado`, `/?cenario=vazio` e `/?cenario=erro`;
4. redimensione para 390 px e confirme a ausência de rolagem horizontal.

## 8. Conclusão

A entrega atende aos critérios de aceite técnicos CA-01 a CA-13, com 40 testes
automatizados verdes, build de produção limpo, 44 checks de browser aprovados e
console sem erros. As pendências restantes são externas ao código: mockup para
validação visual, repositório git para PR/merge e backend real para integração
ponta a ponta.
