import { Link } from "react-router-dom";

export type Crumb = { label: string; to?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  if (!items.length) return null;
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      {items.map((c, i) => {
        const last = i === items.length - 1;
        return (
          <span key={`${c.label}-${i}`} className="crumb">
            {i > 0 && <span className="crumb-sep" aria-hidden>/</span>}
            {c.to && !last ? (
              <Link to={c.to}>{c.label}</Link>
            ) : (
              <span aria-current={last ? "page" : undefined}>{c.label}</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
