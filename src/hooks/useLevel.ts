import { useState, useEffect } from 'react';
import { Level } from '../types/level';

interface UseLevelReturn {
  level: Level | null;
  loading: boolean;
  error: string | null;
}

export function useLevel(levelId: string): UseLevelReturn {
  const [level, setLevel] = useState<Level | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!levelId) {
      setLevel(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    fetch(`${import.meta.env.BASE_URL}levels/${levelId}.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load level: ${res.status}`);
        return res.json();
      })
      .then((data: Level) => {
        const base = import.meta.env.BASE_URL;
        data.documents = data.documents.map((doc) => ({
          ...doc,
          audioUrl: doc.audioUrl ? `${base}${doc.audioUrl.replace(/^\//, '')}` : undefined,
          imageUrl: doc.imageUrl ? `${base}${doc.imageUrl.replace(/^\//, '')}` : undefined,
        }));
        setLevel(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [levelId]);

  return { level, loading, error };
}
