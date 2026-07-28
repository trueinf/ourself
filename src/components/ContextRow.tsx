import { useState } from 'react';
import type { Persona } from '@/types';
import { useApp, TABS, type TabId } from '@/store/app';
import { EditIcon } from './Icons';
import { GoalEditor } from './GoalEditor';

/**
 * §7 Every screen opens with a context row: a formal "{Tab} · {Name}, {Role}"
 * title that restates whose reality you are looking at (§5), plus an objective
 * pill reading "Optimising for · {objective}" (§8.1a). "Edit goal" lets the
 * persona rewrite that objective; the Insights data re-ranks to match. On
 * Insights an "as of" freshness signal reinforces that the surface is live.
 */
function nowLabel(): string {
  const d = new Date();
  let h = d.getHours();
  const m = d.getMinutes();
  const meridiem = h < 12 ? 'am' : 'pm';
  h = h % 12 || 12;
  return `${h}:${String(m).padStart(2, '0')}${meridiem}`;
}

export function ContextRow({ persona, tab }: { persona: Persona; tab: TabId }) {
  const goals = useApp((s) => s.goals);
  const editorOpen = useApp((s) => s.goalEditorOpen);
  const toggleGoalEditor = useApp((s) => s.toggleGoalEditor);
  const [asOf] = useState(nowLabel);

  const override = goals[persona.id];
  const objective = override?.objective ?? persona.objective;
  const tabLabel = TABS.find((t) => t[0] === tab)?.[1] ?? tab;

  return (
    <>
      <div className="ctx">
        <h1>
          {tabLabel}
          <span className="ctx-who">
            {' '}
            · {persona.name}, {persona.role}
          </span>
        </h1>
        <span className="obj">
          <b>Optimising for</b> · {objective}
          {override ? <span className="obj-edited" title="Custom goal — data re-ranked" /> : null}
        </span>
        <button type="button" className="editgoal" aria-expanded={editorOpen} onClick={toggleGoalEditor}>
          <EditIcon /> Edit goal
        </button>
        {tab === 'insights' ? (
          <span className="asof" title="Illustrative freshness — demo data">
            <span className="asof-dot" />
            Live · as of {asOf}
          </span>
        ) : null}
      </div>
      {editorOpen ? <GoalEditor persona={persona} /> : null}
    </>
  );
}
