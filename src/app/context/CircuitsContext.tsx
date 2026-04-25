import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { ALL_TRACKS, Track } from '../data/tracks';

const STORAGE_KEY = 'mk-enabled-tracks-v2';

function loadEnabled(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: string[] = JSON.parse(raw);
      // Only keep IDs that still exist in the current track list
      const validIds = new Set(ALL_TRACKS.map((t) => t.id));
      const filtered = parsed.filter((id) => validIds.has(id));
      if (filtered.length > 0) return new Set(filtered);
    }
  } catch {}
  return new Set(ALL_TRACKS.map((t) => t.id));
}

interface CircuitsContextType {
  enabledIds: Set<string>;
  enabledTracks: Track[];
  toggleTrack: (id: string) => void;
  isEnabled: (id: string) => boolean;
  enableAll: () => void;
  disableAll: () => void;
}

const CircuitsContext = createContext<CircuitsContextType | null>(null);

export function CircuitsProvider({ children }: { children: React.ReactNode }) {
  const [enabledIds, setEnabledIds] = useState<Set<string>>(loadEnabled);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...enabledIds]));
  }, [enabledIds]);

  const toggleTrack = useCallback((id: string) => {
    setEnabledIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        if (next.size <= 1) return prev; // always keep at least 1
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const isEnabled = useCallback((id: string) => enabledIds.has(id), [enabledIds]);

  const enableAll = useCallback(() => {
    setEnabledIds(new Set(ALL_TRACKS.map((t) => t.id)));
  }, []);

  const disableAll = useCallback(() => {
    setEnabledIds(new Set([ALL_TRACKS[0].id]));
  }, []);

  const enabledTracks = useMemo(
    () => ALL_TRACKS.filter((t) => enabledIds.has(t.id)),
    [enabledIds]
  );

  return (
    <CircuitsContext.Provider
      value={{ enabledIds, enabledTracks, toggleTrack, isEnabled, enableAll, disableAll }}
    >
      {children}
    </CircuitsContext.Provider>
  );
}

export function useCircuits() {
  const ctx = useContext(CircuitsContext);
  if (!ctx) throw new Error('useCircuits must be used inside CircuitsProvider');
  return ctx;
}
