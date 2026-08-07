import type { Persona, Severity } from '@/types';
import { useApp } from '@/store/app';
import { rankByGoal, kpiText, insightText } from '@/lib/goals';
import { ContextRow } from '@/components/ContextRow';
import { PageFootnote } from '@/components/PageFootnote';
import { KpiCard } from '@/components/KpiCard';
import { InsightCard } from '@/components/InsightCard';

/** Severity descending: pink → amber → teal → neutral (§7.1). */
const SEV_ORDER: Record<Severity, number> = { pink: 0, amber: 1, teal: 2, neutral: 3 };

/**
 * §7.1 Insights — the dashboard. Five KPIs, then "What changed" insights.
 * When the persona has edited their goal, the same governed facts are
 * re-ranked by relevance to that goal (§8.1a) — no figure is invented.
 */
export function Insights({ persona }: { persona: Persona }) {
  const openDetail = useApp((s) => s.openDetail);
  const goals = useApp((s) => s.goals);

  const keywords = goals[persona.id]?.keywords ?? [];
  const goalActive = keywords.length > 0;

  const rankedKpis = rankByGoal(persona.kpis, keywords, kpiText);
  const bySeverity = [...persona.insights].sort((a, b) => SEV_ORDER[a.severity] - SEV_ORDER[b.severity]);
  const rankedInsights = rankByGoal(bySeverity, keywords, insightText);
  const alignedCount = goalActive
    ? rankedKpis.filter((r) => r.score > 0).length + rankedInsights.filter((r) => r.score > 0).length
    : 0;

  return (
    <>
      <ContextRow persona={persona} tab="insights" />

      {persona.synthesis ? (
        <div className="synth">
          <div className="synth-eyebrow">Bottom line</div>
          <p>{persona.synthesis}</p>
        </div>
      ) : null}

      {goalActive ? (
        <div className="goalnote">
          <b>Re-prioritised for your goal</b> · {alignedCount} facts moved up · same sourced data, re-ranked — no figure
          is invented.
        </div>
      ) : null}

      <div className="kpis">
        {rankedKpis.map(({ item, score }, i) => (
          <KpiCard key={i} kpi={item} aligned={goalActive && score > 0} />
        ))}
      </div>

      <div className="sec">
        <div className="sec-h">
          <h2>What changed</h2>
          <span className="sub">
            {goalActive
              ? `${persona.insights.length} items · re-ordered for your goal`
              : `${persona.insights.length} items · across the teams, disagreements kept`}
          </span>
        </div>
        <div className="grid">
          {rankedInsights.map(({ item, score }) => (
            <InsightCard
              key={item.id}
              insight={item}
              aligned={goalActive && score > 0}
              onOpen={() => openDetail('insight', item.id)}
            />
          ))}
        </div>
      </div>

      <PageFootnote />
    </>
  );
}
