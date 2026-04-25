import { useState, useEffect, useRef, useCallback } from 'react';
// Use import.meta.url for reliable Vite asset resolution
const rouletteSrc = new URL('../../imports/sound1-1.mp3', import.meta.url).href;
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { useCircuits } from '../context/CircuitsContext';
import { useLeaderboard } from '../context/LeaderboardContext';
import { StarField } from '../components/StarField';
import { Track, getCupForTrack } from '../data/tracks';
import { RaceRankingSheet } from '../components/RaceRankingSheet';

type Phase = 'idle' | 'shaking' | 'spinning' | 'stopping' | 'revealed';

const SPIN_SEQUENCE: { interval: number; count: number }[] = [
  { interval: 55,  count: 10 },
  { interval: 85,  count: 7  },
  { interval: 130, count: 5  },
  { interval: 200, count: 4  },
  { interval: 320, count: 3  },
  { interval: 480, count: 2  },
  { interval: 700, count: 1  },
];

/* ─── Audio Engine ───────────────────────────────────────────── */
let _audioCtx: AudioContext | null = null;

function getAudioCtx(): AudioContext {
  if (!_audioCtx) {
    _audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return _audioCtx;
}

function initAudio() {
  try {
    const ctx = getAudioCtx();
    if (ctx.state === 'suspended') ctx.resume();
  } catch {}
}

function playStop() {
  try {
    const ctx = getAudioCtx();
    // Descending "landing" whir — signals the machine is locking in
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.connect(g);
    g.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(700, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.35);
    g.gain.setValueAtTime(0.16, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.5);
  } catch {}
}

function playReveal() {
  try {
    const ctx = getAudioCtx();
    // Mario 1-UP style ascending arpeggio: G5 B5 C6 E6 G6 C7
    const notes = [784, 988, 1047, 1319, 1568, 2093];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.connect(g);
      g.connect(ctx.destination);
      osc.type = 'square';
      osc.frequency.value = freq;
      const t = ctx.currentTime + i * 0.075;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.09, t + 0.015);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
      osc.start(t);
      osc.stop(t + 0.3);
    });
  } catch {}
}

