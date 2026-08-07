import type { CrossOfficeView, Stance } from '@/types';

/**
 * §6 CrossOfficeStrip — THE signature component. Shows how other offices read
 * the same fact, with each position preserved rather than averaged into a
 * house view (§2.3). Each card carries a stance-coloured left edge and its
 * office monogram; the reader's own seat ("Your position") is rendered
 * distinctly, in a neutral, authoritative treatment.
 */
const STANCE_CLASS: Record<Stance, string> = {
  agrees: 'ok',
  disagrees: 'no',
  partly: 'hm',
};

const OFFICE_MONO: Record<string, string> = {
  Finance: 'FIN',
  Marketing: 'MKT',
  Commercial: 'COM',
  Operations: 'OPS',
  Regulatory: 'REG',
  Technology: 'TEC',
  Brand: 'BRD',
  People: 'PPL',
  Supply: 'SUP',
};

const monogramFor = (office: string): string => {
  const first = office.split(' ')[0] ?? office;
  return OFFICE_MONO[first] ?? first.slice(0, 3).toUpperCase();
};

/** The dressed position cards, shared by the inline strip and the detail page. */
export function CrossOfficeCards({ views }: { views: CrossOfficeView[] }) {
  return (
    <div className="xo-row">
      {views.map((v, i) => {
        const isSelf = v.label.toLowerCase() === 'your position';
        const cls = isSelf ? 'you' : STANCE_CLASS[v.stance];
        return (
          <div className={`xo-c ${cls}`} key={`${v.office}-${i}`}>
            <div className="xo-c-head">
              <span className="xo-mono">{monogramFor(v.office)}</span>
              <b>{v.office}</b>
            </div>
            <div className={`st ${cls}`}>{v.label}</div>
            <p>{v.position}</p>
          </div>
        );
      })}
    </div>
  );
}

export function CrossOfficeStrip({ views }: { views: CrossOfficeView[] }) {
  if (!views.length) return null;
  return (
    <div className="xo">
      <div className="xo-h">How the other teams see this</div>
      <CrossOfficeCards views={views} />
    </div>
  );
}
