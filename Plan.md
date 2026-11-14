# Plan — Portal do Lojista (front-end)

| Campo | Valor |
| --- | --- |
| Versão | 1.0 |
| Data | 2026-11-14 |
| Base | [Spec.md](Spec.md) |
| Status | Fases 0–6 concluídas; fase 7 (PR/merge e validação visual) bloqueada |

---

## 1. Visão geral

O plano parte de um HTML5 Boilerplate estático e entrega uma SPA React/TypeScript com
Vite, consumindo quatro endpoints do shopping. A prioridade é fechar os critérios de
aceite com evidência executável: regra ReN05 testada, fluxo de cupom testado, build
limpo e QA de browser em múltiplos viewports.

## 2. Estratégia

1. **Contrato primeiro** — documentar o payload assumido antes de codar a UI.
2. **Camada de dados isolada** — `api`, `http`, `auth`, `mock` e `useResource` separados
   dos componentes, permitindo testar regras sem browser/backend.
3. **Regra de negócio extraída** — ReN05 em `src/lib/benchmarking.ts`, pura e testável,
   com o componente apenas renderizando o resultado.
4. **Demo realista** — fixtures seguem o mesmo contrato e cobrem default, bloqueado,
   vazio e erro.
5. **Verificação em duas camadas** — testes de unidade/componente (Vitest + Testing
   Library) e QA headless com Chrome real (Puppeteer).
6. **Documentação como artefato** — Spec, Plan, Check e Verification versionados com
   resultados reproduzíveis.

## 3. Fases e entregáveis

| Fase | Objetivo | Principais tarefas | Entregável | Status |
| --- | --- | --- | --- | --- |
| 0 | Diagnóstico | Inventariar boilerplate, imagens e requisitos; confirmar ausência de mockup e de repositório git | Diagnóstico registrado | Concluída |
| 1 | Fundação | Migrar para React 18 + TS + Vite; configurar scripts, proxy `/api`, assets em `public/` | Build inicial funcionando | Concluída |
| 2 | Dados e autenticação | Tipos, cliente HTTP, token/SSO, mocks, `useResource` | `src/lib/*`, `src/hooks/useResource.ts` | Concluída |
| 3 | Interface | Header, KPIs, benchmark, gráficos Recharts, cupom, estados e toasts | Componentes da tela | Concluída |
| 4 | Refinamento | Responsividade, tokens de CSS, acessibilidade básica, skeletons | `frontend/src/styles/tokens.css` + `src/styles/global.css` | Concluída |
| 5 | Regra ReN05 | Extrair `evaluateBenchmarking`, defesa em profundidade, estado bloqueado | `benchmarking.ts` + `BenchmarkCard` refatorado | Concluída |
| 6 | Testes e QA | Vitest/jsdom/Testing Library; QA headless em 4 viewports e 4 cenários | 40 testes + 44 checks | Concluída |
| 7 | Entrega | PR revisado, validação visual com mockup, merge e ensaio ORD-14 | PR + merge | Bloqueada |

## 4. Arquitetura entregue

```
src/
  App.tsx                     orquestra token, período, refresh e recursos
  main.tsx                    bootstrap, ErrorBoundary e ToastProvider
  components/
    AppHeader.tsx             loja do token, período, refresh, usuário e saída
    KpiGrid.tsx               4 KPIs
    BenchmarkCard.tsx         comparativo loja × categoria + bloqueio ReN05
    PeakHoursCard.tsx         gráfico de horários (Recharts)
    CrossShoppingCard.tsx     gráfico de afinidade (Recharts)
    CouponCard.tsx            disparo do cupom e estados
    States.tsx                skeletons, vazio e erro
    Toast.tsx                 feedback transitório
    AccessGate.tsx            sessão ausente/expirada
    icons.tsx                 wrappers dos ícones lucide-react + marca do portal
  hooks/useResource.ts        fetch com loading/erro/abort/retry
  lib/
    api.ts                    endpoints e payload de campanha
    http.ts                   cliente HTTP, ApiError e switch de mocks
    auth.ts                   handoff SSO, persistência, decode e expiração
    benchmarking.ts           ReN05/K-Anonymity puro
    mock.ts                   fixtures e cenários demo
    format.ts                 formatação pt-BR
    env.ts                    flags de ambiente e cenário
  test/
    setup.ts                  jest-dom, cleanup, ResizeObserver, matchMedia
    fixtures.ts               fixtures tipadas de resumo/recurso
  styles/global.css           layout, componentes e breakpoints
frontend/src/styles/tokens.css  design tokens (cores, raios, sombras, tipografia)
```

## 5. Decisões técnicas

