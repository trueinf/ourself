import type { Persona, DiscussionItem } from '@/types';
import { useApp } from '@/store/app';
import { ContextRow } from '@/components/ContextRow';
import { PageFootnote } from '@/components/PageFootnote';
import { DiscussionCard } from '@/components/DiscussionCard';

/**
 * §7 (new) Discussions — the one place work from every surface (a finding, a
 * decision, a what-if, a question) comes together to be discussed and
 * actioned, with whom and when. Per-persona agenda, grouped by timing. Nothing
 * acts (§2.8): scheduling is proposed, and Outlook integration is the next step.
 */
const GROUPS: Array<{ key: DiscussionItem['whenUrgency']; title: string; sub: string }> = [
  { key: 'now', title: 'This week', sub: 'Needs a room now' },
  { key: 'soon', title: 'Coming up', sub: 'On the calendar horizon' },
  { key: 'ok', title: 'Backlog', sub: 'Queued — no date yet' },
];

export function Discussions({ persona }: { persona: Persona }) {
  const discussions = useApp((s) => s.discussions);
  const removeDiscussion = useApp((s) => s.removeDiscussion);
  const openDetail = useApp((s) => s.openDetail);

  const list = discussions[persona.id] ?? [];
  const scheduled = list.filter((d) => d.status === 'scheduled').length;
  const thisWeek = list.filter((d) => d.whenUrgency === 'now').length;

  return (
    <>
      <ContextRow persona={persona} tab="discussions" />

      {list.length ? (
        <div className="synth">
          <div className="synth-eyebrow">The agenda</div>
          <p>
            {list.length} on the agenda — {scheduled} scheduled, {thisWeek} to land this week. The cross-office trades
            you can’t settle alone come here, with whom and when.
          </p>
        </div>
      ) : null}

      {list.length ? (
        GROUPS.map((group) => {
          const items = list.filter((d) => d.whenUrgency === group.key);
          if (!items.length) return null;
          return (
            <div className="sec" key={group.key}>
              <div className="sec-h">
                <h2>{group.title}</h2>
                <span className="sub">{group.sub}</span>
              </div>
              <div className="fq">
                {items.map((item) => (
                  <DiscussionCard
                    key={item.id}
                    item={item}
                    onOpenSource={item.source ? () => openDetail(item.source!.kind, item.source!.id) : undefined}
                    onRemove={() => removeDiscussion(item.id)}
                  />
                ))}
              </div>
            </div>
          );
        })
      ) : (
        <div className="card" style={{ padding: 30, textAlign: 'center' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 650 }}>Nothing queued to discuss</h3>
          <p style={{ fontSize: '13px', color: 'var(--muted)', marginTop: 6 }}>
            Add an item from a finding, a decision, or a what-if, and it lands here — with whom and when.
          </p>
        </div>
      )}

      <PageFootnote />
    </>
  );
}
