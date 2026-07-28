import { useState } from 'react';
import type { Persona } from '@/types';
import { useApp } from '@/store/app';
import { tokenizeGoal } from '@/lib/goals';

/**
 * Inline goal editor next to the objective pill. Applying a preset or custom
 * goal re-ranks the office's KPIs and insights by relevance (§8.1a). It is a
 * control, not content — an inline panel, never a modal (§2.4). Numbers never
 * change: the goal only re-prioritises which facts lead.
 */
export function GoalEditor({ persona }: { persona: Persona }) {
  const goals = useApp((s) => s.goals);
  const applyGoal = useApp((s) => s.applyGoal);
  const resetGoal = useApp((s) => s.resetGoal);
  const closeGoalEditor = useApp((s) => s.closeGoalEditor);

  const override = goals[persona.id];
  const current = override?.objective ?? persona.objective;
  const [text, setText] = useState(current);
  const trimmed = text.trim();

  return (
    <div className="goaled">
      <div className="eyebrow">Edit goal · re-ranks the same governed facts</div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') closeGoalEditor();
        }}
        rows={2}
        placeholder="Describe what this office is optimising for…"
        aria-label="Objective function"
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
      />
      {persona.goalPresets.length ? (
        <div className="goaled-presets">
          {persona.goalPresets.map((preset) => (
            <button
              key={preset.label}
              type="button"
              className="goalchip"
              title={preset.objective}
              onClick={() => applyGoal(preset.objective, preset.keywords)}
            >
              {preset.label}
            </button>
          ))}
        </div>
      ) : null}
      <div className="goaled-note">
        Numbers never change — the goal only re-prioritises which sourced facts lead.
      </div>
      <div className="btnrow">
        <button type="button" className="btn" onClick={() => applyGoal(text, tokenizeGoal(text))} disabled={!trimmed}>
          Apply goal
        </button>
        {override ? (
          <button type="button" className="btn ghost" onClick={resetGoal}>
            Reset to default
          </button>
        ) : null}
        <button type="button" className="btn ghost" onClick={closeGoalEditor}>
          Cancel
        </button>
      </div>
    </div>
  );
}
