# Portal do Lojista

Painel do lojista do shopping: benchmarking de ticket médio, horários de pico,
cross-shopping e disparo de cupom, consumindo a API do shopping com o token da loja.

Stack: **React 18 + TypeScript + Vite + Recharts + lucide-react**.

Design tokens ficam em [`frontend/src/styles/tokens.css`](frontend/src/styles/tokens.css);
a interface usa ícones Lucide e não usa emojis.

Documentação de engenharia: [Spec.md](Spec.md) · [Plan.md](Plan.md) ·
[Check.md](Check.md) · [Verification.md](Verification.md) · [docs/API.md](docs/API.md) ·
[docs/KANBAN.md](docs/KANBAN.md).

---

## Como rodar

Pré-requisito: Node.js 20+.

```bash
npm install
npm run dev
```

- Front em `http://localhost:5173`.
- O Vite faz proxy de `/api` para `http://localhost:8080` (backend Spring).
- Scripts: `npm run dev`, `npm run build` (typecheck + build), `npm run preview`,
  `npm run typecheck`, `npm test` e `npm run test:watch`.

### Modo demonstração (sem backend)

`.env.development` já vem com `VITE_USE_MOCKS=true`. Nesse modo os dados vêm de
fixtures locais (`src/lib/mock.ts`), mantendo exatamente o mesmo contrato da API.
Um selo **Demo** aparece no cabeçalho. Mocks **nunca** entram em build de produção
(a flag exige `import.meta.env.DEV`).

Cenários prontos para a banca/QA (apenas em modo demo):

| URL | O que demonstra |
| --- | --- |
| `/?cenario=bloqueado` | Benchmark bloqueado por K-Anonymity (k = 2 < 3) |
| `/?cenario=vazio` | Estados vazios dos gráficos |
| `/?cenario=erro` | Estados de erro + botão de retry |

### Integrar com a API real

Crie `.env.development.local`:

```env
VITE_USE_MOCKS=false
VITE_PROXY_TARGET=http://localhost:8080
```

Em produção, `VITE_API_BASE_URL` pode apontar para o gateway (vazio = mesma origem).

Exemplo: API em outro host durante o desenvolvimento:

```env
VITE_USE_MOCKS=false
VITE_API_BASE_URL=http://localhost:8080
```

> Nesse caso o backend precisa liberar CORS para a origem do portal.

### Autenticação e escopo da loja

Não existe seletor de loja: o backend resolve a loja a partir do token.

- Handoff do SSO: `https://portal/?token=<jwt>` — o token é persistido em
  `localStorage` (`portal-lojista.token`) e removido da URL.
- Alternativa: token já presente no `localStorage`, ou colar o token na tela de acesso.
- Header enviado em toda chamada: `Authorization: Bearer <token>`.
- Token expirado → tela "Sua sessão expirou".
- Nenhum endpoint recebe `lojaId`; a tela nunca permite trocar de loja.

---

## Contrato consumido

Detalhes completos em [`docs/API.md`](docs/API.md).

| Método | Endpoint | Uso |
| --- | --- | --- |
| GET | `/api/v1/loja/resumo?periodo=30d` | KPIs, ticket médio, benchmarking e público do cupom |
| GET | `/api/v1/loja/horarios-pico?periodo=30d` | Gráfico de horários de pico |
| GET | `/api/v1/loja/cross-shopping?periodo=30d` | Gráfico de afinidade entre categorias |
| POST | `/api/v1/campanhas` | Disparo do cupom de 15% OFF |

Períodos aceitos: `7d`, `30d`, `90d`.

---

## Critérios de aceite — onde estão no código

| Critério | Implementação |
| --- | --- |
| Comparativo ticket médio loja × categoria | `src/components/BenchmarkCard.tsx` |
| Bloqueio quando k < 3 com explicação (ReN05 / K-Anonymity) | `BenchmarkCard` (`bench__col--locked`, `lock-note`, `data-testid="benchmark-locked"`) |
| Horários de pico (Recharts) | `src/components/PeakHoursCard.tsx` |
| Cross-shopping (Recharts) | `src/components/CrossShoppingCard.tsx` |
| Botão "Disparar Cupom 15% OFF" → `POST /api/v1/campanhas` | `src/components/CouponCard.tsx` + `src/lib/api.ts` |
| Retorno visual de sucesso | Estado de sucesso no card + toast (`src/components/Toast.tsx`) |
| Apenas dados da loja do token | Token em `src/lib/auth.ts`; endpoints sem id de loja; sem seletor |
| Loading / vazio / erro em todos os gráficos | `useResource` + `src/components/States.tsx` |

