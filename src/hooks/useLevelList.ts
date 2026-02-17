import { useState, useEffect } from 'react';

export interface LevelInfo {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeframe: string;
}

export function useLevelList() {
  const [levels, setLevels] = useState<LevelInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/levels/index.json')
      .then((res) => res.json())
      .then((data: LevelInfo[]) => {
        setLevels(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return { levels, loading };
}
