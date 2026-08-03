import { useEffect } from 'react';
import { useApp } from '@/store/app';
import { PERSONAS } from '@/data/personas';
import { Rail } from '@/shell/Rail';
import { Login } from '@/shell/Login';
import { MobileTopBar } from '@/shell/MobileTopBar';
import { Insights } from '@/surfaces/Insights';
import { Focus } from '@/surfaces/Focus';
import { Discussions } from '@/surfaces/Discussions';
import { Ask } from '@/surfaces/Ask';
import { Scenarios } from '@/surfaces/Scenarios';
import { PinBoard } from '@/surfaces/PinBoard';
import { InsightDetail } from '@/surfaces/detail/InsightDetail';
import { FocusDetail } from '@/surfaces/detail/FocusDetail';

/**
 * Shell + surface router. Routing is three fields of state (persona, tab,
 * detail) — no react-router (§3, §11). Detail views are full pages, never
 * drawers (§2.4).
 */
export default function App() {
  const authed = useApp((s) => s.authed);
  const personaIndex = useApp((s) => s.personaIndex);
  const tab = useApp((s) => s.tab);
  const detail = useApp((s) => s.detail);
  const navSeq = useApp((s) => s.navSeq);
  const menuOpen = useApp((s) => s.personaMenuOpen);
  const closePersonaMenu = useApp((s) => s.closePersonaMenu);

  // §11: any navigation scrolls to top instantly (not smoothly).
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [navSeq]);

  // Test-only hook for harnesses B/C — attached only under automation
  // (navigator.webdriver), so it never ships in a normal session.
  useEffect(() => {
    if (typeof navigator !== 'undefined' && (navigator as Navigator & { webdriver?: boolean }).webdriver) {
      (window as unknown as { __setView?: unknown }).__setView = (
        pIndex: number,
        t: string,
        d: unknown = null,
      ) =>
        useApp.setState({
          authed: true, // the demo sign-in gate is not what these harnesses test
          personaIndex: pIndex,
          tab: t as never,
          detail: d as never,
          askedQuestion: null,
          personaMenuOpen: false,
        });
    }
  }, []);

  // §11 / §12: Escape closes the persona menu; clicking outside closes it.
  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && !t.closest('#psw') && !t.closest('#mavBtn')) closePersonaMenu();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePersonaMenu();
    };
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen, closePersonaMenu]);

  // Demo sign-in gate — the shell does not mount until credentials match.
  if (!authed) return <Login />;

  return (
    <div className="app">
      <Rail />
      <div className="content">
        <MobileTopBar />
        <main className="wrap" id="main">
          <Surface personaIndex={personaIndex} tab={tab} detail={detail} />
        </main>
      </div>
    </div>
  );
}

function Surface({
  personaIndex,
  tab,
  detail,
}: {
  personaIndex: number;
  tab: ReturnType<typeof useApp.getState>['tab'];
  detail: ReturnType<typeof useApp.getState>['detail'];
}) {
  const persona = PERSONAS[personaIndex]!;

  if (detail) {
    if (detail.kind === 'insight') {
      const insight = persona.insights.find((i) => i.id === detail.id);
      if (insight) return <InsightDetail persona={persona} insight={insight} />;
    } else {
      const item = persona.focus.find((f) => f.id === detail.id);
      if (item) return <FocusDetail persona={persona} item={item} />;
    }
  }

  switch (tab) {
    case 'insights':
      return <Insights persona={persona} />;
    case 'focus':
      return <Focus persona={persona} />;
    case 'discussions':
      return <Discussions persona={persona} />;
    case 'ask':
      return <Ask persona={persona} />;
    case 'scenarios':
      return <Scenarios persona={persona} />;
    case 'pinboard':
      return <PinBoard persona={persona} />;
    default:
      return <Insights persona={persona} />;
  }
}
