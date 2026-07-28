import type { DiscussionItem } from '@/types';
import { useApp } from '@/store/app';
import { PERSONAS } from '@/data/personas';

/**
 * "Add to discussion" affordance, shared by the insight/focus/scenario/ask
 * surfaces. Queues the item into the persona's Discussions agenda (idempotent),
 * flipping to a "Queued" marker once used — like Pin.
 */
export function AddToDiscussion({ item }: { item: DiscussionItem }) {
  const personaIndex = useApp((s) => s.personaIndex);
  const discussions = useApp((s) => s.discussions);
  const queueDiscussion = useApp((s) => s.queueDiscussion);
  const personaId = PERSONAS[personaIndex]!.id;
  const queued = (discussions[personaId] ?? []).some((d) => d.id === item.id);

  if (queued) {
    return <span className="pill t">Queued for discussion</span>;
  }
  return (
    <button type="button" className="btn ghost" onClick={() => queueDiscussion(item)}>
      Add to discussion
    </button>
  );
}
