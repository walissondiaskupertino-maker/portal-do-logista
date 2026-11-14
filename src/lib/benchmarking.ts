/**
 * Regra ReN05 / K-Anonymity do benchmarking.
 *
 * A media da categoria so pode ser exibida quando:
 *  1. o backend sinaliza `benchmarkingDisponivel`;
 *  2. existe um ticket medio de categoria valido;
 *  3. a base comparavel atinge o k minimo (protecao contra reidentificacao).
 *
 * O front repete a checagem de k como defesa em profundidade: mesmo que o
 * backend envie a flag por engano, uma base com k < minimo continua bloqueada.
 */

export const DEFAULT_K_MINIMO = 3;

export interface BenchmarkingSource {
  benchmarkingDisponivel?: boolean | null;
  ticketMedioCategoria?: number | null;
  kAnonimato?: {
    k?: number | null;
    minimo?: number | null;
  } | null;
}

export interface BenchmarkingState {
  /** Pode exibir a media da categoria? */
  disponivel: boolean;
  /** Ticket medio da categoria, quando valido. */
  ticketCategoria: number | null;
  /** Lojas comparaveis no periodo. */
  k: number;
  /** k minimo exigido pela politica. */
  minimo: number;
  /** Quantas lojas ainda faltam para liberar a media (0 quando liberado). */
  faltam: number;
}

export function evaluateBenchmarking(
  source: BenchmarkingSource | null | undefined,
): BenchmarkingState {
  const k = source?.kAnonimato?.k ?? 0;
  const minimo = source?.kAnonimato?.minimo ?? DEFAULT_K_MINIMO;
  const rawTicket = source?.ticketMedioCategoria;
  const ticketCategoria =
    typeof rawTicket === 'number' && Number.isFinite(rawTicket) ? rawTicket : null;

  const disponivel =
    source?.benchmarkingDisponivel === true && ticketCategoria !== null && k >= minimo;

  return {
    disponivel,
    ticketCategoria,
    k,
    minimo,
    faltam: Math.max(minimo - k, 0),
  };
}
