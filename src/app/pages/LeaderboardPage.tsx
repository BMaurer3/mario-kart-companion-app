import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLeaderboard, PlayerStats } from '../context/LeaderboardContext';
import { StarField } from '../components/StarField';
import { AVATAR_COLORS, AVATAR_EMOJIS } from '../data/leaderboard';
import { ALL_TRACKS } from '../data/tracks';

/* ─── Avatar component ──────────────────────────────────────── */
function Avatar({
  player,
  size = 52,
  glow = false,
  rank,
}: {
  player: { avatarColor: string; avatarEmoji: string; name: string };
  size?: number;
  glow?: boolean;
  rank?: number;
}) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {glow && (
        <motion.div
          className="absolute rounded-full"
          style={{ inset: -6, background: player.avatarColor, filter: 'blur(12px)', opacity: 0.5 }}
          animate={{ opacity: [0.35, 0.7, 0.35], scale: [0.9, 1.1, 0.9] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
      <div
        className="relative flex items-center justify-center rounded-full"
        style={{
          width: size,
          height: size,
          background: `radial-gradient(circle at 35% 35%, ${player.avatarColor}dd, ${player.avatarColor}88)`,
          border: `3px solid ${player.avatarColor}`,
          boxShadow: glow
            ? `0 0 24px ${player.avatarColor}80, inset 0 2px 0 rgba(255,255,255,0.35)`
            : `0 4px 12px rgba(0,0,0,0.4), inset 0 2px 0 rgba(255,255,255,0.25)`,
          fontSize: size * 0.42,
        }}
      >
        {player.avatarEmoji}
      </div>
      {rank !== undefined && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -bottom-1 -right-1 rounded-full flex items-center justify-center"
          style={{
            width: size * 0.38,
            height: size * 0.38,
            background:
              rank === 1 ? 'linear-gradient(135deg,#FFD700,#FFA500)' :
              rank === 2 ? 'linear-gradient(135deg,#C0C0C0,#A0A0A0)' :
              'linear-gradient(135deg,#CD7F32,#8B4513)',
            border: `2px solid ${rank === 1 ? '#FF8C00' : rank === 2 ? '#888' : '#5C2D0A'}`,
            fontSize: size * 0.2,
            fontFamily: "'Press Start 2P', monospace",
            color: rank === 1 ? '#7B3F00' : '#fff',
            boxShadow: '0 2px 6px rgba(0,0,0,0.5)',
          }}
        >
          {rank}
        </motion.div>
      )}
    </div>
  );
}

/* ─── Podium ────────────────────────────────────────────────── */
function Podium({ top3 }: { top3: PlayerStats[] }) {
  const [first, second, third] = top3;

  const PodiumSlot = ({
    stats,
    rank,
    avatarSize,
    stepHeight,
    delay,
  }: {
    stats: PlayerStats;
    rank: number;
    avatarSize: number;
    stepHeight: number;
    delay: number;
  }) => {
    const colors = {
      1: { step: 'linear-gradient(180deg,#FFD700 0%,#B8860B 100%)', glow: 'rgba(255,215,0,0.4)', label: '👑', border: '#FF8C00' },
      2: { step: 'linear-gradient(180deg,#C0C0C0 0%,#808080 100%)', glow: 'rgba(192,192,192,0.3)', label: '🥈', border: '#999' },
      3: { step: 'linear-gradient(180deg,#CD7F32 0%,#6B3A1F 100%)', glow: 'rgba(205,127,50,0.3)', label: '🥉', border: '#8B4513' },
    }[rank]!;

    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, type: 'spring', stiffness: 200, damping: 20 }}
        className="flex flex-col items-center"
        style={{ flex: rank === 1 ? 1.15 : 1 }}
      >
        {/* Rank emoji */}
        <motion.span
          style={{ fontSize: rank === 1 ? 22 : 16, marginBottom: 4 }}
          animate={rank === 1 ? { rotate: [0, 10, -10, 0], y: [0, -3, 0] } : {}}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          {colors.label}
        </motion.span>

        {/* Avatar */}
        <Avatar player={stats.player} size={avatarSize} glow={rank === 1} rank={rank} />

        {/* Name + points */}
        <div className="text-center mt-2 mb-2 px-1">
          <p
            className="truncate"
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: rank === 1 ? 9 : 7,
              color: '#fff',
              maxWidth: rank === 1 ? 100 : 80,
              textAlign: 'center',
            }}
          >
            {stats.player.name}
          </p>
          <motion.p
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 900,
              fontSize: rank === 1 ? 18 : 14,
              color: rank === 1 ? '#FBD000' : 'rgba(255,255,255,0.7)',
              textShadow: rank === 1 ? '0 0 12px rgba(251,208,0,0.6)' : 'none',
              marginTop: 2,
            }}
          >
            {stats.totalPoints}
            <span style={{ fontSize: rank === 1 ? 10 : 8, opacity: 0.6, marginLeft: 3 }}>pts</span>
          </motion.p>
        </div>

        {/* Podium step */}
        <div
          className="w-full rounded-t-xl relative overflow-hidden"
          style={{
            height: stepHeight,
            background: colors.step,
            border: `2px solid ${colors.border}`,
            borderBottom: 'none',
            boxShadow: `0 -4px 20px ${colors.glow}, inset 0 2px 0 rgba(255,255,255,0.3)`,
          }}
        >
          {/* Shine */}
          <div
            className="absolute top-0 left-0 right-0"
            style={{ height: '35%', background: 'rgba(255,255,255,0.15)', borderRadius: '8px 8px 50% 50%' }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: rank === 1 ? 22 : 16,
                color: 'rgba(0,0,0,0.2)',
                lineHeight: 1,
              }}
            >
              {rank}
            </span>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="px-4 pt-4 pb-0">
      {/* Floating confetti stars */}
      <div className="relative">
        {['⭐', '✨', '🌟', '⭐', '✨'].map((e, i) => (
          <motion.span
            key={i}
            className="absolute pointer-events-none"
            style={{
              fontSize: 12 + (i % 3) * 4,
              left: `${10 + i * 18}%`,
              top: -10,
              opacity: 0.5,
            }}
            animate={{ y: [0, -8, 0], opacity: [0.3, 0.7, 0.3], rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2.5 + i * 0.4, repeat: Infinity, delay: i * 0.3 }}
          >
            {e}
          </motion.span>
        ))}
      </div>

      <div className="flex items-end justify-center gap-1">
        {/* 2nd */}
        {second && (
          <PodiumSlot stats={second} rank={2} avatarSize={58} stepHeight={64} delay={0.15} />
        )}
        {/* 1st */}
        {first && (
          <PodiumSlot stats={first} rank={1} avatarSize={72} stepHeight={88} delay={0.05} />
        )}
        {/* 3rd */}
        {third && (
          <PodiumSlot stats={third} rank={3} avatarSize={50} stepHeight={44} delay={0.25} />
        )}
      </div>
    </div>
  );
}

