import { vi } from 'vitest';
import type { Resource } from '../hooks/useResource';
import type { LojaResumo } from '../types';

export function resumoFixture(overrides: Partial<LojaResumo> = {}): LojaResumo {
  return {
    loja: { id: 'loja-000123', nome: 'Studio Aura', categoria: 'Moda' },
    periodo: { inicio: '2026-10-16', fim: '2026-11-14', label: 'Últimos 30 dias' },
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
    atualizadoEm: '2026-11-14T12:00:00',
    ...overrides,
  };
}

export function resourceFixture(
  overrides: Partial<Resource<LojaResumo>> = {},
): Resource<LojaResumo> {
  return {
    data: resumoFixture(),
    loading: false,
    error: null,
    status: 200,
    reload: vi.fn(),
    ...overrides,
  };
}
