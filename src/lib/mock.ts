import type {
  Campanha,
  CriarCampanhaPayload,
  CrossShoppingResposta,
  HorariosPicoResposta,
  LojaResumo,
} from '../types';
import { DEMO_SCENARIO } from './env';
import { ApiError } from './http';

const LATENCY_MS = 480;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function endOfToday(): string {
  return new Date().toISOString();
}

function startOfWindow(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().slice(0, 10);
}

function buildResumo(periodo: string): LojaResumo {
  const dias = periodo === '7d' ? 7 : periodo === '90d' ? 90 : 30;
  const bloqueado = DEMO_SCENARIO === 'bloqueado';

  const base: LojaResumo = {
    loja: {
      id: 'loja-000123',
      nome: 'Studio Aura',
      categoria: 'Moda',
    },
    periodo: {
      inicio: startOfWindow(dias),
      fim: endOfToday().slice(0, 10),
      label: `Últimos ${dias} dias`,
    },
    ticketMedio: 187.4,
    ticketMedioCategoria: 213.9,
    variacaoTicketPercentual: 6.2,
    benchmarkingDisponivel: true,
    kAnonimato: { k: 7, minimo: 3 },
    faturamento: 128450.8,
    vendas: 685,
    visitantes: 3120,
    taxaConversao: 0.2195,
    publicoEstimadoCupom: 312,
    atualizadoEm: endOfToday(),
  };

  if (dias === 7) {
    return {
      ...base,
      faturamento: 29480.6,
      vendas: 158,
      visitantes: 728,
      taxaConversao: 0.217,
      publicoEstimadoCupom: 96,
    };
  }

  if (dias === 90) {
    return {
      ...base,
      faturamento: 371920.45,
      vendas: 1984,
      visitantes: 9014,
      taxaConversao: 0.2201,
      publicoEstimadoCupom: 884,
    };
  }

  if (bloqueado) {
    return {
      ...base,
      benchmarkingDisponivel: false,
      ticketMedioCategoria: null,
      kAnonimato: { k: 2, minimo: 3 },
    };
  }

  return base;
}

function buildHorarios(): HorariosPicoResposta {
  if (DEMO_SCENARIO === 'vazio') {
    return { horarios: [], pico: null, totalVisitantes: 0 };
  }

  const horarios = [
    { hora: 10, fluxo: 118, vendas: 9 },
    { hora: 11, fluxo: 156, vendas: 13 },
    { hora: 12, fluxo: 268, vendas: 26 },
    { hora: 13, fluxo: 242, vendas: 23 },
    { hora: 14, fluxo: 198, vendas: 17 },
    { hora: 15, fluxo: 186, vendas: 16 },
    { hora: 16, fluxo: 214, vendas: 19 },
    { hora: 17, fluxo: 268, vendas: 24 },
    { hora: 18, fluxo: 342, vendas: 34 },
    { hora: 19, fluxo: 412, vendas: 41 },
    { hora: 20, fluxo: 356, vendas: 33 },
    { hora: 21, fluxo: 244, vendas: 21 },
    { hora: 22, fluxo: 142, vendas: 10 },
  ];

  const totalVisitantes = horarios.reduce((total, item) => total + item.fluxo, 0);

  return {
    horarios,
    pico: { inicio: 19, fim: 20, fluxo: 412 },
    totalVisitantes,
  };
}

function buildCrossShopping(): CrossShoppingResposta {
  if (DEMO_SCENARIO === 'vazio') {
    return { pares: [], totalClientesAnalisados: 0, janelaDias: 30 };
  }

  return {
    pares: [
      { categoria: 'Acessórios', afinidadePercentual: 41.8, coOcorrencias: 537 },
      { categoria: 'Calçados', afinidadePercentual: 36.2, coOcorrencias: 465 },
      { categoria: 'Beleza e Perfumaria', afinidadePercentual: 28.5, coOcorrencias: 366 },
      { categoria: 'Cafés e Alimentação', afinidadePercentual: 24.1, coOcorrencias: 309 },
      { categoria: 'Joalheria', afinidadePercentual: 17.6, coOcorrencias: 226 },
      { categoria: 'Cinema', afinidadePercentual: 12.4, coOcorrencias: 159 },
    ],
    totalClientesAnalisados: 1284,
    janelaDias: 30,
  };
}

function buildCampanha(payload: CriarCampanhaPayload): Campanha {
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return {
    id: `cmp_${Date.now().toString(36)}`,
    titulo: payload.titulo,
    descontoPercentual: payload.descontoPercentual,
    status: 'agendada',
    publicoEstimado: payload.publicoAlvo.estimativa,
    criadaEm: endOfToday(),
    codigoCupom: `PICO15-${suffix}`,
  };
}

interface MockOptions {
  method?: string;
  body?: unknown;
}

export async function mockRequest<T>(path: string, options: MockOptions = {}): Promise<T> {
  await delay(LATENCY_MS + Math.random() * 220);

  if (DEMO_SCENARIO === 'erro') {
    throw new ApiError('Não foi possível carregar os dados do portal. Tente novamente.', 500);
  }

  const url = new URL(path, 'http://mock.local');
  const method = (options.method ?? 'GET').toUpperCase();

  if (method === 'POST' && url.pathname === '/api/v1/campanhas') {
    const payload = (options.body ?? {}) as CriarCampanhaPayload;
    return buildCampanha(payload) as T;
  }

  if (method === 'GET' && url.pathname === '/api/v1/loja/resumo') {
    return buildResumo(url.searchParams.get('periodo') ?? '30d') as T;
  }

  if (method === 'GET' && url.pathname === '/api/v1/loja/horarios-pico') {
    return buildHorarios() as T;
  }

  if (method === 'GET' && url.pathname === '/api/v1/loja/cross-shopping') {
    return buildCrossShopping() as T;
  }

  throw new ApiError(`Rota de demonstração não mapeada: ${method} ${url.pathname}`, 404);
}
