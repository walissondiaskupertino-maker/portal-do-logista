import type { ReactNode } from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  badge?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  id?: string;
  testId?: string;
}

export function Card({
  title,
  subtitle,
  badge,
  action,
  children,
  className,
  bodyClassName,
  id,
  testId,
}: CardProps) {
  return (
    <section className={['card', className].filter(Boolean).join(' ')} id={id} data-testid={testId}>
      {(title || badge || action) && (
        <header className="card__head">
          <div className="card__heading">
            <div className="card__title-row">
              {title && <h2 className="card__title">{title}</h2>}
              {badge}
            </div>
            {subtitle && <p className="card__subtitle">{subtitle}</p>}
          </div>
          {action && <div className="card__action">{action}</div>}
        </header>
      )}
      <div className={['card__body', bodyClassName].filter(Boolean).join(' ')}>{children}</div>
    </section>
  );
}
