import { Component, type ErrorInfo, type ReactNode } from 'react';
import { IconAlert, IconRefresh } from './icons';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Evita tela branca caso algum componente falhe em runtime.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[Portal do Lojista] erro inesperado de renderização', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="gate">
          <div className="gate__card">
            <span className="state__icon state__icon--error">
              <IconAlert />
            </span>
            <h1 className="gate__title">Algo saiu do esperado</h1>
            <p className="gate__lead">
              Tivemos um problema ao exibir o portal. Recarregue a página para tentar novamente.
            </p>
            <button
              type="button"
              className="btn btn--primary btn--block"
              onClick={() => window.location.reload()}
            >
              <IconRefresh />
              Recarregar página
            </button>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