Estados de carregamento usam skeletons; erros têm mensagem e botão "Tentar
novamente"; vazios explicam o motivo e o que fazer.

---

## Qualidade e testes

| Verificação | Comando | Resultado atual |
| --- | --- | --- |
| Typecheck | `npm run typecheck` | Sem erros |
| Testes unitários e de componente | `npm test` | 40 testes em 4 arquivos |
| Build de produção | `npm run build` | 3 chunks; sem avisos |
| QA de browser (headless) | roteiro em [Verification.md](Verification.md) | 44/44 checks |

Os testes cobrem a regra ReN05/K-Anonymity, a formatação pt-BR e os fluxos críticos
de `BenchmarkCard` e `CouponCard` (sucesso, erro, público zero e loading).

---

## Estrutura

```
src/
  App.tsx                  orquestração da tela, período e refresh
  main.tsx                 bootstrap + ErrorBoundary + ToastProvider
  components/
    AppHeader.tsx          cabeçalho (loja do token, período, refresh, sair)
    KpiGrid.tsx            ticket médio, faturamento, visitantes, conversão
    BenchmarkCard.tsx      comparativo loja × categoria + estado bloqueado
    PeakHoursCard.tsx      gráfico de horários de pico (Recharts)
    CrossShoppingCard.tsx  gráfico de afinidade (Recharts)
    CouponCard.tsx         ação rápida de cupom 15% OFF
    States.tsx             skeletons, empty e error states
    Toast.tsx              feedback de sucesso/erro
    AccessGate.tsx         sessão ausente/expirada e entrada de token
    icons.tsx              wrappers lucide-react + marca do portal
  hooks/useResource.ts     fetch com loading/erro/abort/retry
  lib/
    api.ts                 endpoints do portal
    http.ts                cliente HTTP e normalização de erros
    auth.ts                token do SSO, decode de JWT e expiração
    mock.ts                fixtures do modo demo
    benchmarking.ts        regra ReN05 / K-Anonymity (pura e testável)
    format.ts              formatação pt-BR (moeda, %, hora)
  test/
    setup.ts               jest-dom, cleanup e stubs de browser
    fixtures.ts            fixtures tipadas para os testes
  styles/global.css        layout e componentes responsivos

frontend/src/styles/tokens.css   design tokens (cores, raios, sombras, tipografia)
```

---

## Roteiro rápido para a demo (ORD-14, passo 3)

1. `npm run dev` e abra `http://localhost:5173` (modo demo já ativo).
2. Mostre os cards de KPI e o comparativo **Sua loja × Média da categoria**.
3. Abra `/?cenario=bloqueado` e aponte o card bloqueado com a explicação de
   K-Anonymity (k atual 2, mínimo 3).
4. Volte para a tela inicial e clique em **Disparar Cupom 15% OFF**: o card vira
   estado de sucesso com o código do cupom e um toast confirma o envio.
5. Confira os gráficos de horários de pico e cross-shopping e altere o período.

---

## Observações

- Todos os números são formatados em `pt-BR` (BRL, percentuais e horas).
- Layout responsivo (desktop, tablet e mobile) e sem rolagem horizontal.
- Cores, raios, sombras e tipografia vêm de `frontend/src/styles/tokens.css`; o layout
  responsivo fica em `src/styles/global.css`.
- Ícones da interface vêm de `lucide-react` por meio de `src/components/icons.tsx`;
  a UI e a documentação não usam emojis.
- O build inclui typecheck (`tsc --noEmit`) e não gera avisos no console do browser.
- Fixtures de demonstração são carregadas por import dinâmico apenas em
  desenvolvimento; o bundle de produção não contém os dados de mock.
