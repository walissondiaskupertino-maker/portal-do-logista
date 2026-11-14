# Spec — Portal do Lojista (front-end)

| Campo | Valor |
| --- | --- |
| Versão | 1.0 |
| Data | 2026-11-14 |
| Status | Implementado; pendente de validação visual contra o mockup e de PR/merge |
| Escopo | Front-end do painel do lojista (React 18 + TypeScript + Vite + Recharts) |
| Documentos relacionados | [Plan.md](Plan.md) · [Check.md](Check.md) · [Verification.md](Verification.md) · [docs/API.md](docs/API.md) |

---

## 1. Contexto

O lojista de um shopping precisa entender, sem depender de relatórios manuais, como o
ticket médio da sua loja se compara ao da categoria, quais são os horários de pico e
quais categorias têm afinidade com seus clientes. Também precisa de uma ação rápida de
recuperação de clientes: disparar um cupom de desconto para quem já visitou a loja.

O portal é aberto pelo shopping por meio de um handoff de SSO. O token identifica a loja;
o lojista **não** escolhe a loja na tela.

## 2. Objetivo

Entregar uma tela única, responsiva e confiável que:

1. compare o ticket médio da loja com a média da categoria, respeitando K-Anonymity;
2. mostre horários de pico e cross-shopping em gráficos Recharts;
3. permita disparar um cupom de 15% OFF com retorno visual claro;
4. funcione sem backend em modo demonstração, mantendo o mesmo contrato da API;
5. trate loading, vazio e erro em todos os blocos de dados.

## 3. Atores e permissões

| Ator | Acesso |
| --- | --- |
| Lojista autenticado | Vê somente os dados da loja vinculada ao token; pode trocar o período e disparar cupom. |
| Shopping / SSO | Emite o token e abre o portal via `?token=<jwt>`. |
| Backend do shopping | Resolve a loja a partir do token, aplica ReN05/K-Anonymity e persiste campanhas. |
| QA / demonstração | Usa os cenários `?cenario=bloqueado`, `?cenario=vazio` e `?cenario=erro` em modo demo. |

## 4. Escopo

### 4.1 Dentro do escopo

- Dashboard responsivo com KPIs, benchmarking, horários de pico, cross-shopping e cupom.
- Autenticação por token (handoff `?token=`, `localStorage` ou entrada manual).
- Filtro de período `7d`, `30d` e `90d`.
- Modo demonstração com fixtures locais, jamais ativo em produção.
- Estados de carregamento, vazio, erro e retry.
- Ícones vetoriais via `lucide-react`, sem emojis na interface.
- Design tokens centralizados em `frontend/src/styles/tokens.css`.
- Testes automatizados de regra de negócio, formatação e componentes críticos.
- Documentação de contrato, critérios e verificação.

### 4.2 Fora do escopo

- Backend, banco de dados, motor de segmentação ou envio real de WhatsApp.
- Cadastro/login próprio, recuperação de senha e gestão de usuários.
- Edição de campanhas já criadas, relatórios exportáveis e histórico completo.
- Seletor de loja ou impersonação por parte do lojista.
- Comparação pixel-perfect com o mockup (imagem não fornecida no workspace).

## 5. Jornada principal

1. O lojista chega pelo SSO com `?token=<jwt>`.
2. O front persiste o token, remove-o da URL e chama os três endpoints de leitura.
3. A tela mostra KPIs, comparativo de ticket médio, gráficos e o card de cupom.
4. O lojista pode trocar o período, atualizar os dados ou sair.
5. Ao clicar em **Disparar Cupom 15% OFF**, o front cria a campanha e exibe código,
   status e toast de sucesso. Em falha, mostra mensagem e mantém o CTA disponível.

## 6. Requisitos funcionais

