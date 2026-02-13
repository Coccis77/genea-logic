import { Solution } from '../types/level';

export function encodeSolution(solution: Solution): string {
  return btoa(JSON.stringify(solution));
}

export function decodeSolution(encoded: string): Solution {
  return JSON.parse(atob(encoded));
}
