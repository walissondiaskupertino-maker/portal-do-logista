import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiError } from '../lib/http';

export interface Resource<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  status: number | null;
  reload: () => void;
}

interface ResourceState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  status: number | null;
}

/**
 * Carrega um recurso com estados de carregamento/erro e cancelamento
 * da requisicao anterior quando periodo/mock muda.
 */
export function useResource<T>(
  loader: (signal: AbortSignal) => Promise<T>,
  deps: readonly unknown[],
): Resource<T> {
  const [state, setState] = useState<ResourceState<T>>({
    data: null,
    loading: true,
    error: null,
    status: null,
  });
  const [nonce, setNonce] = useState(0);
  const loaderRef = useRef(loader);
  loaderRef.current = loader;

  useEffect(() => {
    const controller = new AbortController();

    setState((previous) => ({
      data: previous.data,
      loading: true,
      error: null,
      status: null,
    }));

    loaderRef
      .current(controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return;
        setState({ data, loading: false, error: null, status: 200 });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        if (error instanceof DOMException && error.name === 'AbortError') return;

        const message =
          error instanceof Error && error.message
            ? error.message
            : 'Não foi possível carregar os dados. Tente novamente.';

        setState({
          data: null,
          loading: false,
          error: message,
          status: error instanceof ApiError ? error.status : null,
        });
      });

    return () => {
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, nonce]);

  const reload = useCallback(() => {
    setNonce((current) => current + 1);
  }, []);

  return { ...state, reload };
}
