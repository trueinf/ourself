import type { CrossOfficeView, Stance } from '@/types';

/**
 * §6 CrossOfficeStrip — THE signature component. Shows how other offices read
 * the same fact, with each position preserved rather than averaged into a
 * house view (§2.3). The persona's own reading is labelled "Your position".
 * These positions are authored independently (§8.1a), never produced by
 * deliberation.
 */
const STANCE_CLASS: Record<Stance, string> = {
  agrees: 'ok',
  disagrees: 'no',
  partly: 'hm',
};

export function CrossOfficeStrip({ views }: { views: CrossOfficeView[] }) {
  if (!views.length) return null;
  return (
    <div className="xo">
      <div className="xo-h">How other offices read this</div>
      <div className="xo-row">
        {views.map((v, i) => (
          <div className="xo-c" key={`${v.office}-${i}`}>
            <b>{v.office}</b>
            <div className={`st ${STANCE_CLASS[v.stance]}`}>{v.label}</div>
            <p>{v.position}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
