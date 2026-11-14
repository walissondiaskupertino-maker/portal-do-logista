import type {
  Campanha,
  CriarCampanhaPayload,
  CrossShoppingResposta,
  HorariosPicoResposta,
  LojaResumo,
  Periodo,
} from '../types';
import { request } from './http';

/**
 * Endpoints do portal. Nenhum deles recebe id de loja: o backend resolve a loja
 * a partir do token (Authorization: Bearer ...). Isso garante o criterio
 * "a tela mostra apenas dados da loja do token".
 */
const ENDPOINTS = {
  resumo: '/api/v1/loja/resumo',
  horariosPico: '/api/v1/loja/horarios-pico',
  crossShopping: '/api/v1/loja/cross-shopping',
  campanhas: '/api/v1/campanhas',
} as const;

export function getResumoLoja(
  periodo: Periodo,
  token: string,
  signal: AbortSignal,
): Promise<LojaResumo> {
  return request<LojaResumo>(`${ENDPOINTS.resumo}?periodo=${periodo}`, { token, signal });
}

export function getHorariosPico(
  periodo: Periodo,
  token: string,
  signal: AbortSignal,
): Promise<HorariosPicoResposta> {
  return request<HorariosPicoResposta>(`${ENDPOINTS.horariosPico}?periodo=${periodo}`, {
    token,
    signal,
  });
}

export function getCrossShopping(
  periodo: Periodo,
  token: string,
  signal: AbortSignal,
): Promise<CrossShoppingResposta> {
  return request<CrossShoppingResposta>(`${ENDPOINTS.crossShopping}?periodo=${periodo}`, {
    token,
    signal,
  });
}

export function criarCampanha(
  payload: CriarCampanhaPayload,
  token: string,
): Promise<Campanha> {
  const idempotencyKey =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  return request<Campanha>(ENDPOINTS.campanhas, {
    method: 'POST',
    token,
    body: payload,
    headers: { 'Idempotency-Key': idempotencyKey },
  });
}
