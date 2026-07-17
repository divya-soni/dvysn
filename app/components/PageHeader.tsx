import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
  aside,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  aside?: ReactNode;
}) {
  return (
    <header className="page-header">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="page-title display">{title}</h1>
        {description && <p className="page-intro">{description}</p>}
      </div>
      {aside && <div className="page-header__aside">{aside}</div>}
    </header>
  );
}

export function SectionHeader({
  number,
  title,
  action,
  id,
}: {
  number: string;
  title: string;
  action?: ReactNode;
  id?: string;
}) {
  return (
    <div className="section-header">
      <div className="section-header__label">
        <span>{number}</span>
        <h2 id={id}>{title}</h2>
      </div>
      {action}
    </div>
  );
}
