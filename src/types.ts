/**
 * Contrato de dados do Portal do Lojista.
 * A tela NUNCA recebe id de loja: o backend resolve a loja a partir do token.
 */

export type Periodo = '7d' | '30d' | '90d';

export interface PeriodoRef {
  inicio: string;
  fim: string;
  label: string;
}

export interface LojaRef {
  id: string;
  nome: string;
  categoria: string;
}

export interface LojaResumo {
  loja: LojaRef;
  periodo: PeriodoRef;
  /** Ticket medio da loja no periodo, em BRL. */
  ticketMedio: number;
  /** Ticket medio da categoria; null quando indisponivel. */
  ticketMedioCategoria: number | null;
  /** Variacao do ticket medio vs. periodo anterior (%). */
  variacaoTicketPercentual: number;
  /** Regra ReN05 / K-Anonymity: so exibe a media da categoria quando ha base suficiente. */
  benchmarkingDisponivel: boolean;
  /** k = lojas comparaveis na categoria; minimo = k exigido pela politica. */
  kAnonimato: {
    k: number;
    minimo: number;
  };
  faturamento: number;
  vendas: number;
  visitantes: number;
  /** 0..1 */
  taxaConversao: number;
  /** Estimativa de clientes elegiveis para o cupom. */
  publicoEstimadoCupom: number;
  atualizadoEm: string;
}

export interface HorarioFluxo {
  /** Hora cheia de inicio da faixa (ex.: 18 => 18h-19h). */
  hora: number;
  fluxo: number;
  vendas: number;
}

export interface HorariosPicoResposta {
  horarios: HorarioFluxo[];
  pico: {
    inicio: number;
    fim: number;
    fluxo: number;
  } | null;
  totalVisitantes: number;
}

export interface AfinidadeCategoria {
  categoria: string;
  /** Percentual de clientes da loja que tambem compram na categoria (0..100). */
  afinidadePercentual: number;
  coOcorrencias: number;
}

export interface CrossShoppingResposta {
  pares: AfinidadeCategoria[];
  totalClientesAnalisados: number;
  janelaDias: number;
}

export type CanalCampanha = 'whatsapp' | 'email' | 'push';

export interface CriarCampanhaPayload {
  titulo: string;
  descontoPercentual: number;
  canal: CanalCampanha;
  validadeDias: number;
  publicoAlvo: {
    tipo: 'visitantes_horario_pico';
    janelaDias: number;
    estimativa: number;
  };
}

export interface Campanha {
  id: string;
  titulo: string;
  descontoPercentual: number;
  status: 'agendada' | 'enviando' | 'concluida' | 'falha';
  publicoEstimado: number;
  criadaEm: string;
  codigoCupom?: string;
}
