import type { ReactNode } from 'react';

/**
 * §6 AgentRow — 26px rounded monogram tile (--mist-2, --ink-2) + name and
 * finding. Used in Ask answers, insight detail "what the specialists found",
 * and scenario judgement panels (where the heading is the office + lens).
 */
export function AgentRow({
  monogram,
  heading,
  children,
}: {
  monogram: string;
  heading: string;
  children: ReactNode;
}) {
  return (
    <div className="agent">
      <span className="ic">{monogram}</span>
      <div>
        <h4>{heading}</h4>
        <p>{children}</p>
      </div>
    </div>
  );
}