/* ─── BlurImage ──────────────────────────────────────────────── */
function BlurImage({ src, color, className }: { src: string; color: string; className?: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={`relative overflow-hidden ${className ?? ''}`} style={{ background: color }}>
      <div
        className="absolute inset-0 blur-lg scale-110"
        style={{ background: color, opacity: loaded ? 0 : 1, transition: 'opacity 0.4s' }}
      />
      <img
        src={src}
        alt=""
        className="w-full h-full object-cover"
        style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.5s' }}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}

/* ─── QuestionBlock ──────────────────────────────────────────── */
function QuestionBlock({ phase, onClick }: { phase: Phase; onClick: () => void }) {
  const isIdle = phase === 'idle';
  return (
    <motion.button
      onClick={onClick}
      disabled={!isIdle}
      aria-label="Tirer un circuit au sort"
      style={{ cursor: isIdle ? 'pointer' : 'default', WebkitTapHighlightColor: 'transparent' }}
      animate={
        phase === 'shaking'
          ? { rotate: [-8, 8, -8, 8, -5, 5, 0], scale: [1, 1.08, 1.08, 1.08, 1.05, 1.05, 1] }
          : { y: [0, -14, 0], rotate: [-1, 1, -1] }
      }
      transition={
        phase === 'shaking'
          ? { duration: 0.45, ease: 'easeInOut' }
          : { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }
      }
      whileTap={isIdle ? { scale: 0.92 } : {}}
      className="relative focus:outline-none"
    >
      <motion.div
        className="absolute inset-0 rounded-3xl"
        style={{ background: 'rgba(251,208,0,0.4)', filter: 'blur(24px)' }}
        animate={{ opacity: [0.5, 1, 0.5], scale: [0.9, 1.1, 0.9] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div
        className="relative w-44 h-44 rounded-2xl flex items-center justify-center"
        style={{
          background: 'linear-gradient(145deg, #FFE040 0%, #FBD000 40%, #E6A800 100%)',
          border: '5px solid #8B4513',
          boxShadow: '0 6px 0 #5C2D0A, inset 0 3px 0 rgba(255,255,255,0.45), 0 10px 40px rgba(0,0,0,0.5)',
        }}
      >
        <div
          className="absolute top-3 left-3 rounded-lg"
          style={{ width: 44, height: 20, background: 'rgba(255,255,240,0.55)', transform: 'rotate(-10deg)' }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 rounded-b-2xl"
          style={{ height: 28, background: 'rgba(0,0,0,0.12)' }}
        />
        <span
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 64,
            color: '#5C3317',
            textShadow: '3px 3px 0 #3D1F0A, -1px -1px 0 rgba(255,255,255,0.2)',
            lineHeight: 1,
            userSelect: 'none',
          }}
        >
          ?
        </span>
      </div>
    </motion.button>
  );
}

/* ─── Reel Card — one card in the scrolling reel ────────────── */
function ReelCard({ track }: { track: Track }) {
  const cup = getCupForTrack(track.id);
  return (
    <motion.div
      initial={{ y: 70, opacity: 0.6, scale: 0.93 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: -70, opacity: 0.6, scale: 0.93 }}
      transition={{ duration: 0.09, ease: 'easeOut' }}
      className="absolute inset-0 rounded-xl overflow-hidden"
      style={{ border: `2px solid ${track.accentColor}70` }}
    >
      <BlurImage src={track.image} color={track.accentColor} className="absolute inset-0" />
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.25) 60%, transparent 100%)' }}
      />
      {/* Scan-line shimmer to signal "rolling" */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'repeating-linear-gradient(0deg, transparent 0px, transparent 3px, rgba(255,255,255,0.025) 3px, rgba(255,255,255,0.025) 4px)',
        }}
        animate={{ backgroundPositionY: ['0px', '8px'] }}
        transition={{ duration: 0.15, repeat: Infinity, ease: 'linear' }}
      />
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <p className="text-white/60 mb-0.5" style={{ fontFamily: "'Nunito', sans-serif", fontSize: 10 }}>
          {cup?.icon} {cup?.name}
        </p>
        <p
          className="text-white"
          style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 10, textShadow: '1px 1px 0 #000' }}
        >
          {track.name}
        </p>
      </div>
    </motion.div>
  );
}

/* ─── Spinning phase — slot-machine reel display ─────────────── */
function SpinDisplay({ displayTrack, animKey }: { displayTrack: Track; animKey: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="flex flex-col items-center gap-4"
    >
      {/* Label above the reel */}
      <div
        className="px-4 py-1.5 rounded-lg"
        style={{
          background: 'rgba(251,208,0,0.1)',
          border: '1.5px solid rgba(251,208,0,0.3)',
        }}
      >
        <motion.p
          animate={{ opacity: [0.45, 1, 0.45] }}
          transition={{ duration: 0.35, repeat: Infinity }}
          style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: '#FBD000', letterSpacing: 2 }}
        >
          🎰 DÉFILEMENT EN COURS...
        </motion.p>
      </div>

      {/* Reel window — slot machine frame */}
      <div
        className="relative rounded-2xl"
        style={{
          width: 280,
          height: 155,
          border: '3px solid rgba(251,208,0,0.35)',
          boxShadow:
            '0 0 35px rgba(251,208,0,0.12), inset 0 0 24px rgba(0,0,0,0.6)',
          background: '#060412',
          overflow: 'hidden',
        }}
      >
        {/* Top vignette — cards "emerge" from darkness */}
        <div
          className="absolute top-0 left-0 right-0 z-10 pointer-events-none"
          style={{
            height: 44,
            background: 'linear-gradient(to bottom, #060412 0%, transparent 100%)',
          }}
        />
        {/* Bottom vignette */}
        <div
          className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none"
          style={{
            height: 44,
            background: 'linear-gradient(to top, #060412 0%, transparent 100%)',
          }}
        />
        {/* Corner bolts — slot machine aesthetic */}
        {[
          'top-1.5 left-1.5',
          'top-1.5 right-1.5',
          'bottom-1.5 left-1.5',
          'bottom-1.5 right-1.5',
        ].map((pos) => (
          <div
            key={pos}
            className={`absolute ${pos} w-2 h-2 rounded-full z-20`}
            style={{ background: 'rgba(251,208,0,0.5)' }}
          />
        ))}

        {/* Scrolling card */}
        <AnimatePresence mode="sync">
          <ReelCard key={animKey} track={displayTrack} />
        </AnimatePresence>
      </div>

      {/* Moving tape indicator below the reel */}
      <div
        className="relative rounded-full overflow-hidden"
        style={{ width: 280, height: 7 }}
      >
        <motion.div
          style={{
            width: '200%',
            height: '100%',
            background:
              'repeating-linear-gradient(90deg, rgba(251,208,0,0.55) 0px, rgba(251,208,0,0.55) 10px, rgba(229,37,33,0.35) 10px, rgba(229,37,33,0.35) 20px)',
          }}
          animate={{ x: ['-50%', '0%'] }}
          transition={{ duration: 0.35, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    </motion.div>
  );
}

