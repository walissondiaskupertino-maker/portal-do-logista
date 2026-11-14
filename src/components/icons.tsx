import type { LucideProps } from 'lucide-react';
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Check,
  CheckCircle2,
  Clock,
  Info,
  Lock,
  LogOut,
  Minus,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Store,
  Ticket,
  TrendingDown,
  TrendingUp,
  Users,
  X,
} from 'lucide-react';

/**
 * Camada de compatibilidade entre a UI e o `lucide-react`.
 *
 * Os componentes abaixo preservam os nomes `Icon*` já usados pelos cards e
 * mantêm o traço/atributos acessíveis padronizados. Assim, trocar o pacote de
 * ícones não exige alterar os componentes de tela.
 */
type IconProps = LucideProps;

const baseProps = {
  strokeWidth: 1.8,
  'aria-hidden': true,
  focusable: 'false',
} as const;

export function IconStore(props: IconProps) {
  return <Store {...baseProps} {...props} />;
}

export function IconRefresh(props: IconProps) {
  return <RefreshCw {...baseProps} {...props} />;
}

export function IconTrendUp(props: IconProps) {
  return <TrendingUp {...baseProps} {...props} />;
}

export function IconTrendDown(props: IconProps) {
  return <TrendingDown {...baseProps} {...props} />;
}

export function IconMinus(props: IconProps) {
  return <Minus {...baseProps} {...props} />;
}

export function IconLock(props: IconProps) {
  return <Lock {...baseProps} {...props} />;
}

export function IconClock(props: IconProps) {
  return <Clock {...baseProps} {...props} />;
}

export function IconUsers(props: IconProps) {
  return <Users {...baseProps} {...props} />;
}

export function IconBag(props: IconProps) {
  return <ShoppingBag {...baseProps} {...props} />;
}

export function IconTicket(props: IconProps) {
  return <Ticket {...baseProps} {...props} />;
}

export function IconSparkles(props: IconProps) {
  return <Sparkles {...baseProps} {...props} />;
}

export function IconAlert(props: IconProps) {
  return <AlertTriangle {...baseProps} {...props} />;
}

export function IconInfo(props: IconProps) {
  return <Info {...baseProps} {...props} />;
}

export function IconCheck(props: IconProps) {
  return <Check {...baseProps} {...props} />;
}

export function IconCheckCircle(props: IconProps) {
  return <CheckCircle2 {...baseProps} {...props} />;
}

export function IconClose(props: IconProps) {
  return <X {...baseProps} {...props} />;
}

export function IconArrowRight(props: IconProps) {
  return <ArrowRight {...baseProps} {...props} />;
}

export function IconChart(props: IconProps) {
  return <BarChart3 {...baseProps} {...props} />;
}

export function IconShield(props: IconProps) {
  return <ShieldCheck {...baseProps} {...props} />;
}

export function IconLogout(props: IconProps) {
  return <LogOut {...baseProps} {...props} />;
}

/**
 * Marca do Portal do Lojista. É um logotipo autoral (não um ícone de ação),
 * por isso permanece como SVG próprio e herda a cor via `currentColor`.
 */
export function IconLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M6.5 13.5 9 6.8A2 2 0 0 1 10.9 5.5h10.2A2 2 0 0 1 23 6.8l2.5 6.7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M7 13.5h18v11a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-11Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
      />
      <path d="M13 26.5v-6h6v6" fill="none" stroke="currentColor" strokeWidth="2.2" />
    </svg>
  );
}
