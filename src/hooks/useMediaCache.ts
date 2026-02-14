import { useEffect, useState } from 'react';

const CACHE_NAME = 'genea-media-v1';

interface MediaCacheResult {
  blobUrl: string | undefined;
  loading: boolean;
  error: string | undefined;
}

export function useMediaCache(url?: string): MediaCacheResult {
  const [blobUrl, setBlobUrl] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (!url) {
      setBlobUrl(undefined);
      setLoading(false);
      setError(undefined);
      return;
    }

    let revoked = false;
    let objectUrl: string | undefined;

    async function fetchMedia(mediaUrl: string) {
      setLoading(true);
      setError(undefined);

      try {
        // Try Cache API first
        if ('caches' in window) {
          const cache = await caches.open(CACHE_NAME);
          const cached = await cache.match(mediaUrl);
          if (cached) {
            const blob = await cached.blob();
            if (!revoked) {
              objectUrl = URL.createObjectURL(blob);
              setBlobUrl(objectUrl);
              setLoading(false);
            }
            return;
          }

          // Cache miss — fetch from network
          const response = await fetch(mediaUrl);
          if (!response.ok) throw new Error(`Failed to fetch media: ${response.status}`);

          // Clone before consuming — one for cache, one for blob
          const responseForCache = response.clone();
          await cache.put(mediaUrl, responseForCache);

          const blob = await response.blob();
          if (!revoked) {
            objectUrl = URL.createObjectURL(blob);
            setBlobUrl(objectUrl);
            setLoading(false);
          }
        } else {
          // No Cache API — fall back to raw URL
          if (!revoked) {
            setBlobUrl(mediaUrl);
            setLoading(false);
          }
        }
      } catch (e) {
        // Cache API error — fall back to raw URL
        if (!revoked) {
          setBlobUrl(mediaUrl);
          setLoading(false);
          setError(e instanceof Error ? e.message : 'Failed to load media');
        }
      }
    }

    fetchMedia(url);

    return () => {
      revoked = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [url]);

  return { blobUrl, loading, error };
}
