import type { ReactNode } from 'react';

/**
 * §6 SideCard — detail-page sidebar. Eyebrow heading, then key/value rows
 * with --line-2 dividers, right-aligned bold values. Sticky at top:22px above
 * 1180px (see .side in app.css); unsticks and stacks below at ≤1180px.
 */
export function SideCard({ title, rows }: { title: string; rows: Array<[label: string, value: ReactNode]> }) {
  return (
    <aside className="side">
      <div className="card">
        <h4>{title}</h4>
        {rows.map(([label, value], i) => (
          <div className="kv" key={i}>
            <span>{label}</span>
            <span>{value}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}
