
import { useEffect, useState, useCallback } from "react";

const STORAGE_KEY = "weatherapp.lastCoords";

export function useGeolocation({ persist = true } = {}) {
  const [coords, setCoords] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const save = useCallback((c) => {
    setCoords(c);
    if (persist) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
      } catch {}
    }
  }, [persist]);

  const request = useCallback((options) => {
    // Return a promise so callers can react to success/failure
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const e = new Error("Geolocation not supported");
        setError(e);
        reject(e);
        return;
      }
      setLoading(true);
      setError(null);

      console.debug("useGeolocation.request: asking for position", options);

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const c = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
            timestamp: pos.timestamp,
          };
          console.debug("useGeolocation.request: got position", c);
          save(c);
          setLoading(false);
          resolve(c);
        },
        (err) => {
          console.debug("useGeolocation.request: position error", err);
          setError(err);
          setLoading(false);
          reject(err);
        },
        options
      );
    });
  }, [save]);

  useEffect(() => {
    // optional: request automatically on mount
    // request();
  }, [request]);

  const clear = useCallback(() => {
    setCoords(null);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  }, []);

  return { coords, loading, error, request, clear, setCoords: save };
}