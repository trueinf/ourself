import type { TabId } from '@/store/app';

interface IconProps {
  size?: number;
  className?: string;
}

/** Nav glyphs, keyed to the five workspace tabs (§5). */
const NAV_PATHS: Record<TabId, string> = {
  insights: '<path d="M3 3v18h18"/><path d="m7 14 3.5-4 3 3L20 6"/>',
  focus:
    '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.5 5.5 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.5-6.5A2 2 0 0 0 16.8 4H7.2a2 2 0 0 0-1.7 1.5Z"/>',
  ask: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  scenarios: '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
  pinboard:
    '<path d="M12 17v5"/><path d="M9 10.76V4h6v6.76a2 2 0 0 0 .55 1.38l1.9 2A1 1 0 0 1 16.72 15H7.28a1 1 0 0 1-.73-1.86l1.9-2A2 2 0 0 0 9 10.76Z"/>',
};

export function NavIcon({ tab, size = 16 }: { tab: TabId; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      dangerouslySetInnerHTML={{ __html: NAV_PATHS[tab] }}
    />
  );
}

export function ChevronRight({ size = 16, className = 'chev' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

export function ChevronLeft({ size = 14 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

export function ChevronUp({ size = 12, className = 'psw-cv' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
      <path d="m18 15-6-6-6 6" />
    </svg>
  );
}

export function SearchIcon({ size = 13 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

export function SendIcon({ size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path d="M12 19V5m0 0-6 6m6-6 6 6" />
    </svg>
  );
}
