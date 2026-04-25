import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCircuits } from '../context/CircuitsContext';
import { useLeaderboard, TrackLegend } from '../context/LeaderboardContext';
import { ALL_TRACKS, Track } from '../data/tracks';

/* ─── Track Detail Modal ─────────────────────────────────────── */
function TrackDetailModal({ track, onClose }: { track: Track; onClose: () => void }) {
  const { getTrackLegends } = useLeaderboard();
  const legends: TrackLegend[] = getTrackLegends(track.id);
  const [imgLoaded, setImgLoaded] = useState(false);

  const medalColors = ['#FFD700', '#C0C0C0', '#CD7F32'];
  const medalLabels = ['🥇', '🥈', '🥉'];

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
        }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.25)' }} />
        </div>

        {/* Track image */}
        <div className="relative mx-4 mt-2 rounded-2xl overflow-hidden" style={{ height: 160, background: track.accentColor + '50' }}>
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
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)' }}
          />
          <div className="absolute bottom-3 left-4 right-4">
            <p style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 13, color: '#fff', textShadow: '1px 1px 0 rgba(0,0,0,0.8)' }}>
              {track.name}
            </p>
          </div>
          {/* Accent stripe */}
          <div className="absolute top-0 left-0 right-0 h-1" style={{ background: track.accentColor }} />
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontSize: 14, cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>

        {/* Local Legends section */}
        <div className="px-4 py-5 pb-8">
          <div className="flex items-center gap-2 mb-4">
            <span style={{ fontSize: 18 }}>🌟</span>
            <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: track.accentColor, letterSpacing: 1 }}>
              LOCAL LEGENDS
            </span>
          </div>

          {legends.length === 0 ? (
            <div
              className="rounded-2xl py-8 text-center"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1.5px solid rgba(255,255,255,0.08)' }}
            >
              <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>
                Pas encore de courses sur ce circuit
              </p>
              <p style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: 'rgba(255,255,255,0.2)', marginTop: 8 }}>
                Lancez une partie !
              </p>
            </div>
          ) : (
            <div className="flex gap-3">
              {legends.map((legend, i) => (
                <motion.div
                  key={legend.player.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07, type: 'spring', stiffness: 200, damping: 20 }}
                  className="flex-1 flex flex-col items-center gap-2 rounded-2xl py-4 px-2"
                  style={{
                    background: `${legend.player.avatarColor}12`,
                    border: `1.5px solid ${legend.player.avatarColor}35`,
                  }}
                >
                  {/* Medal */}
                  <span style={{ fontSize: 18 }}>{medalLabels[i]}</span>

                  {/* Avatar */}
                  <div
                    className="relative flex items-center justify-center rounded-full"
                    style={{
                      width: 52,
                      height: 52,
                      background: `radial-gradient(circle at 35% 35%, ${legend.player.avatarColor}dd, ${legend.player.avatarColor}88)`,
                      border: `2.5px solid ${medalColors[i]}`,
                      boxShadow: `0 0 14px ${legend.player.avatarColor}50`,
                      fontSize: 24,
                    }}
                  >
                    {legend.player.avatarEmoji}
                  </div>

                  {/* Name */}
                  <p className="truncate w-full text-center" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 12, color: '#fff' }}>
                    {legend.player.name}
                  </p>

                  {/* Stats */}
                  <div className="flex flex-col items-center gap-0.5">
                    <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 16, color: legend.player.avatarColor }}>
                      {legend.trackPoints}
                    </span>
                    <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 6, color: 'rgba(255,255,255,0.4)' }}>
                      PTS
                    </span>
                  </div>

                  {/* Top 3 badge */}
                  {legend.topFinishes > 0 && (
                    <div
                      className="px-2 py-0.5 rounded-full"
                      style={{
                        background: `${legend.player.avatarColor}20`,
                        border: `1px solid ${legend.player.avatarColor}40`,
                      }}
                    >
                      <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 5, color: legend.player.avatarColor }}>
                        {legend.topFinishes}x TOP3
                      </span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Toggle switch ─────────────────────────────────────────── */
function Toggle({ enabled, onChange, color }: { enabled: boolean; onChange: () => void; color: string }) {
  return (
    <motion.button
      onClick={onChange}
      role="switch"
      aria-checked={enabled}
      className="relative shrink-0 focus:outline-none"
      style={{ width: 44, height: 24, borderRadius: 12 }}
      whileTap={{ scale: 0.92 }}
    >
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{ backgroundColor: enabled ? color : '#374151' }}
        transition={{ duration: 0.2 }}
        style={{ border: `2px solid ${enabled ? color : '#4B5563'}`, boxShadow: enabled ? `0 0 10px ${color}60` : 'none' }}
      />
      <motion.div
        className="absolute top-0.5 w-5 h-5 rounded-full bg-white"
        animate={{ x: enabled ? 22 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 28 }}
        style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.4)' }}
      />
    </motion.button>
  );
}

