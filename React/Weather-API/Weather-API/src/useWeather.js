import { useEffect, useState, useCallback, useRef } from "react";

function mapWeatherCode(code) {
  // simplified mapping from Open-Meteo weathercode to text
  const map = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Slight snow",
    73: "Moderate snow",
    75: "Heavy snow",
    80: "Rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
  };
  return map[code] || "Unknown";
}

export function useWeather(coords) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  const fetchWeather = useCallback(async (c) => {
    if (!c || !c.latitude || !c.longitude) return;
    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${encodeURIComponent(
      c.latitude
    )}&longitude=${encodeURIComponent(c.longitude)}&current_weather=true`;

    try {
      const res = await fetch(url, { signal: controller.signal });
      if (!res.ok) throw new Error(`Weather API error: ${res.status}`);
      const data = await res.json();
      if (!data.current_weather) throw new Error("No current_weather in response");

      const cw = data.current_weather;
      setWeather({
        temperature: cw.temperature,
        windspeed: cw.windspeed,
        time: cw.time,
        condition: mapWeatherCode(cw.weathercode),
      });
    } catch (err) {
      if (err.name === "AbortError") return;
      setError(err);
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  }, []);

  useEffect(() => {
    fetchWeather(coords);
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, [coords, fetchWeather]);

  const refresh = useCallback(() => {
    if (coords) fetchWeather(coords);
  }, [coords, fetchWeather]);

  return { weather, loading, error, refresh };
}
