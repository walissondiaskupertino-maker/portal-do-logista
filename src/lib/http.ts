import { API_BASE_URL, USE_MOCKS } from './env';

export class ApiError extends Error {
  readonly status: number;
  readonly details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  token?: string | null;
  body?: unknown;
}

interface ErrorBody {
  message?: string;
  detail?: string;
  title?: string;
  error?: string;
}

function extractErrorMessage(payload: unknown, status: number): string {
  if (payload && typeof payload === 'object') {
    const body = payload as ErrorBody;
    const candidate = body.message ?? body.detail ?? body.title ?? body.error;
    if (typeof candidate === 'string' && candidate.trim()) return candidate;
  }
  if (status === 401) return 'Sua sessão expirou. Entre novamente para continuar.';
  if (status === 403) return 'Sua loja não tem permissão para acessar estes dados.';
  if (status === 404) return 'Não encontramos dados para o período selecionado.';
  if (status >= 500) return 'Nosso serviço está indisponível no momento. Tente novamente.';
  return 'Não foi possível carregar os dados. Tente novamente.';
}

/**
 * Cliente HTTP unico do portal. Em modo demonstracao (dev + VITE_USE_MOCKS)
 * a chamada e resolvida pelas fixtures, mantendo o mesmo contrato da API.
 */
export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { token, body, headers, ...rest } = options;

  if (USE_MOCKS) {
    // Import dinamico: em producao (USE_MOCKS=false) as fixtures nem entram no bundle.
    const { mockRequest } = await import('./mock');
    return mockRequest<T>(path, { ...rest, body });
  }

  const finalHeaders = new Headers({ Accept: 'application/json' });
  if (token) finalHeaders.set('Authorization', `Bearer ${token}`);
  if (body !== undefined) finalHeaders.set('Content-Type', 'application/json');
  new Headers(headers).forEach((value, key) => finalHeaders.set(key, value));

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...rest,
      headers: finalHeaders,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error;
    throw new ApiError(
      'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.',
      0,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get('content-type') ?? '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json().catch(() => null) : await response.text().catch(() => '');

  if (!response.ok) {
    throw new ApiError(extractErrorMessage(payload, response.status), response.status, payload);
  }

  return payload as T;
}
