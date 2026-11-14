import { USE_MOCKS } from './env';

const TOKEN_KEY = 'portal-lojista.token';

/** Token de demonstracao usado apenas quando VITE_USE_MOCKS=true. */
export const DEMO_TOKEN = 'demo.portal-lojista.token';

export interface TokenClaims {
  name?: string;
  email?: string;
  preferred_username?: string;
  exp?: number;
  lojaId?: string;
  storeId?: string;
}

function persist(token: string): void {
  try {
    window.localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // localStorage indisponivel (modo privado): segue apenas em memoria.
  }
}

export function storeToken(token: string): void {
  persist(token);
}

export function clearToken(): void {
  try {
    window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    // noop
  }
}

export function readStoredToken(): string | null {
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

/**
 * Consome o token de handoff do SSO (?token=...), persiste e limpa a URL
 * para nao deixar credencial no historico/barra de enderecos.
 * Sem seletor manual de loja: a loja vem sempre do token.
 */
export function bootstrapToken(): string | null {
  const url = new URL(window.location.href);
  const fromUrl = url.searchParams.get('token');

  if (fromUrl) {
    persist(fromUrl);
    url.searchParams.delete('token');
    window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
    return fromUrl;
  }

  const stored = readStoredToken();
  if (stored) return stored;

  if (USE_MOCKS) {
    persist(DEMO_TOKEN);
    return DEMO_TOKEN;
  }

  return null;
}

function decodeBase64Url(input: string): string {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=');
  const binary = window.atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function decodeToken(token: string | null): TokenClaims | null {
  if (!token) return null;
  if (token === DEMO_TOKEN) {
    return { name: 'Studio Aura', email: 'demo@shopping.com.br', lojaId: 'loja-demo' };
  }

  const parts = token.split('.');
  if (parts.length < 2) return null;

  try {
    return JSON.parse(decodeBase64Url(parts[1])) as TokenClaims;
  } catch {
    return null;
  }
}

export function isTokenExpired(claims: TokenClaims | null): boolean {
  if (!claims?.exp) return false;
  return claims.exp * 1000 <= Date.now();
}

export function displayNameFromToken(claims: TokenClaims | null): string {
  return claims?.name ?? claims?.preferred_username ?? claims?.email ?? 'Lojista';
}
