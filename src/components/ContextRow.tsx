import type { Persona } from '@/types';
import { TABS, type TabId } from '@/store/app';

/**
 * §7 Every screen opens with a context row: "{FirstName}'s {tab}" as h1, plus
 * an objective pill reading "Optimising for · {objective}". The pill states
 * whose objective function is optimising this view (§8.1a).
 */
export function ContextRow({ persona, tab }: { persona: Persona; tab: TabId }) {
  const firstName = persona.name.split(' ')[0] ?? persona.name;
  const tabLabel = (TABS.find((t) => t[0] === tab)?.[1] ?? tab).toLowerCase();
  return (
    <div className="ctx">
      <h1>
        {firstName}'s {tabLabel}
      </h1>
      <span className="obj">
        <b>Optimising for</b> · {persona.objective}
      </span>
    </div>
  );
}
