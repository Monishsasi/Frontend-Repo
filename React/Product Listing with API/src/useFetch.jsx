import { useEffect, useState } from 'react';

/**
 * useFetch with localStorage caching and TTL.
 * Returns [data, error].
 * - cacheKey: localStorage key
 * - ttl: cache time-to-live in ms (default 24h)
 */
export default function useFetch(url, cacheKey = 'productsCache', ttl = 24 * 60 * 60 * 1000) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      // Try network first
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(res.status + ' ' + res.statusText);
        const json = await res.json();
        if (!mounted) return;
        setData(json);
        setError(null);
        // persist cache
        try {
          const payload = { ts: Date.now(), data: json };
          localStorage.setItem(cacheKey, JSON.stringify(payload));
        } catch (e) {
          // ignore storage errors
        }
        return;
      } catch (networkErr) {
        // on network failure try cache
        try {
          const raw = localStorage.getItem(cacheKey);
          if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed && parsed.data) {
              const age = Date.now() - (parsed.ts || 0);
              if (mounted) {
                setData(parsed.data);
                // indicate stale if older than ttl
                setError(age > ttl ? 'Using stale cached data' : null);
              }
              return;
            }
          }
        } catch (cacheErr) {
          // fall through
        }
        if (mounted) setError(networkErr.message || 'Network error');
      }
    }

    load();
    return () => { mounted = false; };
  }, [url, cacheKey, ttl]);

  return [data, error];
}