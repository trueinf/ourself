import { useApp } from '@/store/app';
import { PERSONAS } from '@/data/personas';
import { ChevronUp } from '@/components/Icons';

/**
 * §5 Persona block, anchored in the darkest, most permanent part of the frame
 * — it states whose reality you are looking at, which is the product's
 * premise. The menu opens upward and is a real role="menu" (§12.4).
 */
export function PersonaSwitcher() {
  const personaIndex = useApp((s) => s.personaIndex);
  const open = useApp((s) => s.personaMenuOpen);
  const toggle = useApp((s) => s.togglePersonaMenu);
  const setPersona = useApp((s) => s.setPersona);
  const persona = PERSONAS[personaIndex]!;

  return (
    <div className={`psw${open ? ' open' : ''}`} id="psw">
      <button
        type="button"
        className="psw-btn"
        id="pswBtn"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={toggle}
      >
        <span className="av" title={persona.name}>
          {persona.initials}
        </span>
        <span style={{ minWidth: 0 }}>
          <span className="psw-name">{persona.name}</span>
          <span className="psw-role">{persona.role}</span>
        </span>
        <ChevronUp />
      </button>
      <div className="psw-menu" role="menu" aria-label="Viewing as">
        <div className="psw-h">Viewing as</div>
        {PERSONAS.map((p, i) => (
          <button
            key={p.id}
            type="button"
            className="psw-i"
            role="menuitem"
            aria-current={i === personaIndex}
            onClick={() => setPersona(i)}
          >
            <span className="av" title={p.name}>
              {p.initials}
            </span>
            <span>
              <b>{p.name}</b>
              <span>{p.title}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
