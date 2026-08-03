import { useApp, TABS, type TabId } from '@/store/app';
import { PERSONAS } from '@/data/personas';
import { NavIcon, SearchIcon } from '@/components/Icons';
import { PersonaSwitcher } from './PersonaSwitcher';

/**
 * §5 Rail — brand, search, five nav items, spacer, rail note, persona block.
 * All three responsive states (full 236px → 76px icon-only → 60px bottom tab
 * bar) are handled in app.css; this component renders the same markup at
 * every width. Count badges: Focus = high-severity items; PinBoard = pins.
 */
export function Rail() {
  const tab = useApp((s) => s.tab);
  const personaIndex = useApp((s) => s.personaIndex);
  const setTab = useApp((s) => s.setTab);
  const pins = useApp((s) => s.pins);
  const discussions = useApp((s) => s.discussions);
  const signOut = useApp((s) => s.signOut);
  const persona = PERSONAS[personaIndex]!;

  const counts: Partial<Record<TabId, number>> = {
    focus: persona.focus.filter((f) => f.severity === 'high').length,
    discussions: (discussions[persona.id] ?? []).length,
    pinboard: (pins[persona.id] ?? []).length,
  };

  return (
    <aside className="rail">
      <div className="brand">
        <span className="wm">
          ours<i>e.l.f.</i>
        </span>
      </div>

      <button type="button" className="rsearch" aria-label="Search (demo)">
        <SearchIcon />
        <span>Search</span>
        <kbd>/</kbd>
      </button>

      <nav className="nav" aria-label="Workspace">
        <div className="nav-h">Workspace</div>
        {TABS.map(([key, label]) => {
          const count = counts[key];
          return (
            <button
              key={key}
              type="button"
              className="nv"
              aria-current={tab === key}
              onClick={() => setTab(key)}
            >
              <NavIcon tab={key} />
              <span>{label}</span>
              {count ? (
                <span className={`cnt${key === 'pinboard' || key === 'discussions' ? ' q' : ''}`}>{count}</span>
              ) : null}
            </button>
          );
        })}
      </nav>

      <div className="rail-sp" />
      <div className="rail-note">
        Demo data · FY2027 Q1
        <br />
        Built on verified FY2026 actuals
        <button type="button" className="rail-out" onClick={signOut}>
          Sign out
        </button>
      </div>

      <PersonaSwitcher />
    </aside>
  );
}
