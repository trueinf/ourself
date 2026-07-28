import type { ClosedDecision } from '@/types';

/**
 * §6 DecisionRow — closed-decision record. Outcome badge (Worked teal /
 * Mixed amber / Backfired pink) + title + outcome sentence + timestamp.
 * The track record is required (§7.2); at least one entry per persona is
 * marked Backfired.
 */
const RESULT_CLASS: Record<ClosedDecision['result'], string> = {
  worked: 'ok',
  mixed: 'mixed',
  backfired: 'bad',
};
const RESULT_LABEL: Record<ClosedDecision['result'], string> = {
  worked: 'Worked',
  mixed: 'Mixed',
  backfired: 'Backfired',
};

export function DecisionRow({ decision }: { decision: ClosedDecision }) {
  return (
    <div className="card" style={{ padding: '13px 16px' }}>
      <div className="dec">
        <span className={`res ${RESULT_CLASS[decision.result]}`}>{RESULT_LABEL[decision.result]}</span>
        <div>
          <h3>{decision.title}</h3>
          <p>{decision.outcome}</p>
        </div>
        <span className="when">{decision.when}</span>
      </div>
    </div>
  );
}
