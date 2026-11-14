import type { CSSProperties, ReactNode } from 'react';
import { IconAlert, IconInfo, IconRefresh } from './icons';

interface SkeletonProps {
  className?: string;
  style?: CSSProperties;
}

export function Skeleton({ className, style }: SkeletonProps) {
  return (
    <div
      className={['skeleton', className].filter(Boolean).join(' ')}
      style={style}
      aria-hidden="true"
    />
  );
}

export function KpiSkeleton() {
  return (
    <div className="kpis" aria-hidden="true">
      {[0, 1, 2, 3].map((index) => (
        <div className="kpi kpi--skeleton" key={index}>
          <Skeleton className="skeleton--line skeleton--w40" />
          <Skeleton className="skeleton--value" />
          <Skeleton className="skeleton--line skeleton--w60" />
        </div>
      ))}
    </div>
  );
}

const SKELETON_BAR_HEIGHTS = [38, 52, 68, 46, 58, 78, 92, 74, 60, 40, 54, 66];

export function ChartSkeleton({ bars = 10 }: { bars?: number }) {
  return (
    <div className="chart-skeleton" aria-hidden="true">
      <div className="chart-skeleton__plot">
        {Array.from({ length: bars }).map((_, index) => (
          <Skeleton
            key={index}
            className="chart-skeleton__bar"
            style={{ height: `${SKELETON_BAR_HEIGHTS[index % SKELETON_BAR_HEIGHTS.length]}%` }}
          />
        ))}
      </div>
      <Skeleton className="skeleton--line skeleton--w40" />
    </div>
  );
}

export function BenchmarkSkeleton() {
  return (
    <div className="bench-skeleton" aria-hidden="true">
      <div className="bench-skeleton__cols">
        <div>
          <Skeleton className="skeleton--line skeleton--w40" />
          <Skeleton className="skeleton--value" />
          <Skeleton className="skeleton--bar" />
        </div>
        <div>
          <Skeleton className="skeleton--line skeleton--w40" />
          <Skeleton className="skeleton--value" />
          <Skeleton className="skeleton--bar" />
        </div>
      </div>
      <Skeleton className="skeleton--line skeleton--w60" />
    </div>
  );
}

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="state state--empty" role="status">
      <span className="state__icon">{icon ?? <IconInfo />}</span>
      <p className="state__title">{title}</p>
      <p className="state__text">{description}</p>
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  description: string;
  onRetry?: () => void;
  compact?: boolean;
}

export function ErrorState({
  title = 'Não foi possível carregar os dados',
  description,
  onRetry,
  compact,
}: ErrorStateProps) {
  return (
    <div className={['state', 'state--error', compact ? 'state--compact' : ''].filter(Boolean).join(' ')} role="alert">
      <span className="state__icon state__icon--error">
        <IconAlert />
      </span>
      <p className="state__title">{title}</p>
      <p className="state__text">{description}</p>
      {onRetry && (
        <button type="button" className="btn btn--ghost btn--sm" onClick={onRetry}>
          <IconRefresh />
          Tentar novamente
        </button>
      )}
    </div>
  );
}
