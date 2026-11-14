# Contrato da API — Portal do Lojista

Este documento descreve o contrato consumido pelo front-end. O backend pode usar
outra modelagem interna, mas os campos abaixo são os que a tela lê hoje
(`src/types.ts`).

## Autenticação e escopo

- Toda requisição envia `Authorization: Bearer <token>`.
- **Nenhum endpoint recebe id de loja.** A loja é derivada do token no backend.
- Token inválido/expirado deve responder `401` — a tela exibe "Sua sessão expirou".
- Loja sem permissão: `403`.

Formato de erro aceito (qualquer um destes campos): `message`, `detail`, `title`
ou `error`.

```json
{ "message": "Base insuficiente para benchmarking" }
```

## GET /api/v1/loja/resumo

Query: `periodo` = `7d` | `30d` | `90d` (default `30d`).

```json
{
  "loja": { "id": "loja-000123", "nome": "Studio Aura", "categoria": "Moda" },
  "periodo": {
    "inicio": "2026-10-15",
    "fim": "2026-11-14",
    "label": "Últimos 30 dias"
  },
  "ticketMedio": 187.4,
  "ticketMedioCategoria": 213.9,
  "variacaoTicketPercentual": 6.2,
  "benchmarkingDisponivel": true,
  "kAnonimato": { "k": 7, "minimo": 3 },
  "faturamento": 128450.8,
  "vendas": 685,
  "visitantes": 3120,
  "taxaConversao": 0.2195,
  "publicoEstimadoCupom": 312,
  "atualizadoEm": "2026-11-14T12:00:00Z"
}
```

Regras:

- `benchmarkingDisponivel` deve ser `false` quando a base comparável da categoria
  não atingir `kAnonimato.minimo` (regra **ReN05**). Nesse caso
  `ticketMedioCategoria` pode vir `null`.
- O front também bloqueia a exibição quando `kAnonimato.k < kAnonimato.minimo`,
  mesmo que a flag venha `true` (defesa em profundidade).
- `taxaConversao` é fração (`0.2195` = 21,95%).
- `publicoEstimadoCupom` alimenta o card de ação rápida.

## GET /api/v1/loja/horarios-pico

Query: `periodo` = `7d` | `30d` | `90d`.

```json
{
  "horarios": [
    { "hora": 10, "fluxo": 118, "vendas": 9 },
    { "hora": 11, "fluxo": 156, "vendas": 13 },
    { "hora": 19, "fluxo": 412, "vendas": 41 }
  ],
  "pico": { "inicio": 19, "fim": 20, "fluxo": 412 },
  "totalVisitantes": 3146
}
```

- `hora` é a hora cheia de início da faixa (`19` = 19h–20h).
- `pico` pode ser `null` quando não houver fluxo.
- `horarios: []` dispara o estado vazio do gráfico.

## GET /api/v1/loja/cross-shopping

Query: `periodo` = `7d` | `30d` | `90d`.

```json
{
  "pares": [
    { "categoria": "Acessórios", "afinidadePercentual": 41.8, "coOcorrencias": 537 },
    { "categoria": "Calçados", "afinidadePercentual": 36.2, "coOcorrencias": 465 }
  ],
  "totalClientesAnalisados": 1284,
  "janelaDias": 30
}
```

- `afinidadePercentual` em 0–100.
- A tela exibe as 6 categorias de maior afinidade, em ordem decrescente.
- `pares: []` dispara o estado vazio.

## POST /api/v1/campanhas

Cria e agenda o disparo do cupom de 15% OFF para os visitantes do horário de pico.

Headers:

```
Authorization: Bearer <token>
Content-Type: application/json
Idempotency-Key: <uuid>   # evita disparo duplicado em retry
```

Payload:

```json
{
  "titulo": "Cupom 15% OFF — clientes do horário de pico",
  "descontoPercentual": 15,
  "canal": "whatsapp",
  "validadeDias": 7,
  "publicoAlvo": {
    "tipo": "visitantes_horario_pico",
    "janelaDias": 30,
    "estimativa": 312
  }
}
```

Resposta esperada: `201 Created`.

```json
{
  "id": "cmp_9f2c1a",
  "titulo": "Cupom 15% OFF — clientes do horário de pico",
  "descontoPercentual": 15,
  "status": "agendada",
  "publicoEstimado": 312,
  "criadaEm": "2026-11-14T12:03:00Z",
  "codigoCupom": "PICO15-A1B2"
}
```

- `status`: `agendada` | `enviando` | `concluida` | `falha`.
- `codigoCupom` é opcional; se ausente, a tela usa o `id`.
- Qualquer `2xx` com corpo vazio também é aceito (a tela usa o público estimado
  que já conhece), mas o retorno completo é recomendado para o feedback visual.

## Exemplos rápidos

```bash
# resumo
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8080/api/v1/loja/resumo?periodo=30d"

# disparo do cupom
curl -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: $(uuidgen)" \
  -d '{"titulo":"Cupom 15% OFF","descontoPercentual":15,"canal":"whatsapp","validadeDias":7,"publicoAlvo":{"tipo":"visitantes_horario_pico","janelaDias":30,"estimativa":312}}' \
  "http://localhost:8080/api/v1/campanhas"
```

## Modo demo

Com `VITE_USE_MOCKS=true` (apenas em dev), `src/lib/mock.ts` responde exatamente
os payloads acima, com latência simulada. Para testar estados:

- `?cenario=bloqueado`: `benchmarkingDisponivel: false`, `k: 2`, `minimo: 3`.
- `?cenario=vazio`: `horarios: []`, `pares: []`.
- `?cenario=erro`: todos os GETs respondem `500`.