/* ─── Ranked list row (4th+) ────────────────────────────────── */
function RankedRow({ stats, rank, onTap }: { stats: PlayerStats; rank: number; onTap: () => void }) {
  return (
    <motion.button
      onClick={onTap}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.05 * (rank - 4), type: 'spring', stiffness: 200, damping: 22 }}
      whileTap={{ scale: 0.97 }}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl mb-2"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1.5px solid rgba(255,255,255,0.08)',
        cursor: 'pointer',
        textAlign: 'left',
      }}
    >
      {/* Rank number */}
      <div
        className="flex items-center justify-center rounded-full shrink-0"
        style={{
          width: 30,
          height: 30,
          background: 'rgba(255,255,255,0.08)',
          border: '1.5px solid rgba(255,255,255,0.12)',
        }}
      >
        <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, color: 'rgba(255,255,255,0.5)' }}>
          {rank}
        </span>
      </div>

      {/* Avatar */}
      <Avatar player={stats.player} size={44} />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 15, color: '#fff' }}>
          {stats.player.name}
        </p>
        <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 1 }}>
          {stats.racesPlayed} courses · {stats.wins} victoire{stats.wins !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Points */}
      <div className="text-right shrink-0">
        <p style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 20, color: 'rgba(255,255,255,0.7)' }}>
          {stats.totalPoints}
        </p>
        <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>
          pts
        </p>
      </div>
    </motion.button>
  );
}

