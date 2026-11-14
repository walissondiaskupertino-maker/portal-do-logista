import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { Resource } from '../hooks/useResource';
import { formatCompact, formatNumber, hourLabel, hourRangeLabel } from '../lib/format';
import type { HorarioFluxo, HorariosPicoResposta } from '../types';
import { Card } from './Card';
import { IconClock, IconInfo, IconUsers } from './icons';
import { ChartSkeleton, EmptyState, ErrorState } from './States';

const BAR_MUTED = '#dfe2fb';
const GRID = '#edeff6';
const AXIS = '#717789';

interface PeakHoursCardProps {
  horarios: Resource<HorariosPicoResposta>;
}

export function PeakHoursCard({ horarios }: PeakHoursCardProps) {
  const data = horarios.data;
  const pico = data?.pico ?? null;
  const temDados = Boolean(data && data.horarios.length > 0);

  const maiorFluxo = data?.horarios.reduce((max, item) => Math.max(max, item.fluxo), 0) ?? 0;
  const picoInicio = pico?.inicio ?? data?.horarios.find((item) => item.fluxo === maiorFluxo)?.hora;

  return (
    <Card
      title="Horários de pico"
      subtitle="Quando os clientes visitam a sua loja ao longo do dia"
      badge={
        pico ? (
          <span className="pill pill--peak">
            <IconClock />
            Pico {hourRangeLabel(pico.inicio, pico.fim)}
          </span>
        ) : null
      }
      className="card--chart"
      testId="peak-hours-card"
    >
      {horarios.loading && !data && <ChartSkeleton bars={13} />}

      {!horarios.loading && horarios.error && (
        <ErrorState
          compact
          title="Horários indisponíveis"
          description={horarios.error}
          onRetry={horarios.reload}
        />
      )}

      {!horarios.loading && !horarios.error && !temDados && (
        <EmptyState
          icon={<IconUsers />}
          title="Sem fluxo registrado"
          description="Não há visitas registradas na sua loja neste período. Assim que houver movimento, o gráfico aparece aqui."
        />
      )}

      {temDados && data && (
        <>
          <div className="peak-summary">
            <div className="peak-summary__item">
              <span className="peak-summary__label">Pico de fluxo</span>
              <strong className="peak-summary__value">
                {pico ? hourRangeLabel(pico.inicio, pico.fim) : '—'}
              </strong>
            </div>
            <div className="peak-summary__item">
              <span className="peak-summary__label">Visitantes no pico</span>
              <strong className="peak-summary__value">
                {pico ? formatNumber(pico.fluxo) : formatNumber(maiorFluxo)}
              </strong>
            </div>
            <div className="peak-summary__item">
              <span className="peak-summary__label">Total no período</span>
              <strong className="peak-summary__value">{formatNumber(data.totalVisitantes)}</strong>
            </div>
          </div>

          <div
            className="chart"
            style={{ height: 280 }}
            role="img"
            aria-label={`Gráfico de visitantes por hora. Pico em ${
              pico ? hourRangeLabel(pico.inicio, pico.fim) : '—'
            }.`}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.horarios}
                margin={{ top: 12, right: 8, left: -14, bottom: 0 }}
                barCategoryGap="26%"
              >
                <defs>
                  <linearGradient id="peak-bar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6d64f5" />
                    <stop offset="100%" stopColor="#4f46e5" />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke={GRID} strokeDasharray="4 6" />
                <XAxis
                  dataKey="hora"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  interval={0}
                  tick={{ fill: AXIS, fontSize: 11 }}
                  tickFormatter={(value: number) => hourLabel(value)}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  width={46}
                  tick={{ fill: AXIS, fontSize: 11 }}
                  tickFormatter={(value: number) => formatCompact(value)}
                />
                <Tooltip
                  cursor={{ fill: '#f5f6fc', radius: 8 }}
                  content={<PeakTooltip />}
                  wrapperStyle={{ outline: 'none' }}
                />
                <Bar dataKey="fluxo" name="Visitantes" maxBarSize={38} radius={[8, 8, 4, 4]}>
                  {data.horarios.map((item) => (
                    <Cell
                      key={item.hora}
                      fill={item.hora === picoInicio ? 'url(#peak-bar)' : BAR_MUTED}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-foot">
            <span className="legend">
              <span className="legend__dot legend__dot--brand" />
              Visitantes
              <span className="legend__dot legend__dot--muted" />
              Demais horários
            </span>
            <span className="chart-foot__hint">
              <IconInfo />
              A hora de pico é destacada automaticamente.
            </span>
          </div>
        </>
      )}
    </Card>
  );
}

interface PeakTooltipProps {
  active?: boolean;
  payload?: Array<{ payload?: HorarioFluxo }>;
}

function PeakTooltip({ active, payload }: PeakTooltipProps) {
  const item = payload?.[0]?.payload;
  if (!active || !item) return null;

  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip__title">{hourRangeLabel(item.hora, item.hora + 1)}</p>
      <div className="chart-tooltip__row">
        <span className="legend__dot legend__dot--brand" />
        <span>Visitantes</span>
        <strong>{formatNumber(item.fluxo)}</strong>
      </div>
      <div className="chart-tooltip__row">
        <span className="legend__dot legend__dot--muted" />
        <span>Vendas</span>
        <strong>{formatNumber(item.vendas)}</strong>
      </div>
    </div>
  );
}
