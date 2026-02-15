import { useState, useCallback } from 'react';

export type Theme = 'parchment' | 'daylight' | 'midnight' | 'autumn' | 'frost';

const STORAGE_KEY = 'genea-theme';

function getInitialTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'parchment' || stored === 'daylight' || stored === 'midnight' || stored === 'autumn' || stored === 'frost') {
    return stored;
  }
  return 'parchment';
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    localStorage.setItem(STORAGE_KEY, t);
    document.documentElement.setAttribute('data-theme', t);
  }, []);

  return { theme, setTheme } as const;
}
