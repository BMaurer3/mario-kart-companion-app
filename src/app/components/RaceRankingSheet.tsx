import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLeaderboard } from '../context/LeaderboardContext';
import { Track } from '../data/tracks';

const POSITION_STYLES: Record<number, { bg: string; border: string; label: string }> = {
  1: { bg: 'linear-gradient(135deg, #FFD700, #FFA500)', border: '#FF8C00', label: '🥇' },
  2: { bg: 'linear-gradient(135deg, #C0C0C0, #A9A9A9)', border: '#888', label: '🥈' },
  3: { bg: 'linear-gradient(135deg, #CD7F32, #A0522D)', border: '#7B3F00', label: '🥉' },
};

function positionStyle(pos: number) {
  if (pos <= 3) return POSITION_STYLES[pos];
  return {
    bg: `linear-gradient(135deg, #7C3AED, #4C1D95)`,
    border: '#6D28D9',
    label: `${pos}`,
  };
}

interface Props {
  track: Track;
  onClose: () => void;
  onValidate: (rankings: { playerId: string; position: number }[]) => void;
}

export function RaceRankingSheet({ track, onClose, onValidate }: Props) {
  const { players } = useLeaderboard();
  // assignments[i] = playerId assigned to position (i+1)
  const [assignments, setAssignments] = useState<string[]>([]);
  const [imgLoaded, setImgLoaded] = useState(false);

  const assignedSet = new Set(assignments);

  const handleTap = (playerId: string) => {
    if (assignedSet.has(playerId)) return; // already ranked — use undo
    setAssignments((prev) => [...prev, playerId]);
  };

  const handleUndo = () => {
    setAssignments((prev) => prev.slice(0, -1));
  };

  const handleValidate = () => {
    const rankings = assignments.map((playerId, i) => ({
      playerId,
      position: i + 1,
    }));
    onValidate(rankings);
    onClose();
  };

  const getPosition = (playerId: string): number | null => {
    const idx = assignments.indexOf(playerId);
    return idx >= 0 ? idx + 1 : null;
  };

  const allRanked = assignments.length === players.length;
  const someRanked = assignments.length > 0;

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
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 280, damping: 28 }}
        className="w-full max-w-[430px] rounded-t-3xl overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #1a1250 0%, #0f0c29 100%)',
          border: '2px solid rgba(251,208,0,0.25)',
          borderBottom: 'none',
          maxHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.25)' }} />
        </div>

        {/* Header with track info */}
        <div
          className="flex items-center gap-3 px-5 py-3 shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
        >
          {/* Track thumbnail */}
          <div
            className="relative rounded-xl overflow-hidden shrink-0"
            style={{ width: 56, height: 42, background: track.accentColor + '50' }}
          >
            <div
              className="absolute inset-0 blur-md"
              style={{ background: track.accentColor, opacity: imgLoaded ? 0 : 1, transition: 'opacity 0.4s' }}
            />
            <img
              src={track.image}
              alt={track.name}
              className="w-full h-full object-cover"
              style={{ opacity: imgLoaded ? 1 : 0, transition: 'opacity 0.4s' }}
              onLoad={() => setImgLoaded(true)}
            />
          </div>

          <div className="flex-1 min-w-0">
            <p style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: 'rgba(255,255,255,0.45)', letterSpacing: 1 }}>
              RÉSULTATS DE LA COURSE
            </p>
            <p className="truncate mt-1" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 15, color: '#fff' }}>
              {track.name}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)', fontSize: 14, cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>

        {/* Instructions */}
        <div className="px-5 pt-4 pb-2 shrink-0">
          <div className="flex items-center justify-between">
            <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
              Tape les joueurs dans l'ordre d'arrivée
            </p>
            <div className="flex items-center gap-2">
              <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: '#FBD000' }}>
                {assignments.length}/{players.length}
              </span>
              {someRanked && (
                <motion.button
                  onClick={handleUndo}
                  whileTap={{ scale: 0.88 }}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg"
                  style={{
                    background: 'rgba(229,37,33,0.15)',
                    border: '1px solid rgba(229,37,33,0.3)',
                    color: '#F87171',
                    fontFamily: "'Nunito', sans-serif",
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  ↩ Undo
                </motion.button>
              )}
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 rounded-full mt-2 overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #FBD000, #E52521)' }}
              animate={{ width: `${(assignments.length / Math.max(players.length, 1)) * 100}%` }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            />
          </div>
        </div>

        {/* Players grid */}
        <div className="flex-1 overflow-y-auto px-5 py-3">
          <div className="grid grid-cols-3 gap-3">
            {players.map((player) => {
              const position = getPosition(player.id);
              const isRanked = position !== null;
              const pStyle = position ? positionStyle(position) : null;

              return (
                <motion.button
                  key={player.id}
                  onClick={() => handleTap(player.id)}
                  whileTap={!isRanked ? { scale: 0.88 } : {}}
                  animate={isRanked ? { scale: [1, 1.08, 1] } : {}}
                  className="flex flex-col items-center gap-2 py-3 px-2 rounded-2xl relative"
                  style={{
                    background: isRanked
                      ? `${player.avatarColor}18`
                      : 'rgba(255,255,255,0.04)',
                    border: isRanked
                      ? `2px solid ${player.avatarColor}60`
                      : '2px solid rgba(255,255,255,0.08)',
                    opacity: !isRanked && assignedSet.size > 0 ? 0.5 : 1,
                    cursor: isRanked ? 'default' : 'pointer',
                    transition: 'opacity 0.2s',
                    boxShadow: isRanked ? `0 0 16px ${player.avatarColor}40` : 'none',
                  }}
                >
                  {/* Position badge */}
                  <AnimatePresence>
                    {isRanked && pStyle && (
                      <motion.div
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                        className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center z-10"
                        style={{
                          background: pStyle.bg,
                          border: `2px solid ${pStyle.border}`,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                          fontSize: position <= 3 ? 14 : 10,
                          fontFamily: position > 3 ? "'Press Start 2P', monospace" : 'inherit',
                          color: position > 3 ? '#fff' : 'inherit',
                        }}
                      >
                        {pStyle.label}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Avatar circle */}
                  <div
                    className="relative flex items-center justify-center rounded-full"
                    style={{
                      width: 60,
                      height: 60,
                      background: `radial-gradient(circle at 35% 35%, ${player.avatarColor}dd, ${player.avatarColor}88)`,
                      border: isRanked ? `3px solid ${player.avatarColor}` : '3px solid rgba(255,255,255,0.1)',
                      boxShadow: isRanked
                        ? `0 0 20px ${player.avatarColor}60, inset 0 2px 0 rgba(255,255,255,0.3)`
                        : 'inset 0 2px 0 rgba(255,255,255,0.15)',
                      fontSize: 26,
                    }}
                  >
                    {player.avatarEmoji}
                  </div>

                  {/* Name */}
                  <span
                    className="truncate w-full text-center"
                    style={{
                      fontFamily: "'Nunito', sans-serif",
                      fontWeight: 800,
                      fontSize: 12,
                      color: isRanked ? '#fff' : 'rgba(255,255,255,0.5)',
                    }}
                  >
                    {player.name}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="px-5 pt-3 pb-6 shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <motion.button
            onClick={handleValidate}
            disabled={assignments.length < 2}
            whileTap={assignments.length >= 2 ? { scale: 0.94 } : {}}
            animate={allRanked ? { scale: [1, 1.03, 1] } : {}}
            transition={{ duration: 0.4, repeat: allRanked ? Infinity : 0, repeatType: 'reverse' }}
            className="w-full py-4 rounded-2xl"
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 11,
              background: assignments.length >= 2
                ? 'linear-gradient(135deg, #FBD000 0%, #E6A800 100%)'
                : 'rgba(255,255,255,0.08)',
              color: assignments.length >= 2 ? '#5C3317' : 'rgba(255,255,255,0.25)',
              border: assignments.length >= 2 ? '3px solid #8B4513' : '3px solid transparent',
              boxShadow: assignments.length >= 2
                ? '0 5px 0 #5C2D0A, 0 8px 24px rgba(251,208,0,0.35)'
                : 'none',
              cursor: assignments.length >= 2 ? 'pointer' : 'not-allowed',
              letterSpacing: 1,
              transition: 'all 0.2s',
            }}
          >
            {allRanked ? '🏆 VALIDER LES RÉSULTATS' : `📋 VALIDER (${assignments.length}/${players.length})`}
          </motion.button>
          {assignments.length < 2 && (
            <p className="text-center mt-2" style={{ fontFamily: "'Nunito', sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>
              Classe au moins 2 joueurs pour valider
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
