import { useMemo } from 'react';
import { CoupleRelationship, ChildRelationship } from '../types/level';
import { decodeSolution } from '../utils/encoding';
import { validatePlayerState, calculateProgress } from '../utils/validation';

interface UseValidationReturn {
  progress: number;
  matched: number;
  total: number;
  isWin: boolean;
}

export function useValidation(
  playerCouples: CoupleRelationship[],
  playerChildren: ChildRelationship[],
  solutionEncoded: string | null
): UseValidationReturn {
  return useMemo(() => {
    if (!solutionEncoded) {
      return { progress: 0, matched: 0, total: 0, isWin: false };
    }

    const solution = decodeSolution(solutionEncoded);
    const { matched, total } = validatePlayerState(playerCouples, playerChildren, solution);
    const progress = calculateProgress(matched, total);

    return {
      progress,
      matched,
      total,
      isWin: progress === 100,
    };
  }, [playerCouples, playerChildren, solutionEncoded]);
}
