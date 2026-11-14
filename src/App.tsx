import { useCallback, useEffect, useMemo, useState } from 'react';
import { AccessGate } from './components/AccessGate';
import { AppHeader } from './components/AppHeader';
import { BenchmarkCard } from './components/BenchmarkCard';
import { CouponCard } from './components/CouponCard';
import { CrossShoppingCard } from './components/CrossShoppingCard';
import { KpiGrid } from './components/KpiGrid';
import { PeakHoursCard } from './components/PeakHoursCard';
import { ErrorState, KpiSkeleton } from './components/States';
import { ToastProvider } from './components/Toast';
import { IconLock, IconShield } from './components/icons';
import { useResource } from './hooks/useResource';
import { getCrossShopping, getHorariosPico, getResumoLoja } from './lib/api';
import {
  DEMO_TOKEN,
  bootstrapToken,
  clearToken,
  decodeToken,
  displayNameFromToken,
  isTokenExpired,
  storeToken,
} from './lib/auth';
import { USE_MOCKS } from './lib/env';
import { formatDateTime } from './lib/format';
import type { Periodo } from './types';

export default function App() {
  const [token, setToken] = useState<string | null>(() => bootstrapToken());
  const claims = useMemo(() => decodeToken(token), [token]);
  const expired = isTokenExpired(claims);

  const handleSignOut = useCallback(() => {
    clearToken();
    setToken(null);
  }, []);

  const handleDemo = useCallback(() => {
    storeToken(DEMO_TOKEN);
    setToken(DEMO_TOKEN);
  }, []);

  const handleToken = useCallback((value: string) => {
    storeToken(value);
    setToken(value);
  }, []);

  if (!token || expired) {
    return <AccessGate expired={expired} onDemo={handleDemo} onToken={handleToken} />;
  }

  return (
    <ToastProvider>
      <Dashboard
        token={token}
        userName={displayNameFromToken(claims)}
        onSignOut={handleSignOut}
      />
    </ToastProvider>
  );
}

interface DashboardProps {
  token: string;
  userName: string;
  onSignOut: () => void;
}

function Dashboard({ token, userName, onSignOut }: DashboardProps) {
  const [periodo, setPeriodo] = useState<Periodo>('30d');
  const [refreshNonce, setRefreshNonce] = useState(0);

  const resumo = useResource(
    (signal) => getResumoLoja(periodo, token, signal),
    [periodo, token, refreshNonce],
  );
  const horarios = useResource(
    (signal) => getHorariosPico(periodo, token, signal),
    [periodo, token, refreshNonce],
  );
  const crossSelling = useResource(
    (signal) => getCrossShopping(periodo, token, signal),
    [periodo, token, refreshNonce],
  );

  const refreshing = resumo.loading || horarios.loading || crossSelling.loading;
  const storeName = resumo.data?.loja.nome ?? null;
  const categoria = resumo.data?.loja.categoria ?? null;

  const handleRefresh = useCallback(() => {
    setRefreshNonce((current) => current + 1);
  }, []);

  useEffect(() => {
    document.title = storeName
      ? `${storeName} · Portal do Lojista`
      : 'Portal do Lojista | Shopping Analytics';
  }, [storeName]);

  return (
    <div className="app">
      <div className={`refresh-bar${refreshing ? ' is-active' : ''}`} aria-hidden="true" />

      <AppHeader
        storeName={storeName}
        categoria={categoria}
        periodo={periodo}
        onPeriodoChange={setPeriodo}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        onSignOut={onSignOut}
        userName={userName}
        usingMocks={USE_MOCKS}
        atualizadoEm={resumo.data?.atualizadoEm ?? null}
      />

      <main className="page" aria-busy={refreshing}>
        <section className="page__intro">
          <div>
            <p className="eyebrow">Visão geral</p>
            <h1 className="page__title">Olá, {storeName ?? 'lojista'}</h1>
            <p className="page__subtitle">
              {resumo.data ? (
                <>
                  Desempenho de <strong>{resumo.data.loja.nome}</strong> ·{' '}
                  {resumo.data.loja.categoria} · {resumo.data.periodo.label.toLowerCase()}.
                </>
              ) : (
                <>Carregando o desempenho da sua loja.</>
              )}{' '}
              <span className="page__privacy">
                <IconLock />
                Você vê apenas os dados da sua loja.
              </span>
            </p>
          </div>

          <div className="page__meta">
            {resumo.data && (
              <span className="chip chip--ghost">
                <IconShield />
                Atualizado em {formatDateTime(resumo.data.atualizadoEm)}
              </span>
            )}
          </div>
        </section>

        <div className="page__body">
          {resumo.loading && !resumo.data && <KpiSkeleton />}

          {resumo.error && !resumo.data && (
            <div className="card" data-testid="summary-error">
              <ErrorState
                title="Não foi possível carregar o resumo da loja"
                description={resumo.error}
                onRetry={resumo.reload}
              />
            </div>
          )}

          {resumo.data && <KpiGrid resumo={resumo.data} />}

          <div className="layout">
            <BenchmarkCard resumo={resumo} />
            <CouponCard resumo={resumo} token={token} periodo={periodo} />
          </div>

          <div className="layout layout--charts">
            <PeakHoursCard horarios={horarios} />
            <CrossShoppingCard crossSelling={crossSelling} />
          </div>
        </div>

        <footer className="page__footer">
          <span>
            <IconShield />
            Dados agregados e anonimizados · Regra ReN05 · K-Anonymity (k ≥ 3)
          </span>
          <span>Portal do Lojista · Shopping Analytics</span>
        </footer>
      </main>
    </div>
  );
}
