export interface Player {
  id: string;
  name: string;
  avatarColor: string;
  avatarEmoji: string;
}

export interface RaceRanking {
  playerId: string;
  position: number;
  points: number;
}

export interface RaceResult {
  id: string;
  trackId: string;
  date: string; // ISO date string
  rankings: RaceRanking[];
}

export const MK_POINTS = [15, 12, 10, 8, 7, 6, 5, 4, 3, 2, 1, 0];

export function getPoints(position: number): number {
  return MK_POINTS[Math.min(position - 1, MK_POINTS.length - 1)] ?? 0;
}

export const AVATAR_COLORS = [
  '#E52521', '#049CD8', '#EC407A', '#43B047',
  '#FBD000', '#7B1FA2', '#FF6F00', '#00897B',
  '#F06292', '#26C6DA', '#FF7043', '#AB47BC',
];

export const AVATAR_EMOJIS = [
  '🏎️', '🌊', '⭐', '🍄', '👑', '💀', '🔥', '🐢',
  '🏀', '🎯', '🌸', '⚡', '🦊', '🐉', '🎸', '🚀',
];

export const DEFAULT_PLAYERS: Player[] = [
  { id: 'p1', name: 'Bryan', avatarColor: '#E52521', avatarEmoji: '🏎️' },
  { id: 'p2', name: 'Alex', avatarColor: '#049CD8', avatarEmoji: '🌊' },
  { id: 'p3', name: 'Zoé', avatarColor: '#EC407A', avatarEmoji: '⭐' },
  { id: 'p4', name: 'Tom', avatarColor: '#43B047', avatarEmoji: '🍄' },
];

export const DEFAULT_RESULTS: RaceResult[] = [
  {
    id: 'r01', trackId: 'mk-01', date: '2025-01-10',
    rankings: [
      { playerId: 'p1', position: 1, points: 15 },
      { playerId: 'p2', position: 2, points: 12 },
      { playerId: 'p3', position: 3, points: 10 },
      { playerId: 'p4', position: 4, points: 8 },
    ],
  },
  {
    id: 'r02', trackId: 'mk-05', date: '2025-01-17',
    rankings: [
      { playerId: 'p2', position: 1, points: 15 },
      { playerId: 'p4', position: 2, points: 12 },
      { playerId: 'p1', position: 3, points: 10 },
      { playerId: 'p3', position: 4, points: 8 },
    ],
  },
  {
    id: 'r03', trackId: 'mk-09', date: '2025-01-24',
    rankings: [
      { playerId: 'p1', position: 1, points: 15 },
      { playerId: 'p3', position: 2, points: 12 },
      { playerId: 'p2', position: 3, points: 10 },
      { playerId: 'p4', position: 4, points: 8 },
    ],
  },
  {
    id: 'r04', trackId: 'mk-13', date: '2025-01-31',
    rankings: [
      { playerId: 'p3', position: 1, points: 15 },
      { playerId: 'p1', position: 2, points: 12 },
      { playerId: 'p4', position: 3, points: 10 },
      { playerId: 'p2', position: 4, points: 8 },
    ],
  },
  {
    id: 'r05', trackId: 'mk-17', date: '2025-02-07',
    rankings: [
      { playerId: 'p1', position: 1, points: 15 },
      { playerId: 'p2', position: 2, points: 12 },
      { playerId: 'p4', position: 3, points: 10 },
      { playerId: 'p3', position: 4, points: 8 },
    ],
  },
  {
    id: 'r06', trackId: 'mk-21', date: '2025-02-14',
    rankings: [
      { playerId: 'p2', position: 1, points: 15 },
      { playerId: 'p1', position: 2, points: 12 },
      { playerId: 'p3', position: 3, points: 10 },
      { playerId: 'p4', position: 4, points: 8 },
    ],
  },
  {
    id: 'r07', trackId: 'mk-02', date: '2025-02-21',
    rankings: [
      { playerId: 'p1', position: 1, points: 15 },
      { playerId: 'p3', position: 2, points: 12 },
      { playerId: 'p4', position: 3, points: 10 },
      { playerId: 'p2', position: 4, points: 8 },
    ],
  },
  {
    id: 'r08', trackId: 'mk-06', date: '2025-02-28',
    rankings: [
      { playerId: 'p3', position: 1, points: 15 },
      { playerId: 'p2', position: 2, points: 12 },
      { playerId: 'p1', position: 3, points: 10 },
      { playerId: 'p4', position: 4, points: 8 },
    ],
  },
  {
    id: 'r09', trackId: 'mk-10', date: '2025-03-07',
    rankings: [
      { playerId: 'p1', position: 1, points: 15 },
      { playerId: 'p4', position: 2, points: 12 },
      { playerId: 'p3', position: 3, points: 10 },
      { playerId: 'p2', position: 4, points: 8 },
    ],
  },
  {
    id: 'r10', trackId: 'mk-14', date: '2025-03-14',
    rankings: [
      { playerId: 'p2', position: 1, points: 15 },
      { playerId: 'p1', position: 2, points: 12 },
      { playerId: 'p4', position: 3, points: 10 },
      { playerId: 'p3', position: 4, points: 8 },
    ],
  },
];
