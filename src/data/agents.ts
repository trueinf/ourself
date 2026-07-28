import type { AgentKey } from '@/types';

/**
 * §6 AgentRow monograms. FIN, SUP, COM, MKT, REG, TEC, BRD, PPL —
 * the eight independent, heterogeneous reasoning paths (§2.3).
 */
export const AGENTS: Record<AgentKey, { monogram: string; label: string }> = {
  fin: { monogram: 'FIN', label: 'Finance' },
  sup: { monogram: 'SUP', label: 'Supply' },
  com: { monogram: 'COM', label: 'Commercial' },
  mkt: { monogram: 'MKT', label: 'Marketing' },
  reg: { monogram: 'REG', label: 'Regulatory' },
  tec: { monogram: 'TEC', label: 'Technology' },
  brd: { monogram: 'BRD', label: 'Brand' },
  ppl: { monogram: 'PPL', label: 'People' },
};

/** Executive initials → full name, for waiting-on avatars (§6 FocusRow). */
export const EXECUTIVES: Record<string, string> = {
  TA: 'Tarang Amin',
  MF: 'Mandy Fields',
  JF: 'Josh Franks',
  JL: 'Jennie Laar',
  KM: 'Kory Marchisotto',
  OS: 'Oshiya Savur',
  EC: 'Ekta Chopra',
  SM: 'Scott Milsten',
};

export const nameOf = (initials: string): string => EXECUTIVES[initials] ?? initials;