/* ─── Stopping phase — "machine is deciding" ─────────────────── */
function StopDisplay() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className="flex flex-col items-center gap-5"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 0.55, repeat: Infinity, ease: 'linear' }}
        style={{ fontSize: 54 }}
      >
        ⭐
      </motion.div>
      <motion.p
        animate={{ opacity: [0.35, 1, 0.35], scale: [0.96, 1.04, 0.96] }}
        transition={{ duration: 0.45, repeat: Infinity }}
        style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 10,
          color: '#FBD000',
          letterSpacing: 2,
          textAlign: 'center',
          lineHeight: 2,
        }}
      >
        SÉLECTION<br />EN COURS...
      </motion.p>
      {/* Pulsing dots */}
      <div className="flex gap-2">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className="rounded-full"
            style={{ width: 8, height: 8, background: '#FBD000' }}
            animate={{ opacity: [0.15, 1, 0.15], scale: [0.75, 1.25, 0.75] }}
            transition={{ duration: 0.55, delay: i * 0.1, repeat: Infinity }}
          />
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Revealed card ──────────────────────────────────────────── */
function RevealCard({ track, onAgain }: { track: Track; onAgain: () => void }) {
  const cup = getCupForTrack(track.id);
  return (
    <motion.div
      initial={{ scale: 0.35, opacity: 0, y: 60 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 220, damping: 18, delay: 0.05 }}
      className="relative w-80 rounded-3xl overflow-hidden"
      style={{
        boxShadow: `0 0 60px ${track.accentColor}80, 0 20px 60px rgba(0,0,0,0.7)`,
        border: `4px solid ${track.accentColor}`,
      }}
    >
      <div className="relative h-52">
        <BlurImage src={track.image} color={track.accentColor} className="absolute inset-0" />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%)' }}
        />
        <motion.div
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(8px)',
            border: `1.5px solid ${track.accentColor}50`,
          }}
        >
          <span className="text-base">{cup?.icon}</span>
          <span className="text-white text-xs" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700 }}>
            {cup?.name}
          </span>
          {cup?.category === 'retro' && (
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/20 text-white/80 ml-1">
              RETRO
            </span>
          )}
        </motion.div>
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute top-3 right-3"
        >
          <span
            className="px-2 py-1 rounded-lg"
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 7,
              color: '#FBD000',
              background: 'rgba(0,0,0,0.7)',
              border: '1px solid rgba(251,208,0,0.4)',
              letterSpacing: 1,
            }}
          >
            TON CIRCUIT
          </span>
        </motion.div>
      </div>

      <div
        className="px-5 py-5"
        style={{ background: 'linear-gradient(135deg, #1a1035 0%, #0f0c29 100%)' }}
      >
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
          className="text-white mb-4 leading-snug"
          style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 14 }}
        >
          {track.name}
        </motion.h2>

        {track.era && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="mb-4"
          >
            <span
              className="px-3 py-1 rounded-full text-xs"
              style={{
                background: `${track.accentColor}30`,
                border: `1px solid ${track.accentColor}60`,
                color: track.accentColor,
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 800,
              }}
            >
              Issu de {track.era}
            </span>
          </motion.div>
        )}

        <div
          className="h-1 rounded-full mb-5"
          style={{ background: `linear-gradient(90deg, ${track.accentColor}, transparent)` }}
        />

        <motion.button
          onClick={onAgain}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          whileTap={{ scale: 0.94 }}
          whileHover={{ scale: 1.03 }}
          className="w-full py-3.5 rounded-xl"
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 10,
            background: 'linear-gradient(135deg, #E52521 0%, #C41010 100%)',
            color: '#FBD000',
            border: '3px solid #8B0000',
            boxShadow: '0 4px 0 #5C0000, 0 6px 20px rgba(229,37,33,0.4)',
            letterSpacing: 1,
          }}
        >
          🎲 RELANCER
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ─── Main page ──────────────────────────────────────────────── */
export default function RandomizerPage() {
  const { enabledTracks } = useCircuits();
  const { addRaceResult } = useLeaderboard();
  const [phase, setPhase] = useState<Phase>('idle');
  const [displayTrack, setDisplayTrack] = useState<Track | null>(null);
  const [animKey, setAnimKey] = useState(0);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [rankingOpen, setRankingOpen] = useState(false);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const rouletteAudioRef = useRef<HTMLAudioElement | null>(null);

  // Create the roulette audio element once
  useEffect(() => {
    const audio = new Audio(rouletteSrc);
    audio.loop = false;
    audio.volume = 0.85;
    rouletteAudioRef.current = audio;
    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  const stopRoulette = () => {
    const audio = rouletteAudioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
  };

  const randomTrack = useCallback(() => {
    const pool = enabledTracks;
    return pool[Math.floor(Math.random() * pool.length)];
  }, [enabledTracks]);

  const clearTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  const fireConfetti = () => {
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.55 }, colors: ['#E52521', '#FBD000', '#049CD8', '#43B047', '#FF69B4', '#fff'] });
    setTimeout(() => confetti({ particleCount: 60, spread: 120, angle: 60,  origin: { x: 0, y: 0.6 }, colors: ['#FBD000', '#E52521'] }), 200);
    setTimeout(() => confetti({ particleCount: 60, spread: 120, angle: 120, origin: { x: 1, y: 0.6 }, colors: ['#049CD8', '#43B047'] }), 300);
  };

  const startSpin = useCallback(() => {
    if (enabledTracks.length === 0) return;
    clearTimeouts();

    // Resume audio context on the click gesture (required on mobile)
    initAudio();

    const chosen = randomTrack();
    setPhase('shaking');

    const t1 = setTimeout(() => {
      setPhase('spinning');
      setDisplayTrack(randomTrack());
      setAnimKey((k) => k + 1);

      // Start roulette sound (plays once from beginning)
      const audio = rouletteAudioRef.current;
      if (audio) {
        audio.currentTime = 0;
        audio.volume = 0.85;
        audio.play().catch(() => {});
      }

      let delay = 0;

      SPIN_SEQUENCE.forEach(({ interval, count }) => {
        for (let i = 0; i < count; i++) {
          delay += interval;
          const t = setTimeout(() => {
            setDisplayTrack(randomTrack());
            setAnimKey((k) => k + 1);
          }, delay);
          timeoutsRef.current.push(t);
        }
      });

      // ── Stopping phase: reel is gone, machine "decides" ──────
      const tStop = setTimeout(() => {
        setPhase('stopping');
        stopRoulette();
        playStop();
      }, delay + 150);
      timeoutsRef.current.push(tStop);

      // ── Reveal: result card + fanfare ────────────────────────
      const tReveal = setTimeout(() => {
        setSelectedTrack(chosen);
        setPhase('revealed');
        playReveal();
        fireConfetti();
      }, delay + 150 + 380);
      timeoutsRef.current.push(tReveal);
    }, 470);

    timeoutsRef.current.push(t1);
  }, [enabledTracks, randomTrack]);

  const reset = () => {
    clearTimeouts();
    stopRoulette();
    setPhase('idle');
    setDisplayTrack(null);
    setSelectedTrack(null);
  };

  useEffect(() => () => {
    clearTimeouts();
    stopRoulette();
  }, []);

  const enabledCount = enabledTracks.length;

  return (
    <>
      <div
        className="relative flex flex-col min-h-full overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #0f0c29 0%, #1a1250 40%, #0d0920 100%)' }}
      >
        <StarField />

        {/* Header */}
        <div className="relative z-10 pt-10 pb-4 text-center px-4">
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 18 }}
          >
            <div
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 20,
                color: '#FBD000',
                textShadow: '3px 3px 0 #E52521, 5px 5px 0 rgba(0,0,0,0.4)',
                letterSpacing: 2,
              }}
            >
              MARIO KART
            </div>
            <div
              className="mt-1"
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 10,
                color: 'rgba(255,255,255,0.6)',
                letterSpacing: 3,
              }}
            >
              CIRCUIT ALÉATOIRE
            </div>
          </motion.div>
        </div>

        {/* Main area */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pb-8 gap-8">
          {/* Track count badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="px-4 py-2 rounded-full"
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
              🏁 {enabledCount} circuit{enabledCount !== 1 ? 's' : ''} dans le pool
            </span>
          </motion.div>

          {/* Central content — phases */}
          <AnimatePresence mode="wait">

            {/* ── IDLE ── */}
            {phase === 'idle' && (
              <motion.div
                key="idle"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                className="flex flex-col items-center gap-8"
              >
                <QuestionBlock phase={phase} onClick={startSpin} />
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                  className="text-center"
                >
                  <span
                    style={{
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: 9,
                      color: 'rgba(255,255,255,0.55)',
                      letterSpacing: 2,
                    }}
                  >
                    TAPE LE BLOC POUR RÉVÉLER
                  </span>
                </motion.div>
              </motion.div>
            )}

            {/* ── SHAKING ── */}
            {phase === 'shaking' && (
              <motion.div key="shaking" className="flex flex-col items-center gap-8">
                <QuestionBlock phase={phase} onClick={() => {}} />
              </motion.div>
            )}

            {/* ── SPINNING — slot machine reel ── */}
            {phase === 'spinning' && displayTrack && (
              <motion.div
                key="spinning"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <SpinDisplay displayTrack={displayTrack} animKey={animKey} />
              </motion.div>
            )}

            {/* ── STOPPING — "la machine choisit" ── */}
            {phase === 'stopping' && (
              <motion.div
                key="stopping"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <StopDisplay />
              </motion.div>
            )}

            {/* ── REVEALED ── */}
            {phase === 'revealed' && selectedTrack && (
              <motion.div
                key="revealed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-3"
              >
                <motion.div
                  className="text-3xl mb-1"
                  animate={{ rotate: [0, 15, -15, 10, -10, 0], scale: [1, 1.2, 1.2, 1.1, 1.1, 1] }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  🎉
                </motion.div>
                <RevealCard track={selectedTrack} onAgain={reset} />
                {/* Saisir les résultats button */}
                <motion.button
                  onClick={() => setRankingOpen(true)}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  whileTap={{ scale: 0.94 }}
                  whileHover={{ scale: 1.03 }}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl"
                  style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: 9,
                    background: 'linear-gradient(135deg, #7C3AED 0%, #4C1D95 100%)',
                    color: '#fff',
                    border: '3px solid #6D28D9',
                    boxShadow: '0 4px 0 #3B0764, 0 6px 20px rgba(124,58,237,0.4)',
                    letterSpacing: 1,
                    cursor: 'pointer',
                  }}
                >
                  🏆 SAISIR LES RÉSULTATS
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Idle decorative coins */}
          {phase === 'idle' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex gap-4"
            >
              {['🪙', '⭐', '🍄', '⭐', '🪙'].map((e, i) => (
                <motion.span
                  key={i}
                  style={{ fontSize: 20, opacity: 0.5 }}
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 1.5, delay: i * 0.15, repeat: Infinity, ease: 'easeInOut' }}
                >
                  {e}
                </motion.span>
              ))}
            </motion.div>
          )}
        </div>

        {/* Racetrack floor */}
        <div
          className="relative z-10 h-6 shrink-0"
          style={{
            background: 'repeating-linear-gradient(90deg, #111 0px, #111 20px, #fff 20px, #fff 40px)',
            opacity: 0.12,
          }}
        />
      </div>

      {/* Race ranking sheet */}
      <AnimatePresence>
        {rankingOpen && selectedTrack && (
          <RaceRankingSheet
            track={selectedTrack}
            onClose={() => setRankingOpen(false)}
            onValidate={(rankings) => {
              addRaceResult(selectedTrack.id, rankings);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}