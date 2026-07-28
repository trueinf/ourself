import type { Persona, Severity } from '@/types';
import { useApp } from '@/store/app';
import { ContextRow } from '@/components/ContextRow';
import { PageFootnote } from '@/components/PageFootnote';
import { KpiCard } from '@/components/KpiCard';
import { InsightCard } from '@/components/InsightCard';

/** Severity descending: pink → amber → teal → neutral (§7.1). */
const SEV_ORDER: Record<Severity, number> = { pink: 0, amber: 1, teal: 2, neutral: 3 };

/** §7.1 Insights — the dashboard. Five KPIs, then "What changed" insights. */
export function Insights({ persona }: { persona: Persona }) {
  const openDetail = useApp((s) => s.openDetail);
  const insights = [...persona.insights].sort((a, b) => SEV_ORDER[a.severity] - SEV_ORDER[b.severity]);

  return (
    <>
      <ContextRow persona={persona} tab="insights" />

      <div className="kpis">
        {persona.kpis.map((k, i) => (
          <KpiCard key={i} kpi={k} />
        ))}
      </div>

      <div className="sec">
        <div className="sec-h">
          <h2>What changed</h2>
          <span className="sub">{persona.insights.length} items · specialists reconciled, dissent preserved</span>
        </div>
        <div className="grid">
          {insights.map((insight) => (
            <InsightCard key={insight.id} insight={insight} onOpen={() => openDetail('insight', insight.id)} />
          ))}
        </div>
      </div>

      <PageFootnote />
    </>
  );
}