| ID | Requisito | Prioridade | Critério de aceite |
| --- | --- | --- | --- |
| RF-01 | Autenticar por token e identificar a loja automaticamente | Must | Sem token válido, exibir tela de acesso; com token, exibir apenas a loja do token. |
| RF-02 | Proibir seletor manual de loja e envio de `lojaId` nos endpoints | Must | Nenhum endpoint recebe id de loja; a tela não oferece troca de loja. |
| RF-03 | Exibir KPIs de ticket médio, faturamento, visitantes e conversão | Must | Quatro KPIs formatados em pt-BR após o carregamento. |
| RF-04 | Comparar ticket médio da loja com a média da categoria | Must | Duas colunas com valores, barras e diferença percentual quando liberado. |
| RF-05 | Bloquear a média da categoria quando `k < 3` (ReN05) | Must | Valor mascarado, selo de bloqueio, explicação de K-Anonymity e `k`/mínimo visíveis. |
| RF-06 | Respeitar `benchmarkingDisponivel=false` mesmo com `k` alto | Must | Card bloqueado e sem valor da categoria. |
| RF-07 | Exibir horários de pico em gráfico Recharts | Must | Barras por hora, pico destacado, resumo de pico/total e tooltip. |
| RF-08 | Exibir cross-shopping em gráfico Recharts | Must | Até 6 categorias ordenadas por afinidade, barras horizontais e base analisada. |
| RF-09 | Permitir alterar o período | Must | `7d`, `30d` e `90d` recarregam os três recursos e atualizam os rótulos. |
| RF-10 | Disparar cupom de 15% OFF via `POST /api/v1/campanhas` | Must | Payload com desconto, canal, validade, público e `Idempotency-Key`. |
| RF-11 | Dar retorno visual de sucesso do cupom | Must | Estado de sucesso com código, status e toast; CTA permite novo disparo. |
| RF-12 | Tratar erro do disparo sem perder o contexto | Must | Mensagem `role="alert"`, toast de erro e CTA reabilitado. |
| RF-13 | Desabilitar o cupom sem público elegível | Should | Público `0` desabilita o CTA e explica o motivo. |
| RF-14 | Tratar loading, vazio e erro em todos os blocos | Must | Skeletons, estados vazios explicativos e erro com **Tentar novamente**. |
| RF-15 | Oferecer modo demonstração isolado de produção | Must | `VITE_USE_MOCKS=true` só funciona com `import.meta.env.DEV`; selo **Demo** visível. |
| RF-16 | Ser responsivo sem rolagem horizontal | Must | Layout íntegro em 1440, 1024, 768 e 390 px. |

## 7. Regras de negócio

### 7.1 ReN05 / K-Anonymity

A média da categoria só pode ser exibida quando **todas** as condições forem verdadeiras:

1. `benchmarkingDisponivel === true`;
2. `ticketMedioCategoria` é um número finito;
3. `kAnonimato.k >= kAnonimato.minimo` (mínimo padrão: `3`).

O front repete a checagem de `k` como **defesa em profundidade**: mesmo que o backend
envie a flag por engano, uma base com `k < mínimo` permanece bloqueada. A
implementação está em `src/lib/benchmarking.ts` e é consumida por
`src/components/BenchmarkCard.tsx`.

Quando bloqueado, a UI deve:

- mascarar o valor (`R$ ••••,••`);
- aplicar estado visual de bloqueio (`bench__col--locked`, `aria-disabled`);
- explicar o motivo e informar `k`, mínimo e quantas lojas faltam;
- nunca renderizar o comparativo percentual.

### 7.2 Cupom

| Parâmetro | Valor |
| --- | --- |
| Desconto | 15% |
| Canal | WhatsApp |
| Validade | 7 dias |
| Público | Visitantes do horário de pico nos últimos `janelaDias` |
| Janela | `7`, `30` ou `90` dias, conforme o período selecionado |
| Idempotência | Header `Idempotency-Key` gerado por `crypto.randomUUID()` |

O CTA só é habilitado quando o resumo está carregado e `publicoEstimadoCupom > 0`.
Ao concluir, a tela mostra o código do cupom (`codigoCupom` ou `id`), o status e a data
de criação.

### 7.3 Privacidade e escopo

- A loja é resolvida exclusivamente pelo token (`Authorization: Bearer <token>`).
- Nenhum endpoint de leitura recebe `lojaId`.
- Médias de categoria são agregadas; nenhum dado individual de cliente é exibido.
- Em produção, mocks são desativados por construção (`import.meta.env.DEV`).

## 8. Contrato consumido

Detalhes completos em [`docs/API.md`](docs/API.md).

| Método | Endpoint | Resposta usada |
| --- | --- | --- |
| GET | `/api/v1/loja/resumo?periodo=30d` | Loja, período, ticket médio, categoria, K-Anonymity, KPIs e público do cupom |
| GET | `/api/v1/loja/horarios-pico?periodo=30d` | Fluxo por hora, pico e total de visitantes |
| GET | `/api/v1/loja/cross-shopping?periodo=30d` | Pares de categorias, afinidade e base analisada |
| POST | `/api/v1/campanhas` | Campanha criada (id, status, público, código, data) |

## 9. Estados de interface

