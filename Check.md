# Check — Portal do Lojista (front-end)

| Campo | Valor |
| --- | --- |
| Data | 2026-11-14 |
| Base | [Spec.md](Spec.md) · [Plan.md](Plan.md) |
| Resultado | **40/40 testes automatizados** e **44/44 checks de browser** aprovados |
| Build | `tsc --noEmit && vite build` sem erros |
| Status geral | Critérios técnicos atendidos; PR/merge e validação visual pendentes |

---

## 1. Resultado executivo

| Verificação | Comando | Resultado |
| --- | --- | --- |
| Typecheck | `npm run typecheck` | Aprovado: Sem erros |
| Testes | `npm test` | Aprovado: 4 arquivos, 40 testes |
| Build | `npm run build` | Aprovado: 2197 módulos, 3 chunks JS |
| QA headless | script Puppeteer (temporário, fora do repo) | Aprovado: 44/44 checks |
| Console do browser | QA headless | Aprovado: Sem erros ou `pageerror` |
| Dependências de produção | `npm audit --omit=dev` | Aprovado: 0 vulnerabilidades |
| Fixtures no bundle | inspeção do `dist/assets/*.js` | Aprovado: Sem dados de fixture |

## 2. Matriz de rastreabilidade

| Critério | Requisito | Implementação | Teste / evidência | Status |
| --- | --- | --- | --- | --- |
| CA-01 | RF-04 | `src/components/BenchmarkCard.tsx` | `BenchmarkCard.test.tsx` (disponível) + QA “comparativo exibe média da categoria” | Aprovado |
| CA-02 | RF-05 | `src/lib/benchmarking.ts` + `BenchmarkCard.tsx` | 8 testes unitários + teste “bloqueia quando k < mínimo” + cenário `?cenario=bloqueado` | Aprovado |
| CA-03 | RF-05 | `evaluateBenchmarking` revalida `k >= mínimo` | Teste “bloqueia quando k < mínimo mesmo com flag true” | Aprovado |
| CA-04 | RF-07, RF-08 | `PeakHoursCard.tsx`, `CrossShoppingCard.tsx` | QA “gráfico de horários” e “gráfico de cross-shopping” em 4 viewports | Aprovado |
| CA-05 | RF-10, RF-11 | `CouponCard.tsx` + `src/lib/api.ts` | Teste de sucesso/payload/toast + QA do fluxo completo | Aprovado |
| CA-06 | RF-12 | `CouponCard.tsx` | Teste “mostra erro e permite tentar de novo” | Aprovado |
| CA-07 | RF-13 | `CouponCard.tsx` | Teste “desabilita o CTA quando o público é zero” | Aprovado |
| CA-08 | RF-14 | `States.tsx` + cards | Testes de vazio/erro/skeleton + cenários `?cenario=vazio` e `?cenario=erro` | Aprovado |
| CA-09 | RF-01, RF-02 | `src/lib/auth.ts`, `src/lib/api.ts` | QA “tela mostra a loja do token” e “sem seletor manual” + inspeção dos endpoints | Aprovado |
| CA-10 | RF-16 | `src/styles/global.css` | QA responsivo em Verification: 1424, 768 e 390 px sem overflow; testes anteriores em 1440 e 1024 | Aprovado |
| CA-11 | RNF-03 | Todos os componentes | QA com listeners de `console` e `pageerror` nos 4 cenários | Aprovado |
| CA-12 | RNF-01, RNF-02 | `package.json`, `vite.config.ts` | `npm test` e `npm run build` executados | Aprovado |
| CA-13 | RNF-09 | `src/components/icons.tsx` + `frontend/src/styles/tokens.css` | 23 SVGs Lucide no DOM com `aria-hidden=true`, tokens resolvidos no CSS e QA sem emojis | Aprovado |

## 3. Checklist de requisitos funcionais

