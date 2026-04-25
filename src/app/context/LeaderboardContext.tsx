import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import {
  Player, RaceResult, RaceRanking, getPoints,
  DEFAULT_PLAYERS, DEFAULT_RESULTS, AVATAR_COLORS, AVATAR_EMOJIS,
} from '../data/leaderboard';

const PLAYERS_KEY = 'mk-lb-players';
const RESULTS_KEY = 'mk-lb-results';

function loadPlayers(): Player[] {
  try {
    const raw = localStorage.getItem(PLAYERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return DEFAULT_PLAYERS;
}

function loadResults(): RaceResult[] {
  try {
    const raw = localStorage.getItem(RESULTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return DEFAULT_RESULTS;
}

export interface PlayerStats {
  player: Player;
  totalPoints: number;
  racesPlayed: number;
  wins: number;
  podiums: number; // top 3
}

export interface TrackLegend {
  player: Player;
  trackPoints: number;
  topFinishes: number;
}

interface LeaderboardContextType {
  players: Player[];
  results: RaceResult[];
  rankedPlayers: PlayerStats[];
  addPlayer: (name: string, avatarColor: string, avatarEmoji: string) => void;
  removePlayer: (id: string) => void;
  addRaceResult: (trackId: string, rankings: { playerId: string; position: number }[]) => void;
  getPlayerStats: (playerId: string) => PlayerStats | null;
  getTrackLegends: (trackId: string) => TrackLegend[];
  getPlayerBestTracks: (playerId: string) => { trackId: string; points: number; topFinishes: number }[];
}

const LeaderboardContext = createContext<LeaderboardContextType | null>(null);

export function LeaderboardProvider({ children }: { children: React.ReactNode }) {
  const [players, setPlayers] = useState<Player[]>(loadPlayers);
  const [results, setResults] = useState<RaceResult[]>(loadResults);

  useEffect(() => {
    localStorage.setItem(PLAYERS_KEY, JSON.stringify(players));
  }, [players]);

  useEffect(() => {
    localStorage.setItem(RESULTS_KEY, JSON.stringify(results));
  }, [results]);

  const rankedPlayers = useMemo((): PlayerStats[] => {
    return players
      .map((player) => {
        let totalPoints = 0;
        let racesPlayed = 0;
        let wins = 0;
        let podiums = 0;

        results.forEach((race) => {
          const ranking = race.rankings.find((r) => r.playerId === player.id);
          if (ranking) {
            racesPlayed++;
            totalPoints += ranking.points;
            if (ranking.position === 1) wins++;
            if (ranking.position <= 3) podiums++;
          }
        });

        return { player, totalPoints, racesPlayed, wins, podiums };
      })
      .sort((a, b) => b.totalPoints - a.totalPoints);
  }, [players, results]);

  const addPlayer = useCallback((name: string, avatarColor: string, avatarEmoji: string) => {
    const id = `p${Date.now()}`;
    setPlayers((prev) => [...prev, { id, name, avatarColor, avatarEmoji }]);
  }, []);

  const removePlayer = useCallback((id: string) => {
    setPlayers((prev) => prev.filter((p) => p.id !== id));
    setResults((prev) =>
      prev.map((r) => ({
        ...r,
        rankings: r.rankings.filter((rk) => rk.playerId !== id),
      }))
    );
  }, []);

  const addRaceResult = useCallback(
    (trackId: string, rankings: { playerId: string; position: number }[]) => {
      const fullRankings: RaceRanking[] = rankings.map(({ playerId, position }) => ({
        playerId,
        position,
        points: getPoints(position),
      }));
      const result: RaceResult = {
        id: `r${Date.now()}`,
        trackId,
        date: new Date().toISOString().slice(0, 10),
        rankings: fullRankings,
      };
      setResults((prev) => [...prev, result]);
    },
    []
  );

  const getPlayerStats = useCallback(
    (playerId: string): PlayerStats | null => {
      return rankedPlayers.find((ps) => ps.player.id === playerId) ?? null;
    },
    [rankedPlayers]
  );

  const getTrackLegends = useCallback(
    (trackId: string): TrackLegend[] => {
      const trackResults = results.filter((r) => r.trackId === trackId);
      const statsMap = new Map<string, { points: number; topFinishes: number }>();

      trackResults.forEach((race) => {
        race.rankings.forEach((rk) => {
          const existing = statsMap.get(rk.playerId) ?? { points: 0, topFinishes: 0 };
          statsMap.set(rk.playerId, {
            points: existing.points + rk.points,
            topFinishes: existing.topFinishes + (rk.position <= 3 ? 1 : 0),
          });
        });
      });

      return players
        .filter((p) => statsMap.has(p.id))
        .map((p) => {
          const s = statsMap.get(p.id)!;
          return { player: p, trackPoints: s.points, topFinishes: s.topFinishes };
        })
        .sort((a, b) => b.trackPoints - a.trackPoints)
        .slice(0, 3);
    },
    [players, results]
  );

  const getPlayerBestTracks = useCallback(
    (playerId: string) => {
      const trackMap = new Map<string, { points: number; topFinishes: number }>();

      results.forEach((race) => {
        const rk = race.rankings.find((r) => r.playerId === playerId);
        if (rk) {
          const existing = trackMap.get(race.trackId) ?? { points: 0, topFinishes: 0 };
          trackMap.set(race.trackId, {
            points: existing.points + rk.points,
            topFinishes: existing.topFinishes + (rk.position <= 3 ? 1 : 0),
          });
        }
      });

      return Array.from(trackMap.entries())
        .map(([trackId, stats]) => ({ trackId, ...stats }))
        .sort((a, b) => b.points - a.points)
        .slice(0, 8);
    },
    [results]
  );

  return (
    <LeaderboardContext.Provider
      value={{
        players, results, rankedPlayers,
        addPlayer, removePlayer, addRaceResult,
        getPlayerStats, getTrackLegends, getPlayerBestTracks,
      }}
    >
      {children}
    </LeaderboardContext.Provider>
  );
}

export function useLeaderboard() {
  const ctx = useContext(LeaderboardContext);
  if (!ctx) throw new Error('useLeaderboard must be inside LeaderboardProvider');
  return ctx;
}
