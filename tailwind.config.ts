import type { Config } from 'tailwindcss';

/**
 * Tailwind is present per §3 of the spec, but it adds no new colour.
 * tokens.css (§4) is the single source of truth for colour; every entry
 * below is a reference to a CSS custom property defined there. No hex
 * literals live here, and components must not use arbitrary colour values.
 */
const token = (name: string) => `var(--${name})`;

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: token('ink'),
        'ink-2': token('ink-2'),
        body: token('body'),
        muted: token('muted'),
        faint: token('faint'),
        paper: token('paper'),
        mist: token('mist'),
        'mist-2': token('mist-2'),
        line: token('line'),
        'line-2': token('line-2'),
        pink: token('pink'),
        'pink-text': token('pink-text'),
        'pink-on-dark': token('pink-on-dark'),
        'pink-soft': token('pink-soft'),
        'pink-line': token('pink-line'),
        amber: token('amber'),
        'amber-soft': token('amber-soft'),
        'amber-line': token('amber-line'),
        teal: token('teal'),
        'teal-soft': token('teal-soft'),
        rail: token('rail'),
        'rail-2': token('rail-2'),
        'rail-line': token('rail-line'),
        'rail-txt': token('rail-txt'),
        'rail-txt-2': token('rail-txt-2'),
        'rail-on': token('rail-on'),
      },
      borderRadius: {
        DEFAULT: token('r'),
        lg: token('r-lg'),
      },
      boxShadow: {
        card: token('shadow'),
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