/* ─── Track row ─────────────────────────────────────────────── */
function TrackRow({ track, index, onTapInfo }: { track: Track; index: number; onTapInfo: () => void }) {
  const { toggleTrack, isEnabled } = useCircuits();
  const enabled = isEnabled(track.id);
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.025, type: 'spring', stiffness: 220, damping: 24 }}
      className="flex items-center gap-3 px-4 py-3 rounded-xl mb-2 relative overflow-hidden"
      style={{
        background: enabled
          ? `linear-gradient(135deg, ${track.accentColor}18 0%, rgba(255,255,255,0.04) 100%)`
          : 'rgba(255,255,255,0.03)',
        border: `1.5px solid ${enabled ? track.accentColor + '45' : 'rgba(255,255,255,0.07)'}`,
        transition: 'background 0.25s, border-color 0.25s',
      }}
    >
      {/* Track thumbnail — tappable for detail */}
      <button
        onClick={onTapInfo}
        className="relative shrink-0 rounded-lg overflow-hidden focus:outline-none"
        style={{ width: 52, height: 40, background: track.accentColor + '50', cursor: 'pointer' }}
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
        {!enabled && (
          <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
            <span className="text-white/50 text-base">✕</span>
          </div>
        )}
        {/* "i" overlay hint */}
        <div
          className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.55)', fontSize: 7, color: 'rgba(255,255,255,0.7)', fontWeight: 700 }}
        >
          i
        </div>
      </button>

      {/* Index + name — also tappable */}
      <button
        onClick={onTapInfo}
        className="flex-1 min-w-0 flex items-center gap-2 focus:outline-none text-left"
        style={{ cursor: 'pointer' }}
      >
        <span
          className="shrink-0"
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 7,
            color: enabled ? track.accentColor : 'rgba(255,255,255,0.2)',
            minWidth: 20,
            transition: 'color 0.2s',
          }}
        >
          {String(index + 1).padStart(2, '0')}
        </span>
        <p
          className="truncate"
          style={{
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 800,
            fontSize: 13,
            color: enabled ? '#fff' : 'rgba(255,255,255,0.35)',
            transition: 'color 0.2s',
          }}
        >
          {track.name}
        </p>
      </button>

      {/* Toggle */}
      <Toggle enabled={enabled} onChange={() => toggleTrack(track.id)} color={track.accentColor} />
    </motion.div>
  );
}

/* ─── Main page ─────────────────────────────────────────────── */
export default function CircuitsPage() {
  const { enabledTracks, enableAll, disableAll } = useCircuits();
  const [search, setSearch] = useState('');
  const [detailTrack, setDetailTrack] = useState<Track | null>(null);

  const filteredTracks = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return ALL_TRACKS;
    return ALL_TRACKS.filter((t) => t.name.toLowerCase().includes(q));
  }, [search]);

  const totalEnabled = enabledTracks.length;
  const totalTracks = ALL_TRACKS.length;

  return (
    <>
      <div
        className="flex flex-col min-h-full"
        style={{ background: 'linear-gradient(180deg, #0f0c29 0%, #1a1250 40%, #0d0920 100%)' }}
      >
        {/* Header sticky */}
        <div
          className="sticky top-0 z-30 px-4 pt-10 pb-3"
          style={{ background: 'linear-gradient(180deg, #0f0c29 70%, transparent 100%)', backdropFilter: 'blur(8px)' }}
        >
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-4"
          >
            <h1
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 16,
                color: '#FBD000',
                textShadow: '2px 2px 0 #E52521',
              }}
            >
              CIRCUITS
            </h1>
            <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 6 }}>
              {totalEnabled} / {totalTracks} circuits dans le tirage · Tape 🖼️ pour détails
            </p>
          </motion.div>

          {/* Progress bar */}
          <div className="h-2 rounded-full bg-white/10 mb-4 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #E52521, #FBD000)' }}
              initial={{ width: 0 }}
              animate={{ width: `${(totalEnabled / totalTracks) * 100}%` }}
              transition={{ type: 'spring', stiffness: 120, damping: 18 }}
            />
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-sm">🔍</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un circuit..."
              className="w-full pl-8 pr-4 py-2.5 rounded-xl text-white placeholder-white/30 focus:outline-none"
              style={{
                background: 'rgba(255,255,255,0.07)',
                border: '1.5px solid rgba(255,255,255,0.12)',
                fontFamily: "'Nunito', sans-serif",
                fontSize: 14,
              }}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
                style={{ fontSize: 14 }}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Global actions */}
        <div className="px-4 flex gap-3 mb-4">
          <motion.button
            onClick={enableAll}
            whileTap={{ scale: 0.94 }}
            className="flex-1 py-2.5 rounded-xl"
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 8,
              background: 'linear-gradient(135deg, #43B047, #2E7D32)',
              color: '#fff',
              boxShadow: '0 3px 0 #1B5E20',
              border: '2px solid #1B5E20',
            }}
          >
            ✓ TOUT ACTIVER
          </motion.button>
          <motion.button
            onClick={disableAll}
            whileTap={{ scale: 0.94 }}
            className="flex-1 py-2.5 rounded-xl"
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 8,
              background: 'linear-gradient(135deg, #555, #333)',
              color: 'rgba(255,255,255,0.6)',
              boxShadow: '0 3px 0 #111',
              border: '2px solid #222',
            }}
          >
            ✕ TOUT DÉSACTIVER
          </motion.button>
        </div>

        {/* Track list */}
        <div className="flex-1 px-4 pb-8">
          {filteredTracks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="text-4xl mb-4">🔍</div>
              <p style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>
                Aucun circuit trouvé
              </p>
            </motion.div>
          ) : (
            filteredTracks.map((track) => (
              <TrackRow
                key={track.id}
                track={track}
                index={ALL_TRACKS.indexOf(track)}
                onTapInfo={() => setDetailTrack(track)}
              />
            ))
          )}
        </div>
      </div>

      {/* Track detail modal */}
      <AnimatePresence>
        {detailTrack && (
          <TrackDetailModal track={detailTrack} onClose={() => setDetailTrack(null)} />
        )}
      </AnimatePresence>
    </>
  );
}