| ID | Requisito | Status | Evidência |
| --- | --- | --- | --- |
| RF-01 | Autenticação por token | Aprovado | `auth.ts` (`bootstrapToken`, `decodeToken`, `isTokenExpired`); `AccessGate.tsx` |
| RF-02 | Sem seletor de loja / sem `lojaId` | Aprovado | Endpoints em `api.ts`; QA “sem seletor manual de loja” |
| RF-03 | Quatro KPIs | Aprovado | `KpiGrid.tsx`; QA `kpis=4` em todos os viewports |
| RF-04 | Comparativo de ticket médio | Aprovado | `BenchmarkCard.tsx`; teste de componente |
| RF-05 | Bloqueio ReN05 quando `k < 3` | Aprovado | `benchmarking.ts`; 8 testes dedicados; QA cenário bloqueado |
| RF-06 | Respeitar flag `benchmarkingDisponivel=false` | Aprovado | Teste “não exibe comparativo quando flag=false” |
| RF-07 | Horários de pico em Recharts | Aprovado | `PeakHoursCard.tsx`; QA “Pico 19h–20h” |
| RF-08 | Cross-shopping em Recharts | Aprovado | `CrossShoppingCard.tsx`; QA “Acessórios” |
| RF-09 | Alterar período | Aprovado | `AppHeader.tsx` + `useResource`; QA “7 dias” |
| RF-10 | `POST /api/v1/campanhas` | Aprovado | `api.ts` (`criarCampanha`) + payload validado em teste |
| RF-11 | Retorno visual de sucesso | Aprovado | `CouponCard.tsx` + `Toast.tsx`; QA código e toast |
| RF-12 | Erro do cupom com retry | Aprovado | Teste de componente com `mockRejectedValue` |
| RF-13 | Público 0 desabilita CTA | Aprovado | Teste de componente |
| RF-14 | Loading / vazio / erro | Aprovado | `States.tsx`; testes e QA dos cenários |
| RF-15 | Demo isolado de produção | Aprovado | `env.ts` (`import.meta.env.DEV`); fixtures ausentes do bundle; selo **Demo** |
| RF-16 | Responsividade | Aprovado | QA nos quatro viewports |

## 4. Checklist de requisitos não funcionais

| ID | Requisito | Status | Evidência |
| --- | --- | --- | --- |
| RNF-01 | Build/typecheck | Aprovado | `npm run build` sem erros |
| RNF-02 | Testes automatizados | Aprovado | 40 testes verdes |
| RNF-03 | Console limpo | Aprovado | 0 erros e 0 `pageerror` nos cenários |
| RNF-04 | Sem overflow horizontal | Aprovado | `scrollWidth == innerWidth` nos 4 viewports |
| RNF-05 | Vendor de gráficos separado | Aprovado | `charts` chunk de 526,67 kB; `index` de 46,13 kB; CSS de 26,39 kB |
| RNF-06 | Acessibilidade básica | Aprovado (parcial) | `role="img"` com `aria-label`, `role="alert"`, `role="note"`, `aria-disabled`, foco visível; auditoria axe não executada |
| RNF-07 | Vulnerabilidades de produção | Aprovado | `npm audit --omit=dev`: 0 |
| RNF-08 | pt-BR | Aprovado | 19 testes de formatação + textos da UI |
| RNF-09 | Design system e ícones | Aprovado | `lucide-react@0.469.0` em `icons.tsx`; tokens de `frontend/src/styles/tokens.css`; nenhum emoji na UI |

## 5. Cenários de QA

| Cenário | URL | Resultado | Checks |
| --- | --- | --- | --- |
| Default desktop | `/` em 1440×900 | Aprovado | KPIs, benchmark disponível, 4 cards, sem overflow, console limpo |
| Default tablet | `/` em 1024×900 | Aprovado | 4 cards, sem overflow, console limpo |
| Default tablet retrato | `/` em 768×1024 | Aprovado | 4 cards empilhados, sem overflow, console limpo |
| Default mobile | `/` em 390×844 | Aprovado | 4 cards empilhados, sem overflow, console limpo |
| Fluxo de cupom | `/` desktop | Aprovado | CTA habilitado, sucesso, código `PICO15-XXXX`, toast |
| Troca de período | `/` desktop | Aprovado | `7d` refletido na tela e nos dados |
| Benchmark bloqueado | `/?cenario=bloqueado` | Aprovado | Valor mascarado, K-Anonymity, `faltam 1`, `k atual = 2` |
| Estados vazios | `/?cenario=vazio` | Aprovado | “Sem fluxo registrado” e “Sem afinidade calculada” |
| Erro de API | `/?cenario=erro` | Aprovado | Erro do resumo, botões de retry e CTA de cupom desabilitado |

### 5.1 Métricas de layout capturadas

| Viewport | Largura dos 4 cards (px) | Overflow | Console |
| --- | --- | --- | --- |
| Desktop 1440 | 751 / 501 / 719 / 533 | Não | Limpo |
| Tablet 1024 | 574 / 382 / 549 / 407 | Não | Limpo |
| Tablet retrato 768 | 720 / 720 / 720 / 720 | Não | Limpo |
| Mobile 390 | 358 / 358 / 358 / 358 | Não | Limpo |

## 6. Checklist de testes automatizados

| Arquivo | Casos | Status |
| --- | --- | --- |
| `src/lib/benchmarking.test.ts` | 8 | Aprovado |
| `src/lib/format.test.ts` | 19 | Aprovado |
| `src/components/BenchmarkCard.test.tsx` | 6 | Aprovado |
| `src/components/CouponCard.test.tsx` | 7 | Aprovado |
| **Total** | **40** | Aprovado |

Casos negativos relevantes:

