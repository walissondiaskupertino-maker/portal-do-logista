/**
 * Flags de ambiente. Mocks so existem em desenvolvimento E com a flag ligada,
 * para que um build de producao nunca sirva dados ficticios.
 */
export const USE_MOCKS = import.meta.env.DEV && import.meta.env.VITE_USE_MOCKS === 'true';

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');

/** Cenarios de demonstracao/QA: ?cenario=bloqueado | vazio | erro */
export type DemoScenario = 'default' | 'bloqueado' | 'vazio' | 'erro';

function readScenario(): DemoScenario {
  const fromUrl = new URLSearchParams(window.location.search).get('cenario');
  if (fromUrl === 'bloqueado' || fromUrl === 'vazio' || fromUrl === 'erro') return fromUrl;
  return 'default';
}

export const DEMO_SCENARIO: DemoScenario = readScenario();