/* ─── Add Player Modal ──────────────────────────────────────── */
function AddPlayerModal({ onClose }: { onClose: () => void }) {
  const { addPlayer } = useLeaderboard();
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(AVATAR_COLORS[0]);
  const [selectedEmoji, setSelectedEmoji] = useState(AVATAR_EMOJIS[0]);

  const handleAdd = () => {
    if (!name.trim()) return;
    addPlayer(name.trim(), selectedColor, selectedEmoji);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 26 }}
        className="w-full max-w-[430px] rounded-t-3xl overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #1a1250 0%, #0f0c29 100%)',
          border: '2px solid rgba(251,208,0,0.25)',
          borderBottom: 'none',
        }}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.25)' }} />
        </div>

        <div
          className="px-5 py-4 flex items-center justify-between"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
        >
          <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 10, color: '#FBD000' }}>
            👤 NOUVEAU JOUEUR
          </span>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)', fontSize: 14, cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>

        <div className="px-5 py-5 flex flex-col gap-5">
          {/* Preview avatar */}
          <div className="flex justify-center">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Avatar player={{ avatarColor: selectedColor, avatarEmoji: selectedEmoji, name }} size={80} glow />
            </motion.div>
          </div>

          {/* Name */}
          <div className="flex flex-col gap-2">
            <label style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: 'rgba(255,255,255,0.45)', letterSpacing: 1 }}>
              PSEUDO
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ex: Luigi, Peach..."
              maxLength={12}
              className="w-full px-4 py-3 rounded-xl outline-none"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1.5px solid rgba(255,255,255,0.15)',
                color: '#fff',
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 700,
                fontSize: 16,
              }}
            />
          </div>

          {/* Emoji picker */}
          <div className="flex flex-col gap-2">
            <label style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: 'rgba(255,255,255,0.45)', letterSpacing: 1 }}>
              AVATAR
            </label>
            <div className="grid grid-cols-8 gap-2">
              {AVATAR_EMOJIS.map((emoji) => (
                <motion.button
                  key={emoji}
                  onClick={() => setSelectedEmoji(emoji)}
                  whileTap={{ scale: 0.85 }}
                  className="w-full aspect-square rounded-xl flex items-center justify-center"
                  style={{
                    background: selectedEmoji === emoji ? `${selectedColor}30` : 'rgba(255,255,255,0.05)',
                    border: selectedEmoji === emoji ? `2px solid ${selectedColor}` : '2px solid rgba(255,255,255,0.1)',
                    fontSize: 20,
                    cursor: 'pointer',
                  }}
                >
                  {emoji}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Color picker */}
          <div className="flex flex-col gap-2">
            <label style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: 'rgba(255,255,255,0.45)', letterSpacing: 1 }}>
              COULEUR
            </label>
            <div className="flex gap-2 flex-wrap">
              {AVATAR_COLORS.map((color) => (
                <motion.button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  whileTap={{ scale: 0.85 }}
                  className="rounded-full"
                  style={{
                    width: 32,
                    height: 32,
                    background: color,
                    border: selectedColor === color ? '3px solid #fff' : '3px solid transparent',
                    boxShadow: selectedColor === color ? `0 0 12px ${color}80` : 'none',
                    cursor: 'pointer',
                  }}
                />
              ))}
            </div>
          </div>

          {/* CTA */}
          <motion.button
            onClick={handleAdd}
            disabled={!name.trim()}
            whileTap={name.trim() ? { scale: 0.94 } : {}}
            className="w-full py-4 rounded-xl mb-2"
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 10,
              background: name.trim()
                ? 'linear-gradient(135deg, #FBD000 0%, #E6A800 100%)'
                : 'rgba(255,255,255,0.08)',
              color: name.trim() ? '#5C3317' : 'rgba(255,255,255,0.3)',
              border: name.trim() ? '3px solid #8B4513' : '3px solid transparent',
              boxShadow: name.trim() ? '0 5px 0 #5C2D0A, 0 8px 24px rgba(251,208,0,0.3)' : 'none',
              cursor: name.trim() ? 'pointer' : 'not-allowed',
              letterSpacing: 1,
              transition: 'all 0.2s',
            }}
          >
            ✓ AJOUTER LE JOUEUR
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Player Profile Modal ──────────────────────────────────── */
function PlayerProfileModal({ stats, onClose }: { stats: PlayerStats; onClose: () => void }) {
  const { getPlayerBestTracks } = useLeaderboard();
  const bestTracks = getPlayerBestTracks(stats.player.id);
  const [imgLoadedMap, setImgLoadedMap] = useState<Record<string, boolean>>({});

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 280, damping: 28 }}
        className="w-full max-w-[430px] rounded-t-3xl overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #1a1250 0%, #0f0c29 100%)',
          border: '2px solid rgba(255,255,255,0.1)',
          borderBottom: 'none',
          maxHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.25)' }} />
        </div>

        {/* Close */}
        <div className="flex justify-end px-5 pt-1 pb-2 shrink-0">
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)', fontSize: 14, cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto pb-8">
          {/* Hero header */}
          <div className="flex flex-col items-center px-5 pt-2 pb-6">
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 0.1 }}
            >
              <Avatar player={stats.player} size={88} glow />
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center mt-4"
            >
              <h2 style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 16, color: '#fff', textShadow: `0 0 20px ${stats.player.avatarColor}80` }}>
                {stats.player.name}
              </h2>
              <div className="flex items-baseline justify-center gap-1 mt-3">
                <motion.span
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{
                    fontFamily: "'Nunito', sans-serif",
                    fontWeight: 900,
                    fontSize: 44,
                    color: '#FBD000',
                    textShadow: '0 0 20px rgba(251,208,0,0.5)',
                    lineHeight: 1,
                  }}
                >
                  {stats.totalPoints}
                </motion.span>
                <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>
                  pts
                </span>
              </div>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex gap-3 mt-5 w-full"
            >
              {[
                { label: 'COURSES', value: stats.racesPlayed, emoji: '🏁' },
                { label: 'VICTOIRES', value: stats.wins, emoji: '🏆' },
                { label: 'PODIUMS', value: stats.podiums, emoji: '🥇' },
              ].map(({ label, value, emoji }) => (
                <div
                  key={label}
                  className="flex-1 rounded-2xl py-3 px-2 text-center"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1.5px solid rgba(255,255,255,0.1)',
                  }}
                >
                  <div style={{ fontSize: 20 }}>{emoji}</div>
                  <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 22, color: '#fff', lineHeight: 1.1, marginTop: 4 }}>
                    {value}
                  </div>
                  <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 6, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>
                    {label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Best Tracks carousel */}
          {bestTracks.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="px-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <span style={{ fontSize: 16 }}>🌟</span>
                <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: stats.player.avatarColor, letterSpacing: 1 }}>
                  CIRCUITS FAVORIS
                </span>
              </div>

              <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
                {bestTracks.map((bt) => {
                  const track = ALL_TRACKS.find((t) => t.id === bt.trackId);
                  if (!track) return null;
                  return (
                    <div
                      key={bt.trackId}
                      className="shrink-0 rounded-2xl overflow-hidden"
                      style={{
                        width: 140,
                        background: 'rgba(255,255,255,0.04)',
                        border: `1.5px solid ${track.accentColor}40`,
                      }}
                    >
                      {/* Thumbnail */}
                      <div className="relative" style={{ height: 80, background: track.accentColor + '50' }}>
                        <div
                          className="absolute inset-0 blur-md"
                          style={{ background: track.accentColor, opacity: imgLoadedMap[bt.trackId] ? 0 : 1, transition: 'opacity 0.4s' }}
                        />
                        <img
                          src={track.image}
                          alt={track.name}
                          className="w-full h-full object-cover"
                          style={{ opacity: imgLoadedMap[bt.trackId] ? 1 : 0, transition: 'opacity 0.4s' }}
                          onLoad={() => setImgLoadedMap((prev) => ({ ...prev, [bt.trackId]: true }))}
                        />
                        <div
                          className="absolute inset-0"
                          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)' }}
                        />
                        {/* Stat badge */}
                        <div
                          className="absolute top-2 right-2 px-1.5 py-0.5 rounded-lg"
                          style={{
                            background: 'rgba(0,0,0,0.7)',
                            border: `1px solid ${track.accentColor}60`,
                            backdropFilter: 'blur(4px)',
                          }}
                        >
                          <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: track.accentColor }}>
                            {bt.topFinishes}x Top3
                          </span>
                        </div>
                      </div>

                      <div className="p-2">
                        <p className="truncate" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 11, color: '#fff' }}>
                          {track.name}
                        </p>
                        <p style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 11, color: track.accentColor, marginTop: 2 }}>
                          {bt.points} pts
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {bestTracks.length === 0 && (
            <div className="px-5 text-center py-6">
              <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>
                Pas encore de courses enregistrées
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Main Page ─────────────────────────────────────────────── */
export default function LeaderboardPage() {
  const { rankedPlayers } = useLeaderboard();
  const [addOpen, setAddOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerStats | null>(null);

  const top3 = rankedPlayers.slice(0, 3);
  const rest = rankedPlayers.slice(3);

  return (
    <>
      <div
        className="relative flex flex-col min-h-full"
        style={{ background: 'linear-gradient(180deg, #0f0c29 0%, #1a1250 40%, #0d0920 100%)' }}
      >
        <StarField />

        {/* Header */}
        <div className="relative z-10 pt-10 pb-2 px-5">
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 16, color: '#FBD000', textShadow: '2px 2px 0 #E52521' }}>
              CLASSEMENT
            </div>
            <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.45)', marginTop: 6 }}>
              {rankedPlayers.length} joueur{rankedPlayers.length !== 1 ? 's' : ''} · Podium du mois
            </p>
          </motion.div>
        </div>

        {/* Podium section */}
        <div className="relative z-10">
          {top3.length >= 2 ? (
            <Podium top3={top3} />
          ) : top3.length === 1 ? (
            <div className="flex flex-col items-center py-8 gap-3">
              <Avatar player={top3[0].player} size={80} glow rank={1} />
              <p style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 12, color: '#FBD000' }}>
                {top3[0].player.name}
              </p>
              <p style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 28, color: '#fff' }}>
                {top3[0].totalPoints} pts
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center py-12 gap-4">
              <div style={{ fontSize: 48 }}>🏆</div>
              <p style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 10, color: 'rgba(255,255,255,0.3)', textAlign: 'center', lineHeight: 2 }}>
                AUCUN JOUEUR<br />POUR L'INSTANT
              </p>
            </div>
          )}
        </div>

        {/* Divider */}
        {rest.length > 0 && (
          <div className="relative z-10 mx-5 my-4 flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
            <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: 'rgba(255,255,255,0.3)', letterSpacing: 1 }}>
              SUITE DU CLASSEMENT
            </span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
          </div>
        )}

        {/* Rest of players (4th+) */}
        <div className="relative z-10 flex-1 px-5 pb-28">
          {rest.map((stats, i) => (
            <RankedRow
              key={stats.player.id}
              stats={stats}
              rank={i + 4}
              onTap={() => setSelectedPlayer(stats)}
            />
          ))}

          {/* Tap to view hint for top 3 */}
          {top3.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {top3.map((stats, i) => (
                <motion.button
                  key={stats.player.id}
                  onClick={() => setSelectedPlayer(stats)}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl"
                  style={{
                    background: `${stats.player.avatarColor}15`,
                    border: `1.5px solid ${stats.player.avatarColor}35`,
                    cursor: 'pointer',
                  }}
                >
                  <span style={{ fontSize: 18 }}>{stats.player.avatarEmoji}</span>
                  <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
                    {stats.player.name}
                  </span>
                  <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: stats.player.avatarColor }}>
                    →
                  </span>
                </motion.button>
              ))}
            </div>
          )}
        </div>

        {/* FAB */}
        <motion.button
          onClick={() => setAddOpen(true)}
          whileTap={{ scale: 0.88 }}
          whileHover={{ scale: 1.08 }}
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="fixed bottom-24 right-5 w-14 h-14 rounded-full flex items-center justify-center z-30"
          style={{
            background: 'linear-gradient(135deg, #FBD000 0%, #E6A800 100%)',
            border: '3px solid #8B4513',
            boxShadow: '0 5px 0 #5C2D0A, 0 8px 24px rgba(251,208,0,0.45)',
          }}
        >
          <span style={{ fontSize: 28, color: '#5C3317', lineHeight: 1, fontWeight: 900 }}>+</span>
        </motion.button>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {addOpen && <AddPlayerModal onClose={() => setAddOpen(false)} />}
      </AnimatePresence>
      <AnimatePresence>
        {selectedPlayer && (
          <PlayerProfileModal stats={selectedPlayer} onClose={() => setSelectedPlayer(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
