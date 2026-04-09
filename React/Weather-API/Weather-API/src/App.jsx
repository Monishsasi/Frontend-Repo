import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { useGeolocation } from "./useGeolocation";
import { useWeather } from "./useWeather";

export default function App() {
  const { coords, loading: geoLoading, error: geoError, request, setCoords } = useGeolocation();
  const { weather, loading: weatherLoading, error: weatherError, refresh } = useWeather(coords);
  React.useEffect(() => {
    if (!coords) return;
    const id = setInterval(() => {
      refresh();
    }, 30_000);
    return () => clearInterval(id);
  }, [coords, refresh]);

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const abortRef = useRef(null);

  const [geoStatus, setGeoStatus] = useState('idle');
  const [lastLog, setLastLog] = useState('');
  const [debugCollapsed, setDebugCollapsed] = useState(false);
  const [debugManual, setDebugManual] = useState(false);

  useEffect(() => {
    if (debugManual) return;
    const id = setTimeout(() => setDebugCollapsed(true), 3500);
    return () => clearTimeout(id);
  }, [debugManual, lastLog]);

  const handleRequest = async (opts = { enableHighAccuracy: true }, force = false) => {
    setLastLog('checking permission');
    try {
      if (navigator.permissions && navigator.permissions.query) {
        const p = await navigator.permissions.query({ name: 'geolocation' });
        if (p.state === 'denied' && !force) {
          setGeoStatus('failed');
          setLastLog('permission denied - please enable location in browser/site settings');
          return;
        }
      }
    } catch (e) {
      console.debug('permissions query failed', e);
    }
    setGeoStatus('requesting');
    setLastLog('request started');
    try {
      await request(opts);
      setGeoStatus('success');
      setLastLog('request succeeded');
    } catch (err) {
      setGeoStatus('failed');
      setLastLog(`request failed: ${err && err.message}`);
      console.warn('geolocation request failed', err);
    }
    setTimeout(() => setGeoStatus('idle'), 2000);
  };

  useEffect(() => {
    if (!query) {
      setSuggestions([]);
      setSearchError(null);
      return;
    }
    const handler = setTimeout(async () => {
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setSearchLoading(true);
      setSearchError(null);
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5`;
      try {
        const res = await fetch(url, {
          signal: controller.signal,
          headers: { 'Accept': 'application/json' }
        });
        if (!res.ok) throw new Error(`Search error: ${res.status}`);
        const data = await res.json();
        setSuggestions(data || []);
      } catch (err) {
        if (err.name !== 'AbortError') setSearchError(err);
      } finally {
        setSearchLoading(false);
        abortRef.current = null;
      }
    }, 350);
    return () => {
      clearTimeout(handler);
      if (abortRef.current) abortRef.current.abort();
    };
  }, [query]);

  // Weather icon (simple emoji for demo)
  function getWeatherIcon(condition) {
    if (!condition) return "☁️";
    if (condition.includes("Clear")) return "☀️";
    if (condition.includes("Rain")) return "🌧️";
    if (condition.includes("Snow")) return "❄️";
    if (condition.includes("Fog")) return "🌫️";
    if (condition.includes("Cloud")) return "⛅";
    return "☁️";
  }

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>Weather Dashboard</h1>
          <div className="app-sub">Location-based weather, city search, and auto-refresh</div>
        </div>
        <div className="controls">
          <button onClick={() => handleRequest({ enableHighAccuracy: true }, true)}>
            Use my location
          </button>
          <button onClick={() => refresh()} disabled={!coords}>
            Refresh weather
          </button>
        </div>
      </header>

      {/* Hero section */}
      <section className="hero">
        <div className="hero-left">
          <div className="hero-title">Get real-time weather for your location or any city</div>
          <div className="hero-meta">Powered by Open-Meteo & OpenStreetMap</div>
        </div>
        <div className="hero-right">
          {weather && (
            <div className="weather-icon" title={weather.condition}>
              {getWeatherIcon(weather.condition)}
            </div>
          )}
        </div>
      </section>

      <div className="search">
        <input
          type="text"
          placeholder="Search city (e.g. Chennai)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {searchLoading && <div className="status">Searching…</div>}
        {searchError && <div className="error">Search error: {searchError.message}</div>}
        {suggestions.length > 0 && (
          <ul className="suggestions">
            {suggestions.map((s) => (
              <li key={s.place_id}>
                <button
                  onClick={() => {
                    setCoords({
                      latitude: parseFloat(s.lat),
                      longitude: parseFloat(s.lon),
                      timestamp: Date.now(),
                    });
                    setQuery(s.display_name);
                    setSuggestions([]);
                  }}
                >
                  {s.display_name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <main>
        <div className="content-grid">
          <div className="left-column">
            {geoLoading && <div className="status">Requesting location…</div>}
            {geoError && (
              <div className="error">
                <div>Location error: {geoError.message}</div>
                <div>
                  <span>Please search for your city below to get weather information.</span>
                </div>
                {geoStatus === 'failed' && lastLog && lastLog.includes('permission denied') && (
                  <div className="permission-help">
                    <p>Location permission appears to be denied. To enable:</p>
                    <ol>
                      <li>Click the lock icon (left of the address bar).</li>
                      <li>Find "Location" and set to "Allow" for this site.</li>
                      <li>Reload the page and use the search box.</li>
                    </ol>
                  </div>
                )}
              </div>
            )}

            {coords && (
              <section className="coords">
                <div>Lat: {coords.latitude}</div>
                <div>Lon: {coords.longitude}</div>
                <div>Accuracy: {coords.accuracy}m</div>
                <div>Timestamp: {new Date(coords.timestamp).toLocaleString()}</div>
              </section>
            )}

            {weatherLoading && (
              <div className="status">
                <div className="spinner" aria-hidden></div>
                Loading weather…
              </div>
            )}
            {weatherError && (
              <div className="error">
                Weather error: {weatherError.message}
                <div>
                  <button onClick={() => refresh()} disabled={!coords}>
                    Retry
                  </button>
                </div>
              </div>
            )}

            {weather && (
              <section className="weather-card">
                <div className="weather-row">
                  <div className="weather-main">
                    <div className="weather-icon" title={weather.condition}>
                      {getWeatherIcon(weather.condition)}
                    </div>
                    <div className="weather-values">
                      <div className="temp">{weather.temperature}°C</div>
                      <div className="meta">{weather.condition}</div>
                    </div>
                  </div>
                  <div className="details">
                    <div className="detail">
                      <span className="k">Wind</span>
                      <span className="v">{weather.windspeed} m/s</span>
                    </div>
                    <div className="detail">
                      <span className="k">Time</span>
                      <span className="v">{new Date(weather.time).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {!coords && !geoLoading && (
              <div className="hint">Click "Use my location" or search a city to get started.</div>
            )}
          </div>

          {/* Simple on-screen debug panel toggle and panel */}
          <div>
            <button
              className={`debug-toggle ${debugCollapsed ? 'collapsed' : 'expanded'}`}
              aria-label={debugCollapsed ? 'Show debug panel' : 'Hide debug panel'}
              onClick={() => { setDebugCollapsed((s) => !s); setDebugManual(true); }}
            >
              <svg className="debug-arrow" width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M8 5l8 7-8 7V5z" fill="currentColor" />
              </svg>
            </button>
            <div className={`debug-panel-simple ${debugCollapsed ? 'collapsed' : 'expanded'}`} aria-hidden>
              <div className="debug-content">
                <div><strong>geoStatus:</strong> {geoStatus}</div>
                <div><strong>lastLog:</strong> {lastLog || '—'}</div>
                <div><strong>geoError:</strong> {geoError ? geoError.message : '—'}</div>
                <div><strong>coords:</strong> {coords ? `${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}` : '—'}</div>
                <div><strong>weather:</strong> {weather ? `${weather.temperature}°C, ${weather.condition}` : '—'}</div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <div className="footer">Weather-API Demo &copy; {new Date().getFullYear()}</div>
    </div>
  );
}