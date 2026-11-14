# Kanban — Portal do Lojista

| Campo | Valor |
| --- | --- |
| Data | 2026-11-14 |
| Repositório | local, branch `main`, commit inicial `6a04754` |
| Base | [Plan.md](../Plan.md) · [Check.md](../Check.md) · [Verification.md](../Verification.md) |
| Quadro externo | pendente de autenticação (GitHub Projects) |

Este quadro traduz as fases do [Plan.md](../Plan.md) e as pendências do
[Check.md](../Check.md) em cards acionáveis. Enquanto o repositório remoto não
existe, o estado oficial do fluxo é este arquivo; ao publicar no GitHub, os cards
de "A fazer" e "Bloqueado" viram issues do Project.

## Como usar

- Cada card tem ID estável (`K-01`, `K-02`, ...) usado em commits, issues e PRs.
- Uma coluna representa o estado atual; não duplique o mesmo card em duas colunas.
- Limite de WIP em "Em andamento": 2 cards.
- Um card só entra em "Concluído" com evidência real (comando executado, teste
  verde, link de PR ou captura de QA). Não registre resultado presumido.
- "Bloqueado" exige a dependência externa explícita; quando ela for resolvida, o
  card volta para "A fazer".

## Em andamento

Nenhum card no momento.

## A fazer

| ID | Card | Origem | Pronto quando |
| --- | --- | --- | --- |
| K-10 | Publicar o repositório remoto e configurar `origin` | Plan §10.1; Check §9 | `git remote -v` aponta para o repositório e `main` está publicada |
| K-11 | Criar o GitHub Project e importar os cards como issues | Este quadro | Project "Portal do Lojista" com os cards K-10 a K-19 e labels aplicadas |
| K-12 | Adicionar CI de typecheck, testes e build | Definition of Done | Workflow verde em um PR de teste |
| K-13 | Auditar acessibilidade com axe | Check §4 (RNF-06) e §10.5 | Relatório sem violações críticas nos quatro cenários |
| K-14 | Atualizar devDependencies com avisos do `npm audit` | Check §10.4 | Testes e build verdes após o upgrade de `vitest`/`vite`/`esbuild`/`tinypool` |

## Bloqueado

| ID | Card | Origem | Dependência externa |
| --- | --- | --- | --- |
| K-15 | Conferir o layout com `figura3-portal-lojista.png` | Plan §9; Check §10.1 | Arquivo do mockup ausente no workspace |
| K-16 | Abrir PR para revisão | Plan §9; Check §9 | Depende de K-10 (repositório remoto) |
| K-17 | Fazer merge na branch principal | Plan §9; Check §9 | Depende de K-16 (PR revisado) |
| K-18 | Ensaiar a demo formal (ORD-14, passo 3) | Plan §10.4; Check §9 | Agenda com o time de demonstração |
| K-19 | Integrar com o backend real em `localhost:8080` | Plan §10.3; Check §10.3 | Token de homologação válido |

## Concluído

| ID | Card | Origem | Evidência |
| --- | --- | --- | --- |
| K-01 | Fase 0 — Diagnóstico do boilerplate e dos requisitos | Plan §3 | Diagnóstico registrado no Plan |
| K-02 | Fase 1 — Fundação React 18 + TypeScript + Vite | Plan §3 | Build e scripts configurados |
| K-03 | Fase 2 — Dados, token via SSO, mocks e `useResource` | Plan §3 | `src/lib/*`, `src/hooks/useResource.ts` |
| K-04 | Fase 3 — Interface, gráficos Recharts e cupom | Plan §3 | Componentes da tela |
| K-05 | Fase 4 — Responsividade, tokens e acessibilidade | Plan §3 | `frontend/src/styles/tokens.css` + `src/styles/global.css` |
| K-06 | Fase 5 — Regra ReN05/K-Anonymity extraída | Plan §3 | `src/lib/benchmarking.ts` + `BenchmarkCard` |
| K-07 | Fase 6 — Testes e QA headless | Plan §3 | 40/40 testes e 44/44 checks (Check.md) |
| K-08 | Inicializar o repositório git e criar o commit inicial | Check §10.2 | Commit `6a04754` na branch `main` |
| K-09 | Revalidar a qualidade no commit inicial | Definition of Done | `typecheck` limpo, 40/40 testes, build com 2197 módulos |

## Publicação do repositório

Pré-requisito: GitHub CLI autenticado (`gh auth login`) com escopo `repo` e
`project`. Sem essa credencial o repositório permanece apenas local.

```powershell
# 1. Criar o repositório, configurar origin e enviar a branch main
gh repo create portal-do-lojista --private --source . --remote origin --push

# 2. Autorizar o escopo de Projects, se necessário
gh auth refresh -s project

# 3. Criar o Project e anotar o número retornado
gh project create --owner "<seu-usuario>" --title "Portal do Lojista"

# 4. Criar uma issue por card e adicionar ao Project
gh issue create --title "Publicar o repositório remoto e configurar origin" --body "Card K-10 de docs/KANBAN.md"
gh project item-add "<numero-do-project>" --owner "<seu-usuario>" --url "<url-da-issue>"
```

Para GitLab ou Azure DevOps, crie o projeto vazio no host, rode
`git remote add origin <url>` e `git push -u origin main`; o quadro pode ser
recriado como issues/boards do próprio host.
