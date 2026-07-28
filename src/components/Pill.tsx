import type { ReactNode } from 'react';

/**
 * §6 Pill. Variants map to the contrast-audited classes in app.css.
 * "neutral" is the default .pill; pink/amber/teal/dark add a modifier.
 * Pink fills use --pink-text behind white text (§4 pink rule).
 */
export type PillVariant = 'neutral' | 'pink' | 'amber' | 'teal' | 'dark';

const VARIANT_CLASS: Record<PillVariant, string> = {
  neutral: '',
  pink: 'p',
  amber: 'a',
  teal: 't',
  dark: 'd',
};

/** Accepts the raw prototype tokens ('', 'p', 'a', 't', 'd') as well. */
export function pillClass(variant: string): string {
  const mapped = VARIANT_CLASS[variant as PillVariant];
  const mod = mapped !== undefined ? mapped : variant;
  return `pill${mod ? ' ' + mod : ''}`;
}

interface PillProps {
  variant?: string;
  children: ReactNode;
  onClick?: () => void;
  title?: string;
  ariaLabel?: string;
}

export function Pill({ variant = 'neutral', children, onClick, title, ariaLabel }: PillProps) {
  const className = pillClass(variant);
  if (onClick) {
    return (
      <button type="button" className={className} onClick={onClick} title={title} aria-label={ariaLabel}>
        {children}
      </button>
    );
  }
  return (
    <span className={className} title={title}>
      {children}
    </span>
  );
}
