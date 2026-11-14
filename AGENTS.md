# AGENTS.md — Portal do Lojista

Instruções para assistentes de IA que trabalham neste repositório.

## Ordem de leitura

1. `.opencode/skills/project-conventions/SKILL.md` — regras gerais, comandos e estilo.
2. Skill específica da tarefa em `.opencode/skills/`:
   - `react-vite-ui` — componentes, telas, Recharts, acessibilidade.
   - `design-tokens` — CSS, cores, espaçamento, sombras e tipografia.
   - `data-api-privacy` — API, token, mocks, ReN05/K-Anonymity e cupom.
   - `testing-qa` — testes automatizados e QA headless.
   - `docs-delivery` — README, Spec, Plan, Check e Verification.
3. Documentos de engenharia: `Spec.md`, `Plan.md`, `Check.md`, `Verification.md`,
   `docs/API.md` e `README.md`.

## Regras não negociáveis

- **Idioma:** textos de interface e documentação em pt-BR. Não use emojis na UI,
  nos testes visíveis ou na documentação.
- **Ícones:** somente `lucide-react`, por meio dos wrappers de
  `src/components/icons.tsx`. A única exceção é `IconLogo`, que é a marca do portal.
- **Design tokens:** cores, raios, sombras e tipografia vêm de
  `frontend/src/styles/tokens.css`, importado por `src/styles/global.css`. Não crie
  outro `:root` nem repita valores literais sem justificativa.
- **Dados:** componentes não chamam `fetch`. Use `src/lib/api.ts`,
  `src/lib/http.ts` e `src/hooks/useResource.ts`.
- **Privacidade:** a loja é resolvida pelo token. Nunca envie `lojaId`, nunca crie
  seletor de loja e nunca exiba dados individuais de clientes.
- **ReN05:** a média da categoria só aparece com `benchmarkingDisponivel === true`,
  ticket finito e `k >= mínimo` (padrão 3). Use `src/lib/benchmarking.ts`; o front
  revalida `k` como defesa em profundidade.
- **Mocks:** apenas com `import.meta.env.DEV` e `VITE_USE_MOCKS=true`, via import
  dinâmico. Fixtures não podem entrar no bundle de produção.
- **Cupom:** 15% OFF, canal WhatsApp, validade de 7 dias, `Idempotency-Key` por
  `crypto.randomUUID()`. Desabilite o CTA quando o público for 0 ou o resumo estiver
  carregando/em erro.
- **Qualidade:** antes de concluir, rode `npm run typecheck`, `npm test` e
  `npm run build`. Mudanças visuais exigem QA responsivo em 1440, 1024, 768 e 390 px,
  sem overflow horizontal e com console limpo.
- **Documentação:** toda mudança de comportamento deve atualizar os documentos
  afetados com evidências reais. Não invente números de teste, build ou QA.

## Estrutura resumida

- `src/components/` — UI e testes de componente.
- `src/lib/` — API, auth, mocks, ReN05 e formatação.
- `src/hooks/` — carregamento de recursos.
- `src/styles/global.css` — layout e componentes.
- `frontend/src/styles/tokens.css` — design tokens.
- `src/test/` — setup e fixtures tipadas.
