import type { ReactNode } from 'react';
import type { LojaResumo } from '../types';
import {
  formatCurrency,
  formatNumber,
  formatPercent,
  formatSignedPercent,
} from '../lib/format';
import {
  IconBag,
  IconChart,
  IconMinus,
  IconTicket,
  IconTrendDown,
  IconTrendUp,
  IconUsers,
} from './icons';

function Delta({ value }: { value: number }) {
  const direction = value > 0 ? 'up' : value < 0 ? 'down' : 'flat';
  const Icon = direction === 'up' ? IconTrendUp : direction === 'down' ? IconTrendDown : IconMinus;

  return (
    <span className={`delta delta--${direction}`}>
      <Icon />
      {formatSignedPercent(value)}
    </span>
  );
}

interface KpiProps {
  icon: ReactNode;
  tone: 'brand' | 'green' | 'amber' | 'violet';
  label: string;
  value: string;
  foot: ReactNode;
}

function Kpi({ icon, tone, label, value, foot }: KpiProps) {
  return (
    <article className="kpi">
      <div className="kpi__top">
        <span className={`kpi__icon kpi__icon--${tone}`}>{icon}</span>
        <span className="kpi__label">{label}</span>
      </div>
      <strong className="kpi__value">{value}</strong>
      <div className="kpi__foot">{foot}</div>
    </article>
  );
}

export function KpiGrid({ resumo }: { resumo: LojaResumo }) {
  return (
    <div className="kpis">
      <Kpi
        icon={<IconTicket />}
        tone="brand"
        label="Ticket médio"
        value={formatCurrency(resumo.ticketMedio)}
        foot={
          <>
            <Delta value={resumo.variacaoTicketPercentual} />
            <span className="kpi__hint">vs. período anterior</span>
          </>
        }
      />
      <Kpi
        icon={<IconBag />}
        tone="green"
        label="Faturamento"
        value={formatCurrency(resumo.faturamento)}
        foot={<span className="kpi__hint">{formatNumber(resumo.vendas)} vendas no período</span>}
      />
      <Kpi
        icon={<IconUsers />}
        tone="violet"
        label="Visitantes"
        value={formatNumber(resumo.visitantes)}
        foot={<span className="kpi__hint">{resumo.periodo.label} · fluxo na sua loja</span>}
      />
      <Kpi
        icon={<IconChart />}
        tone="amber"
        label="Conversão"
        value={formatPercent(resumo.taxaConversao * 100)}
        foot={
          <span className="kpi__hint">
            {formatNumber(resumo.vendas)} vendas / {formatNumber(resumo.visitantes)} visitantes
          </span>
        }
      />
    </div>
  );
}
