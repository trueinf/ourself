import { useApp } from '@/store/app';
import { PERSONAS } from '@/data/personas';

/**
 * §5 (≤820px) — a slim mobile top bar appears with the wordmark and the
 * persona avatar. The avatar toggles the same persona menu that lives in the
 * bottom tab bar. Visible only at ≤820px (see .mtop in app.css).
 */
export function MobileTopBar() {
  const personaIndex = useApp((s) => s.personaIndex);
  const toggle = useApp((s) => s.togglePersonaMenu);
  const persona = PERSONAS[personaIndex]!;

  return (
    <header className="mtop">
      <span className="wm">
        ours<i>e.l.f.</i>
      </span>
      <button type="button" className="mav" id="mavBtn" onClick={toggle} aria-label="Switch persona">
        <span className="av" title={persona.name}>
          {persona.initials}
        </span>
      </button>
    </header>
  );
}