| Bloco | Loading | Vazio | Erro |
| --- | --- | --- | --- |
| KPIs | Skeleton de 4 cards | — | Erro do resumo com retry |
| Benchmark | Skeleton de duas colunas | “Sem dados de ticket médio” | “Benchmark indisponível” + retry |
| Horários | Skeleton de barras | “Sem fluxo registrado” | “Horários indisponíveis” + retry |
| Cross-shopping | Skeleton de barras | “Sem afinidade calculada” | “Cross-shopping indisponível” + retry |
| Cupom | CTA desabilitado + “Aguardando…” | Público 0 desabilita e explica | `role="alert"` + toast + CTA reabilitado |

## 10. Requisitos não funcionais

| ID | Requisito | Meta |
| --- | --- | --- |
| RNF-01 | Typecheck e build de produção | `tsc --noEmit && vite build` sem erros |
| RNF-02 | Testes automatizados | Suíte Vitest verde, cobrindo ReN05, formatadores e fluxos do cupom |
| RNF-03 | Console limpo | Sem erros de console ou `pageerror` nos cenários QA |
| RNF-04 | Responsividade | Sem overflow horizontal de 390 px a 1440 px |
| RNF-05 | Performance de carregamento | Vendor de gráficos separado em chunk próprio |
| RNF-06 | Acessibilidade básica | Landmarks, headings, `role="img"` com `aria-label`, `role="alert"`, foco visível |
| RNF-07 | Segurança de dependências | Zero vulnerabilidades em dependências de produção |
| RNF-08 | Idioma e formatação | Textos em pt-BR; moeda, percentuais, datas e horas localizados |
| RNF-09 | Design system e ícones | UI consome os tokens de `frontend/src/styles/tokens.css`; ícones via `lucide-react`; nenhum emoji na interface |

## 11. Critérios de aceite

| ID | Critério | Como será verificado |
| --- | --- | --- |
| CA-01 | Ticket médio da loja é comparado com a média da categoria | Teste de componente + QA visual |
| CA-02 | Média bloqueada quando `k < 3`, com explicação | Testes unitários + teste de componente + cenário `?cenario=bloqueado` |
| CA-03 | Flag do backend não sobrepõe a regra de `k` | Teste unitário dedicado |
| CA-04 | Gráficos Recharts renderizam com dados reais da API | QA headless em quatro viewports |
| CA-05 | Cupom cria campanha e exibe sucesso | Teste de componente + QA do fluxo completo |
| CA-06 | Falha do cupom é tratada e permite retry | Teste de componente |
| CA-07 | Público 0 desabilita o CTA | Teste de componente |
| CA-08 | Loading, vazio e erro existem nos gráficos e no benchmark | Testes de componente + cenários QA |
| CA-09 | Apenas dados da loja do token; sem seletor | Inspeção de endpoints + QA |
| CA-10 | Layout responsivo sem overflow | QA em 1440/1024/768/390 px |
| CA-11 | Console sem erros nos cenários principais | QA headless |
| CA-12 | Build e testes passam | `npm test` + `npm run build` |
| CA-13 | Ícones Lucide e tokens aplicados, sem emojis | Inspeção de `icons.tsx`, CSS compilado e QA de browser |

## 12. Premissas

- O backend entrega o contrato documentado em `docs/API.md`.
- O token JWT contém `exp` quando há expiração; claims de nome são opcionais.
- O handoff do SSO usa `?token=`; o token é removido da URL após persistência.
- O período padrão é `30d`.
- O workspace não possuía a pasta `frontend/`; por isso `frontend/src/styles/tokens.css`
  foi criado na raiz do projeto e importado por `src/styles/global.css`, sem mover o app.
- A imagem `figura3-portal-lojista.png` será fornecida para validação visual.

## 13. Pendências e riscos conhecidos

| Item | Impacto | Situação |
| --- | --- | --- |
| Mockup `figura3-portal-lojista.png` ausente | Validação pixel-perfect não executada | Aguardando arquivo |
| Diretório não é repositório git | Sem commit, PR ou merge | Aguardando repositório |
| Backend real não disponível no ambiente | Integração real não testada; contrato validado via mocks | Aceito para esta entrega |
| Dependências de desenvolvimento com avisos do `npm audit` | Não afetam o bundle de produção | Plano de upgrade registrado em `Verification.md` |

## 14. Glossário

- **ReN05**: regra de negócio que exige base mínima para exibir benchmarking.
- **K-Anonymity**: proteção que impede identificar lojas individuais em médias agregadas.
- **Cross-shopping**: afinidade entre categorias a partir de clientes em comum.
- **Handoff de SSO**: abertura do portal com token emitido pelo shopping.
- **Fixture**: dado local usado no modo demonstração.
