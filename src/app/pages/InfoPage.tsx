import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { StarField } from '../components/StarField';

/* ─── Logo Mario Kart ─────────────────────────────────────────── */
function AppLogo() {
  return (
    <div className="flex flex-col items-center gap-3">
      {/* Bloc ? stylisé comme logo */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        className="relative"
      >
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{ background: 'rgba(251,208,0,0.45)', filter: 'blur(20px)' }}
          animate={{ opacity: [0.5, 1, 0.5], scale: [0.85, 1.1, 0.85] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div
          className="relative w-24 h-24 rounded-2xl flex items-center justify-center"
          style={{
            background: 'linear-gradient(145deg, #FFE040 0%, #FBD000 40%, #E6A800 100%)',
            border: '4px solid #8B4513',
            boxShadow: '0 5px 0 #5C2D0A, inset 0 3px 0 rgba(255,255,255,0.4), 0 8px 30px rgba(0,0,0,0.5)',
          }}
        >
          <div
            className="absolute top-2 left-2 rounded-md"
            style={{ width: 28, height: 12, background: 'rgba(255,255,240,0.5)', transform: 'rotate(-10deg)' }}
          />
          <span
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 40,
              color: '#5C3317',
              textShadow: '2px 2px 0 #3D1F0A',
              lineHeight: 1,
              userSelect: 'none',
            }}
          >
            ?
          </span>
        </div>
      </motion.div>

      {/* Nom de l'app */}
      <div className="text-center">
        <div
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 16,
            color: '#FBD000',
            textShadow: '2px 2px 0 #E52521, 4px 4px 0 rgba(0,0,0,0.4)',
            letterSpacing: 1,
          }}
        >
          MARIO KART
        </div>
        <div
          className="mt-1"
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 8,
            color: 'rgba(255,255,255,0.6)',
            letterSpacing: 2,
          }}
        >
          COMPANION APP
        </div>
        <div
          className="mt-0.5"
          style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: 10,
            color: 'rgba(255,255,255,0.35)',
            letterSpacing: 1,
          }}
        >
          v1.0 · Édition Bureau
        </div>
      </div>
    </div>
  );
}

/* ─── Section Remerciements ───────────────────────────────────── */
function ThanksSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="w-full rounded-2xl overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(91,47,153,0.35) 0%, rgba(30,20,80,0.5) 100%)',
        border: '1.5px solid rgba(180,100,255,0.25)',
      }}
    >
      {/* Header section */}
      <div
        className="px-5 py-3 flex items-center gap-2"
        style={{
          background: 'rgba(180,100,255,0.12)',
          borderBottom: '1px solid rgba(180,100,255,0.2)',
        }}
      >
        <span style={{ fontSize: 18 }}>🏆</span>
        <span
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 8,
            color: '#C084FC',
            letterSpacing: 1,
          }}
        >
          REMERCIEMENTS
        </span>
      </div>

      <div className="px-5 py-5 flex flex-col items-center gap-4">
        {/* Avatar + nom */}
        <motion.div
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="w-20 h-20 rounded-full flex items-center justify-center text-4xl"
          style={{
            background: 'linear-gradient(135deg, #7C3AED 0%, #4C1D95 100%)',
            border: '3px solid rgba(180,100,255,0.5)',
            boxShadow: '0 0 24px rgba(124,58,237,0.5)',
          }}
        >
          🏀
        </motion.div>

        <div className="text-center">
          <div
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 13,
              color: '#FBD000',
              textShadow: '1px 1px 0 rgba(0,0,0,0.5)',
            }}
          >
            Bryan
          </div>
          <div className="flex flex-col items-center gap-1.5 mt-3">
            {[
              { icon: '💻', label: 'Développeur' },
              { icon: '🎨', label: 'Designer' },
              { icon: '🏀', label: 'Président de la DBA' },
            ].map(({ icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                }}
              >
                <span style={{ fontSize: 14 }}>{icon}</span>
                <span
                  style={{
                    fontFamily: "'Nunito', sans-serif",
                    fontWeight: 700,
                    fontSize: 13,
                    color: 'rgba(255,255,255,0.8)',
                  }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <p
          className="text-center mt-1"
          style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: 12,
            color: 'rgba(255,255,255,0.45)',
            fontStyle: 'italic',
            lineHeight: 1.6,
          }}
        >
          Dotscreen Basketball Association
        </p>
      </div>
    </motion.div>
  );
}