| ID | Decisão | Alternativas descartadas | Motivo |
| --- | --- | --- | --- |
| ADR-01 | React 18 + TypeScript + Vite | Manter HTML/JS puro, Next.js | Recharts exige React; Vite dá build rápido e typecheck no script |
| ADR-02 | Recharts para os dois gráficos | Chart.js, D3 puro | Requisito do escopo e API declarativa |
| ADR-03 | Token via SSO, sem seletor de loja | Dropdown de lojas | Privacidade e escopo definidos pela regra de negócio |
| ADR-04 | Mocks só com `import.meta.env.DEV` | Mock sempre ligado | Impede dados fictícios em produção |
| ADR-05 | `evaluateBenchmarking` puro | Regra inline no componente | Testabilidade e defesa em profundidade |
| ADR-06 | CSS único com tokens em `frontend/src/styles/tokens.css` e layout em `src/styles/global.css` | Tailwind/styled-components | Menos dependências, ajuste direto ao mockup e uma fonte única para as primitivas visuais |
| ADR-07 | Vitest + Testing Library + jsdom | Jest + Babel | Integração nativa com Vite e mesma resolução de módulos |
| ADR-08 | `vitest/config` no `vite.config.ts` | Config separada | Uma única configuração para dev, build e teste |
| ADR-09 | Ícones via `lucide-react` | SVGs manuais, bibliotecas com fonte de ícone | Pacote tree-shakable, traço consistente e acessibilidade padronizada |
| ADR-10 | `icons.tsx` como camada de compatibilidade | Importar Lucide direto em cada componente | Preserva os nomes `Icon*` e centraliza atributos de traço/ARIA |

## 6. Estratégia de testes

### 6.1 Pirâmide adotada

| Nível | Ferramenta | Alvo | Quantidade |
| --- | --- | --- | --- |
| Unidade | Vitest | ReN05 e formatadores pt-BR | 27 testes |
| Componente | Testing Library + user-event | BenchmarkCard e CouponCard | 13 testes |
| Integração visual | Puppeteer + Chrome headless | Fluxo completo, cenários e viewports | 44 checks |

### 6.2 Casos cobertos

- ReN05 liberado, bloqueado por flag, bloqueado por `k`, ticket nulo/inválido,
  ausência de `kAnonimato`, `faltam` não negativo e fonte nula.
- Formatação de moeda, número, compacto, percentual, percentual com sinal, horas,
  datas, iniciais e primeiro nome; entradas inválidas.
- Benchmark: disponível, bloqueado por `k`, bloqueado por flag, erro + retry, vazio,
  skeleton.
- Cupom: CTA habilitado, sucesso + payload + toast, janela de 7 dias, falha + retry,
  público 0, carregando, resumo com erro.
- QA: 4 viewports sem overflow; fluxo de cupom; troca de período; cenários bloqueado,
  vazio e erro; console limpo.

## 7. Riscos e mitigação

| Risco | Probabilidade | Impacto | Mitigação |
| --- | --- | --- | --- |
| Backend divergir do contrato assumido | Média | Alto | `docs/API.md` detalhado; camada `api/http` isolada para ajuste pontual |
| Backend enviar flag de benchmark indevida | Baixa | Alto | Front revalida `k >= mínimo` em `evaluateBenchmarking` |
| Mockup ausente | Alta | Médio | Tokens centralizados e layout baseado na descrição; validação pendente |
| Ausência de repositório remoto | Média | Médio | Repositório local criado (commit `6a04754`); remote, PR e merge pendentes de credencial |
| Recharts crescer o bundle | Média | Médio | `manualChunks` separa `charts`; limite documentado em 700 kB |
| Testes de gráfico dependerem de layout real | Média | Baixo | Gráficos validados no QA headless, não no jsdom |
| Dependências dev com avisos de segurança | Baixa | Baixo | Produção com 0 vulnerabilidades; upgrade planejado |

## 8. Sequência de execução

1. `npm install`
2. `npm run typecheck`
3. `npm test`
4. `npm run build`
5. `npm run dev` + roteiro ORD-14 (default, bloqueado, cupom, período)
6. QA headless dos cenários e viewports
7. Preencher `Check.md` e `Verification.md`
8. Abrir PR, revisar, validar mockup e fazer merge

## 9. Definition of Done

- [x] Critérios de aceite CA-01 a CA-13 verificados.
- [x] Testes automatizados verdes.
- [x] Build de produção sem erros.
- [x] QA responsivo e console limpo.
- [x] Ícones Lucide e tokens aplicados, sem emojis na interface.
- [x] Documentação Spec/Plan/Check/Verification.
- [ ] Layout conferido lado a lado com `figura3-portal-lojista.png`.
- [ ] PR revisado e merge na branch principal.
- [ ] Ensaio formal da demo (ORD-14, passo 3) com o time.

## 10. Próximos passos

1. Publicar o repositório remoto e fornecer o mockup.
2. Rodar a validação visual e ajustar tokens/espaçamentos se necessário.
3. Testar contra o backend real em `localhost:8080` com um token de homologação.
4. Abrir PR com o resumo de `Verification.md` e realizar o ensaio da demo.
