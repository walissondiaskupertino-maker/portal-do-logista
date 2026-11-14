import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { Resource } from '../hooks/useResource';
import { formatNumber, formatPercent } from '../lib/format';
import type { AfinidadeCategoria, CrossShoppingResposta } from '../types';
import { Card } from './Card';
import { IconInfo, IconSparkles, IconUsers } from './icons';
import { ChartSkeleton, EmptyState, ErrorState } from './States';

const GRID = '#edeff6';
const MAX_PAIRS = 6;

interface CrossShoppingCardProps {
  crossSelling: Resource<CrossShoppingResposta>;
}

export function CrossShoppingCard({ crossSelling }: CrossShoppingCardProps) {
  const data = crossSelling.data;
  const pares = [...(data?.pares ?? [])]
    .filter((par) => Number.isFinite(par.afinidadePercentual))
    .sort((a, b) => b.afinidadePercentual - a.afinidadePercentual)
    .slice(0, MAX_PAIRS);

  const restantes = (data?.pares.length ?? 0) - pares.length;
  const temDados = pares.length > 0;
  const chartHeight = Math.max(200, pares.length * 46 + 24);

  return (
    <Card
      title="Cross-shopping"
      subtitle="Categorias com maior afinidade com os clientes da sua loja"
      badge={
        temDados ? (
          <span className="pill pill--affinity">
            <IconSparkles />
            Afinidade
          </span>
        ) : null
      }
      className="card--chart"
      testId="cross-shopping-card"
    >
      {crossSelling.loading && !data && <ChartSkeleton bars={6} />}

      {!crossSelling.loading && crossSelling.error && (
        <ErrorState
          compact
          title="Cross-shopping indisponível"
          description={crossSelling.error}
          onRetry={crossSelling.reload}
        />
      )}

      {!crossSelling.loading && !crossSelling.error && !temDados && (
        <EmptyState
          icon={<IconUsers />}
          title="Sem afinidade calculada"
          description="Ainda não há clientes em comum suficientes com outras categorias neste período. Tente ampliar a janela de análise."
        />
      )}

      {temDados && data && (
        <>
          <div
            className="chart chart--horizontal"
            style={{ height: chartHeight }}
            role="img"
            aria-label={`Gráfico de afinidade por categoria. Principal categoria: ${pares[0]?.categoria} com ${formatPercent(pares[0]?.afinidadePercentual)}.`}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={pares}
                layout="vertical"
                margin={{ top: 0, right: 56, left: 0, bottom: 0 }}
                barCategoryGap="30%"
              >
                <defs>
                  <linearGradient id="affinity-top" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#6d64f5" />
                    <stop offset="100%" stopColor="#4f46e5" />
                  </linearGradient>
                  <linearGradient id="affinity-bar" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#c7cbfa" />
                    <stop offset="100%" stopColor="#a9aef6" />
                  </linearGradient>
                </defs>
                <CartesianGrid horizontal={false} stroke={GRID} strokeDasharray="4 6" />
                <XAxis type="number" hide domain={[0, 100]} />
                <YAxis
                  type="category"
                  dataKey="categoria"
                  width={128}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#4b5163', fontSize: 12 }}
                  tickFormatter={(value: string) =>
                    value.length > 22 ? `${value.slice(0, 21)}…` : value
                  }
                  tickMargin={6}
                />
                <Tooltip
                  cursor={{ fill: '#f5f6fc' }}
                  content={<AffinityTooltip />}
                  wrapperStyle={{ outline: 'none' }}
                />
                <Bar
                  dataKey="afinidadePercentual"
                  name="Afinidade"
                  barSize={18}
                  radius={[6, 6, 6, 6]}
                  background={{ fill: '#f2f4fb' }}
                >
                  {pares.map((par, index) => (
                    <Cell
                      key={par.categoria}
                      fill={index === 0 ? 'url(#affinity-top)' : 'url(#affinity-bar)'}
                    />
                  ))}
                  <LabelList
                    dataKey="afinidadePercentual"
                    position="right"
                    offset={8}
                    fill="#4b5163"
                    fontSize={12}
                    fontWeight={600}
                    formatter={(value: unknown) => formatPercent(Number(value))}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-foot">
            <span className="chart-foot__hint">
              <IconInfo />
              % dos seus clientes que também compram na categoria
            </span>
            {restantes > 0 && (
              <span className="chart-foot__more">+{restantes} categorias no relatório completo</span>
            )}
          </div>

          <p className="cross-base">
            Base: <strong>{formatNumber(data.totalClientesAnalisados)} clientes</strong> analisados
            nos últimos {data.janelaDias} dias.
          </p>
        </>
      )}
    </Card>
  );
}

interface AffinityTooltipProps {
  active?: boolean;
  payload?: Array<{ payload?: AfinidadeCategoria }>;
}

function AffinityTooltip({ active, payload }: AffinityTooltipProps) {
  const item = payload?.[0]?.payload;
  if (!active || !item) return null;

  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip__title">{item.categoria}</p>
      <div className="chart-tooltip__row">
        <span className="legend__dot legend__dot--brand" />
        <span>Afinidade</span>
        <strong>{formatPercent(item.afinidadePercentual)}</strong>
      </div>
      <div className="chart-tooltip__row">
        <span className="legend__dot legend__dot--muted" />
        <span>Co-ocorrências</span>
        <strong>{formatNumber(item.coOcorrencias)}</strong>
      </div>
    </div>
  );
}