/* ─── Modal Demande ───────────────────────────────────────────── */
function RequestModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('');
  const [request, setRequest] = useState('');

  const handleSend = () => {
    if (!request.trim()) return;
    const subject = encodeURIComponent('Demande Mario Kart Companion App');
    const body = encodeURIComponent(
      `Bonjour,\n\nNom : ${name || 'Anonyme'}\n\nDemande :\n${request}\n\n— Envoyé depuis Mario Kart Companion App`
    );
    window.location.href = `mailto:bmaurer.pro@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center p-4 pb-6"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ y: 80, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 80, opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
        className="w-full max-w-sm rounded-3xl overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #1a1250 0%, #0f0c29 100%)',
          border: '2px solid rgba(251,208,0,0.3)',
          boxShadow: '0 -8px 40px rgba(0,0,0,0.6), 0 0 60px rgba(251,208,0,0.08)',
        }}
      >
        {/* Header modal */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{
            background: 'rgba(251,208,0,0.08)',
            borderBottom: '1px solid rgba(251,208,0,0.15)',
          }}
        >
          <div className="flex items-center gap-2">
            <span style={{ fontSize: 20 }}>💡</span>
            <span
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 8,
                color: '#FBD000',
                letterSpacing: 1,
              }}
            >
              NOUVELLE DEMANDE
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'rgba(255,255,255,0.6)',
              fontSize: 16,
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        </div>

        <div className="px-5 py-5 flex flex-col gap-4">
          <p
            style={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: 13,
              color: 'rgba(255,255,255,0.6)',
              lineHeight: 1.6,
            }}
          >
            Tu as une idée de feature ? Décris-la ci-dessous et Bryan s'en occupera peut-être 👀
          </p>

          {/* Champ Nom */}
          <div className="flex flex-col gap-1.5">
            <label
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 7,
                color: 'rgba(255,255,255,0.45)',
                letterSpacing: 1,
              }}
            >
              TON PRÉNOM
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ex: Luigi"
              className="w-full px-4 py-3 rounded-xl outline-none"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1.5px solid rgba(255,255,255,0.15)',
                color: '#fff',
                fontFamily: "'Nunito', sans-serif",
                fontSize: 14,
                fontWeight: 600,
              }}
            />
          </div>

          {/* Champ Demande */}
          <div className="flex flex-col gap-1.5">
            <label
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 7,
                color: 'rgba(255,255,255,0.45)',
                letterSpacing: 1,
              }}
            >
              TA DEMANDE
            </label>
            <textarea
              value={request}
              onChange={(e) => setRequest(e.target.value)}
              placeholder="ex: Ajouter un mode tournoi, un historique des circuits..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl outline-none resize-none"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1.5px solid rgba(255,255,255,0.15)',
                color: '#fff',
                fontFamily: "'Nunito', sans-serif",
                fontSize: 14,
                fontWeight: 600,
                lineHeight: 1.5,
              }}
            />
          </div>

          {/* Bouton Envoyer */}
          <motion.button
            onClick={handleSend}
            disabled={!request.trim()}
            whileTap={{ scale: 0.94 }}
            whileHover={{ scale: 1.02 }}
            className="w-full py-4 rounded-xl"
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 10,
              background: request.trim()
                ? 'linear-gradient(135deg, #FBD000 0%, #E6A800 100%)'
                : 'rgba(255,255,255,0.1)',
              color: request.trim() ? '#5C3317' : 'rgba(255,255,255,0.3)',
              border: request.trim() ? '3px solid #8B4513' : '3px solid transparent',
              boxShadow: request.trim()
                ? '0 4px 0 #5C2D0A, 0 6px 20px rgba(251,208,0,0.3)'
                : 'none',
              cursor: request.trim() ? 'pointer' : 'not-allowed',
              letterSpacing: 1,
              transition: 'all 0.2s',
            }}
          >
            📧 ENVOYER
          </motion.button>

          <p
            className="text-center"
            style={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: 10,
              color: 'rgba(255,255,255,0.25)',
            }}
          >
            Ouvrira ton client mail
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Section Demande ─────────────────────────────────────────── */
function RequestSection({ onOpen }: { onOpen: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="w-full rounded-2xl overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(229,37,33,0.2) 0%, rgba(30,10,20,0.5) 100%)',
        border: '1.5px solid rgba(229,37,33,0.25)',
      }}
    >
      <div
        className="px-5 py-3 flex items-center gap-2"
        style={{
          background: 'rgba(229,37,33,0.1)',
          borderBottom: '1px solid rgba(229,37,33,0.2)',
        }}
      >
        <span style={{ fontSize: 18 }}>🌟</span>
        <span
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 8,
            color: '#F87171',
            letterSpacing: 1,
          }}
        >
          DEMANDER UNE FEATURE
        </span>
      </div>

      <div className="px-5 py-5 flex flex-col items-center gap-4">
        <p
          className="text-center"
          style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: 14,
            color: 'rgba(255,255,255,0.7)',
            lineHeight: 1.6,
          }}
        >
          Une idée pour améliorer l'app ? Envoie ta suggestion à Bryan directement 🚀
        </p>

        <motion.button
          onClick={onOpen}
          whileTap={{ scale: 0.93 }}
          whileHover={{ scale: 1.03 }}
          className="px-6 py-3.5 rounded-xl"
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 9,
            background: 'linear-gradient(135deg, #E52521 0%, #C41010 100%)',
            color: '#FBD000',
            border: '3px solid #8B0000',
            boxShadow: '0 4px 0 #5C0000, 0 6px 20px rgba(229,37,33,0.35)',
            letterSpacing: 1,
            cursor: 'pointer',
          }}
        >
          💌 FAIRE UNE DEMANDE
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ─── Page principale ─────────────────────────────────────────── */
export default function InfoPage() {
  const [modalOpen, setModalOpen] = useState(false);

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
                fontSize: 11,
                color: 'rgba(255,255,255,0.5)',
                letterSpacing: 3,
              }}
            >
              À PROPOS
            </div>
          </motion.div>
        </div>

        {/* Contenu principal */}
        <div className="relative z-10 flex-1 flex flex-col items-center px-5 pb-10 gap-7">
          {/* Logo + nom */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 0.1 }}
          >
            <AppLogo />
          </motion.div>

          {/* Divider étoiles */}
          <div className="flex items-center gap-2 w-full">
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
            <span style={{ fontSize: 12, opacity: 0.4 }}>⭐ ⭐ ⭐</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
          </div>

          {/* Remerciements */}
          <ThanksSection />

          {/* Demande */}
          <RequestSection onOpen={() => setModalOpen(true)} />

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center"
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 7,
              color: 'rgba(255,255,255,0.2)',
              letterSpacing: 1,
              lineHeight: 2,
            }}
          >
            MADE WITH ❤️ AT DOTSCREEN<br />
            © 2025 · ALL RIGHTS RESERVED
          </motion.p>
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

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && <RequestModal onClose={() => setModalOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
