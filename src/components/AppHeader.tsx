import type { Periodo } from '../types';
import { formatDateTime, initials } from '../lib/format';
import { IconLogo, IconLogout, IconRefresh, IconStore } from './icons';

const PERIODOS: Array<{ value: Periodo; label: string }> = [
  { value: '7d', label: 'Últimos 7 dias' },
  { value: '30d', label: 'Últimos 30 dias' },
  { value: '90d', label: 'Últimos 90 dias' },
];

interface AppHeaderProps {
  storeName: string | null;
  categoria: string | null;
  periodo: Periodo;
  onPeriodoChange: (periodo: Periodo) => void;
  onRefresh: () => void;
  refreshing: boolean;
  onSignOut: () => void;
  userName: string;
  usingMocks: boolean;
  atualizadoEm: string | null;
}

export function AppHeader({
  storeName,
  categoria,
  periodo,
  onPeriodoChange,
  onRefresh,
  refreshing,
  onSignOut,
  userName,
  usingMocks,
  atualizadoEm,
}: AppHeaderProps) {
  return (
    <header className="topbar">
      <div className="topbar__inner">
        <a className="brand" href="/" aria-label="Portal do Lojista — início">
          <span className="brand__mark">
            <IconLogo />
          </span>
          <span className="brand__text">
            <strong>Portal do Lojista</strong>
            <small>Shopping Analytics</small>
          </span>
        </a>

        <div
          className="store-chip"
          title="A loja é identificada automaticamente pelo seu token de acesso"
        >
          <span className="store-chip__icon">
            <IconStore />
          </span>
          <span className="store-chip__text">
            <span className="store-chip__label">Sua loja</span>
            <span className="store-chip__name">{storeName ?? 'Identificando loja…'}</span>
          </span>
          {categoria && <span className="tag">{categoria}</span>}
        </div>

        <div className="topbar__actions">
          {usingMocks && (
            <span className="chip chip--demo" title="Dados de demonstração (fixtures locais)">
              Demo
            </span>
          )}

          <label className="select-field">
            <span className="select-field__label">Período</span>
            <select
              className="select"
              value={periodo}
              onChange={(event) => onPeriodoChange(event.target.value as Periodo)}
            >
              {PERIODOS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            className="icon-btn"
            onClick={onRefresh}
            disabled={refreshing}
            aria-label="Atualizar dados"
            title={
              atualizadoEm ? `Atualizado em ${formatDateTime(atualizadoEm)}` : 'Atualizar dados'
            }
          >
            <IconRefresh className={refreshing ? 'is-spinning' : undefined} />
          </button>

          <div className="topbar__user">
            <span className="avatar" aria-hidden="true">
              {initials(userName)}
            </span>
            <span className="topbar__user-name">{userName}</span>
          </div>

          <button type="button" className="icon-btn" onClick={onSignOut} aria-label="Sair do portal">
            <IconLogout />
          </button>
        </div>
      </div>
    </header>
  );
}
