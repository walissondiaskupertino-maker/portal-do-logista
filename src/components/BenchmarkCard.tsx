import type { Resource } from '../hooks/useResource';
import { evaluateBenchmarking } from '../lib/benchmarking';
import { formatCurrency, formatSignedPercent } from '../lib/format';
import type { LojaResumo } from '../types';
import { Card } from './Card';
import { IconInfo, IconLock, IconShield, IconTrendDown, IconTrendUp } from './icons';
import { BenchmarkSkeleton, EmptyState, ErrorState } from './States';

interface BenchmarkCardProps {
  resumo: Resource<LojaResumo>;
}

export function BenchmarkCard({ resumo }: BenchmarkCardProps) {
  const data = resumo.data;
  const bench = evaluateBenchmarking(data);
  const { disponivel, ticketCategoria, k, minimo, faltam } = bench;

  const badge = data ? (
    disponivel ? (
      <span className="pill pill--ok">
        <IconShield />
        Benchmarking ativo
      </span>
    ) : (
      <span className="pill pill--lock">
        <IconLock />
        Bloqueado · ReN05
      </span>
    )
  ) : null;

  return (
    <Card
      title="Ticket médio"
      subtitle="Sua loja comparada com a média da categoria no mesmo período"
      badge={badge}
      className="card--benchmark"
      testId="benchmark-card"
    >
      {resumo.loading && !data && <BenchmarkSkeleton />}

      {!resumo.loading && resumo.error && (
        <ErrorState
          compact
          title="Benchmark indisponível"
          description={resumo.error}
          onRetry={resumo.reload}
        />
      )}

      {!resumo.loading && !resumo.error && !data && (
        <EmptyState
          title="Sem dados de ticket médio"
          description="Não há vendas suficientes para calcular o ticket médio neste período."
        />
      )}

      {data && (
        <div className="bench" data-testid={disponivel ? 'benchmark-available' : 'benchmark-locked'}>
          <div className="bench__cols">
            <div className="bench__col">
              <span className="bench__label">Sua loja</span>
              <strong className="bench__value">{formatCurrency(data.ticketMedio)}</strong>
              <div className="bench__bar">
                <span
                  className="bench__fill bench__fill--store"
                  style={{ width: `${barWidth(data.ticketMedio, ticketCategoria)}%` }}
                />
              </div>
              <span className="bench__hint">{data.periodo.label}</span>
            </div>

            <div
              className={`bench__col${disponivel ? '' : ' bench__col--locked'}`}
              aria-disabled={!disponivel}
            >
              <span className="bench__label">
                Média da categoria
                <span className="tag">{data.loja.categoria}</span>
              </span>
              <strong className={`bench__value${disponivel ? '' : ' bench__value--masked'}`}>
                {disponivel && ticketCategoria !== null
                  ? formatCurrency(ticketCategoria)
                  : 'R$ ••••,••'}
              </strong>
              <div className="bench__bar">
                <span
                  className={`bench__fill ${
                    disponivel ? 'bench__fill--category' : 'bench__fill--ghost'
                  }`}
                  style={{
                    width: disponivel
                      ? `${barWidth(ticketCategoria, data.ticketMedio)}%`
                      : '100%',
                  }}
                />
              </div>
              <span className="bench__hint">
                {disponivel ? 'Referência das lojas do shopping' : 'Dado protegido por K-Anonymity'}
              </span>
              {!disponivel && (
                <span className="bench__lock">
                  <IconLock />
                  Bloqueado
                </span>
              )}
            </div>
          </div>

          {disponivel && ticketCategoria !== null ? (
            <ComparisonNote
              ticketMedio={data.ticketMedio}
              ticketCategoria={ticketCategoria}
              categoria={data.loja.categoria}
            />
          ) : (
            <div className="lock-note" role="note">
              <span className="lock-note__icon">
                <IconLock />
              </span>
              <div className="lock-note__content">
                <p className="lock-note__title">Média da categoria indisponível</p>
                <p className="lock-note__text">
                  Para proteger o anonimato das lojas (K-Anonymity), a média só é exibida quando a
                  categoria tem pelo menos <strong>{minimo} lojas</strong> com movimento no período.
                  {faltam > 0
                    ? ` No momento, apenas ${k} ${k === 1 ? 'loja é comparável' : 'lojas são comparáveis'} — faltam ${faltam}.`
                    : ' A base ainda não atingiu o mínimo exigido.'}
                </p>
                <p className="lock-note__meta">
                  Regra ReN05 · k mínimo = {minimo} · k atual = {k}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

function barWidth(value: number | null | undefined, reference: number | null | undefined): number {
  const max = Math.max(value ?? 0, reference ?? 0);
  if (!Number.isFinite(max) || max <= 0) return 0;
  const width = ((value ?? 0) / max) * 100;
  return Math.max(0, Math.min(100, width));
}

interface ComparisonNoteProps {
  ticketMedio: number;
  ticketCategoria: number;
  categoria: string;
}

function ComparisonNote({ ticketMedio, ticketCategoria, categoria }: ComparisonNoteProps) {
  const delta = ticketCategoria > 0 ? ((ticketMedio - ticketCategoria) / ticketCategoria) * 100 : 0;
  const acima = delta >= 0;
  const diferenca = Math.abs(ticketMedio - ticketCategoria);
  const Icon = acima ? IconTrendUp : IconTrendDown;

  return (
    <div className={`bench__result ${acima ? 'is-positive' : 'is-negative'}`}>
      <span className="bench__result-icon">
        <Icon />
      </span>
      <div>
        <p className="bench__result-title">
          {formatSignedPercent(delta)} em relação à média da categoria
        </p>
        <p className="bench__result-text">
          {acima
            ? `Seu ticket médio está ${formatCurrency(diferenca)} acima da média das lojas de ${categoria}.`
            : `Seu ticket médio está ${formatCurrency(diferenca)} abaixo da média das lojas de ${categoria}.`}
        </p>
      </div>
      <span
        className="bench__result-info"
        title="Média calculada com base nas lojas comparáveis da categoria, sem identificação individual."
      >
        <IconInfo />
      </span>
    </div>
  );
}