- `k = 2` com `benchmarkingDisponivel = true` → bloqueado (defesa em profundidade).
- Ticket de categoria `NaN` → tratado como ausente.
- `kAnonimato` ausente → `k = 0`, mínimo padrão `3`.
- Falha de rede no cupom → erro visível, toast e CTA reabilitado.
- Público `0` → CTA desabilitado com explicação.
- Resumo em erro → CTA do cupom desabilitado.

## 7. Design system e ícones

| Item | Verificação | Resultado |
| --- | --- | --- |
| Biblioteca de ícones | `package.json` + inspeção do DOM | Aprovado: `lucide-react@0.469.0`; 23 SVGs com classe `lucide-*` |
| Acessibilidade dos ícones | atributos dos SVGs | Aprovado: `aria-hidden="true"` e `focusable="false"` em todos os wrappers |
| Marca do portal | `IconLogo` | Aprovado: SVG autoral mantido (logotipo, não ícone de ação) |
| Design tokens | `getComputedStyle(document.documentElement)` | Aprovado: `--brand: #4f46e5`, `--brand-gradient`, `--gold-ink` e `--font` resolvidos |
| Tokens no bundle | `dist/assets/index-*.css` | Aprovado: variáveis presentes no CSS compilado |
| Emojis na interface | varredura do `body.innerText` | Aprovado: nenhum emoji encontrado |
| Emojis na documentação | varredura dos arquivos Markdown | Aprovado: status em texto (Aprovado/Atenção/Pendente) |

## 8. Verificação de privacidade e produção

| Item | Verificação | Resultado |
| --- | --- | --- |
| Fixtures no bundle | Busca por `PICO15`, `loja-000123`, `Acessórios`, `128450` em `dist/assets/*.js` | Aprovado: Nenhuma fixture encontrada |
| Mock em produção | `USE_MOCKS = import.meta.env.DEV && ...` | Aprovado: Impossível ativar em build de produção |
| Import de fixtures | `await import('./mock')` dentro do bloco `USE_MOCKS` | Aprovado: Removido pelo tree-shaking no build |
| Token demo | Constante `DEMO_TOKEN` em `auth.ts` | Atenção: Permanece no bundle, porém não carrega dados nem é usado fora do modo demo |
| `lojaId` nos endpoints | Inspeção de `src/lib/api.ts` | Aprovado: Nenhum endpoint recebe loja |

## 9. Definition of Done

| Item | Status | Observação |
| --- | --- | --- |
| Critérios de aceite verificados | Aprovado | CA-01 a CA-13 |
| Layout conferido com o mockup | Pendente | `figura3-portal-lojista.png` ausente no workspace |
| PR revisado | Pendente | Repositório local criado (commit `6a04754`); falta remote e PR |
| Merge na branch principal | Pendente | Depende do PR |
| Validado no ensaio da demo (ORD-14, passo 3) | Atenção: Parcial | Fluxo da demo validado por QA headless; ensaio formal com o time pendente |

## 10. Pendências e observações

1. **Mockup ausente** — a validação visual foi feita por consistência interna e
   responsividade, não por comparação lado a lado.
2. **Repositório remoto ausente** — o repositório local foi inicializado na branch
   `main` com o commit inicial `6a04754`, mas ainda não há remote, PR ou merge.
   O quadro de acompanhamento está em [docs/KANBAN.md](docs/KANBAN.md).
3. **Backend real** — a integração foi validada contra o contrato e as fixtures; não
   houve chamada a uma instância real em `localhost:8080`.
4. **`npm audit` completo** — reporta 6 avisos em dependências de desenvolvimento
   (`vitest`/`vite`/`esbuild`/`tinypool`). O bundle de produção tem 0 vulnerabilidades.
   O upgrade exige salto de major e está registrado em `Verification.md`.
5. **Acessibilidade** — boas práticas semânticas aplicadas, mas sem auditoria axe
   automatizada nesta entrega.
## 8. QA responsivo completo (2026-11-14)

Resultado: **24/24 checks aprovados**.

| Viewport | scrollWidth | KPIs / cards | Largura dos graficos (px) | Overflow | Console |
| --- | ---: | --- | --- | --- | --- |
| 1424x900 | 1424 | 4 / 4 | 487 | Nao | Limpo |
| 768x1024 | 768 | 4 / 4 | 674, 674 | Nao | Limpo |
| 390x844 | 390 | 4 / 4 | 320, 320 | Nao | Limpo |

Cupom: CTA habilitado, sucesso, codigo e toast aprovados. Periodo: 7d selecionado
e refletido nos dados. Cenarios bloqueado, vazio e erro aprovados. Evidencias e
limites do escopo estao em [Verification.md](Verification.md); arquivos em
C:\Users\Eduarda\AppData\Local\Temp\opencode\qa-portal\.
