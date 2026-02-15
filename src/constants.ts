import type { CoupleType } from './types/level';
import type { Theme } from './hooks/useTheme';

export const coupleColors: Record<CoupleType, string> = {
  married: 'var(--color-married)',
  partnership: 'var(--color-partnership)',
  hidden: 'var(--color-affair)',
  divorced: 'var(--color-divorced)',
};

export const coupleLabels: Record<CoupleType, string> = {
  married: 'Married',
  partnership: 'Partners',
  hidden: 'Affair',
  divorced: 'Divorced',
};

export const coupleDash: Record<CoupleType, string | undefined> = {
  married: undefined,
  partnership: '8 4',
  hidden: '3 3',
  divorced: '8 4',
};

export const themes: { id: Theme; label: string; bg: string; accent: string }[] = [
  { id: 'parchment', label: 'Parchment', bg: '#1a1510', accent: '#c9a959' },
  { id: 'daylight', label: 'Daylight', bg: '#f7f2e4', accent: '#a07828' },
  { id: 'midnight', label: 'Midnight', bg: '#0f172a', accent: '#fbbf24' },
  { id: 'autumn', label: 'Autumn', bg: '#1c1412', accent: '#d4a030' },
  { id: 'frost', label: 'Frost', bg: '#f1f5f9', accent: '#2563eb' },
];
