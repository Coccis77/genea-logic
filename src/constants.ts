import type { CoupleType } from './types/level';

export const coupleColors: Record<CoupleType, string> = {
  married: 'var(--color-married)',
  partnership: 'var(--color-partnership)',
  hidden: 'var(--color-affair)',
  divorced: 'var(--color-divorced)',
};
