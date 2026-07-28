import type { ReactNode } from 'react';

/**
 * §6 DissentPanel — amber-soft fill, "Preserved dissent — X against Y", then
 * the explanation. Dissent is preserved, never averaged into a house view,
 * and never produced by deliberation (§2.3).
 */
export function DissentPanel({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <div className="dissent">
      <h4>{heading}</h4>
      <p>{children}</p>
    </div>
  );
}
