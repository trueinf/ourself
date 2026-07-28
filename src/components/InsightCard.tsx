import type { Insight, Severity } from '@/types';
import { AGENTS } from '@/data/agents';
import { Pill } from './Pill';
import { SourceChip } from './SourceChip';
import { CrossOfficeStrip } from './CrossOfficeStrip';
import { ChevronRight } from './Icons';

/**
 * §6 InsightCard — 3-column grid: severity dot / body / chevron. The whole
 * card is a link to the full detail page (§2.4, never a drawer). Body carries
 * the cross-office strip inline (§7.1).
 */
const DOT_CLASS: Record<Severity, string> = {
  pink: 'p',
  amber: 'a',
  teal: 't',
  neutral: 'n',
};

export function InsightCard({ insight, onOpen }: { insight: Insight; onOpen: () => void }) {
  return (
    <button type="button" className="card tap" onClick={onOpen}>
      <div className="ins">
        <span className={`dot ${DOT_CLASS[insight.severity]}`} />
        <div>
          <h3>{insight.headline}</h3>
          <div className="why">{insight.why}</div>
          <div className="meta">
            {insight.pills.map((p, i) => (
              <Pill key={`p${i}`} variant={p.variant}>
                {p.text}
              </Pill>
            ))}
            {insight.agents.map((a) => (
              <Pill key={a}>{AGENTS[a].label}</Pill>
            ))}
          </div>
          <div className="srcs" style={{ marginTop: 9 }}>
            {insight.sources.map((s) => (
              <SourceChip key={s} source={s} />
            ))}
          </div>
          <CrossOfficeStrip views={insight.crossOffice} />
        </div>
        <ChevronRight />
      </div>
    </button>
  );
}
