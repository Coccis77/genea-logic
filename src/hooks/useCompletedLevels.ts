import { useState, useCallback } from 'react';

const STORAGE_KEY = 'genea-completed';

function getCompleted(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return new Set(JSON.parse(raw));
  } catch { /* ignore */ }
  return new Set();
}

export function useCompletedLevels() {
  const [completed, setCompleted] = useState<Set<string>>(getCompleted);

  const markCompleted = useCallback((levelId: string) => {
    setCompleted((prev) => {
      if (prev.has(levelId)) return prev;
      const next = new Set(prev);
      next.add(levelId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      return next;
    });
  }, []);

  return { completed, markCompleted } as const;
}
