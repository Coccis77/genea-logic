import { useCallback, useEffect, useRef, useState } from 'react';
import type { CoupleRelationship, ChildRelationship } from '../types/level';

export interface GameState {
  couples: CoupleRelationship[];
  children: ChildRelationship[];
}

const INITIAL_STATE: GameState = { couples: [], children: [] };

export function useUndoRedo(disabled?: boolean) {
  const [history, setHistory] = useState<GameState[]>([INITIAL_STATE]);
  const [index, setIndex] = useState(0);
  const indexRef = useRef(index);
  const historyRef = useRef(history);

  indexRef.current = index;
  historyRef.current = history;

  const current = history[index];

  const push = useCallback((next: GameState) => {
    setHistory((prev) => [...prev.slice(0, indexRef.current + 1), next]);
    setIndex((prev) => prev + 1);
  }, []);

  const undo = useCallback(() => {
    setIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const redo = useCallback(() => {
    setIndex((prev) => Math.min(historyRef.current.length - 1, prev + 1));
  }, []);

  const canUndo = index > 0;
  const canRedo = index < history.length - 1;

  // Keyboard shortcuts
  useEffect(() => {
    if (disabled) return;
    const handler = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod || e.key.toLowerCase() !== 'z') return;

      e.preventDefault();
      if (e.shiftKey) {
        redo();
      } else {
        undo();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [undo, redo, disabled]);

  const reset = useCallback(() => {
    setHistory([INITIAL_STATE]);
    setIndex(0);
  }, []);

  return { state: current, push, undo, redo, canUndo, canRedo, reset };
}
