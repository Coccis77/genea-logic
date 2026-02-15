import { CoupleRelationship, ChildRelationship, Solution } from '../types/level';

function couplesMatch(a: CoupleRelationship, b: CoupleRelationship): boolean {
  if (a.type !== b.type) return false;
  return (
    (a.person1Id === b.person1Id && a.person2Id === b.person2Id) ||
    (a.person1Id === b.person2Id && a.person2Id === b.person1Id)
  );
}

export function validatePlayerState(
  playerCouples: CoupleRelationship[],
  playerChildren: ChildRelationship[],
  solution: Solution
): { matched: number; total: number; incorrect: number } {
  const total = solution.couples.length + solution.children.length;
  let matched = 0;

  const matchedSolutionCoupleIndices = new Set<number>();

  // Match couples
  for (const playerCouple of playerCouples) {
    for (let i = 0; i < solution.couples.length; i++) {
      if (matchedSolutionCoupleIndices.has(i)) continue;
      if (couplesMatch(playerCouple, solution.couples[i])) {
        matched++;
        matchedSolutionCoupleIndices.add(i);
        break;
      }
    }
  }

  // Match children
  const matchedSolutionChildIndices = new Set<number>();
  for (const playerChild of playerChildren) {
    for (let i = 0; i < solution.children.length; i++) {
      if (matchedSolutionChildIndices.has(i)) continue;
      const solChild = solution.children[i];
      if (solChild.childId !== playerChild.childId) continue;

      const solType = solChild.type ?? 'biological';
      const playerType = playerChild.type ?? 'biological';
      if (solType !== playerType) continue;

      // Single-parent child
      if (solChild.parentId) {
        if (playerChild.parentId === solChild.parentId) {
          matched++;
          matchedSolutionChildIndices.add(i);
          break;
        }
        continue;
      }

      // Couple child
      if (!solChild.coupleId || !playerChild.coupleId) continue;
      const playerCouple = playerCouples.find((c) => c.id === playerChild.coupleId);
      if (!playerCouple) continue;

      const solCouple = solution.couples.find((c) => c.id === solChild.coupleId);
      if (!solCouple) continue;

      if (couplesMatch(playerCouple, solCouple)) {
        matched++;
        matchedSolutionChildIndices.add(i);
        break;
      }
    }
  }

  const incorrect = (playerCouples.length + playerChildren.length) - matched;
  return { matched, total, incorrect };
}

export function calculateProgress(matched: number, total: number): number {
  if (total === 0) return 100;
  return Math.round((matched / total) * 100);
}
