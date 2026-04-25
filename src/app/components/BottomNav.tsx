import { NavLink } from 'react-router';
import { motion } from 'motion/react';

function QuestionIcon({ active }: { active: boolean }) {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
      <rect x="2" y="2" width="22" height="22" rx="5" fill={active ? '#FBD000' : '#ffffff30'} stroke={active ? '#C8960C' : 'transparent'} strokeWidth="2"/>
      {active && <rect x="4" y="4" width="8" height="4" rx="2" fill="#FFE97A" opacity="0.6"/>}
      <text x="13" y="18" textAnchor="middle" fontSize="13" fontWeight="bold" fill={active ? '#5C3317' : '#ffffff80'} fontFamily="sans-serif">?</text>
    </svg>
  );
}

function FlagIcon({ active }: { active: boolean }) {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
      <rect x="5" y="4" width="2" height="18" rx="1" fill={active ? '#FBD000' : '#ffffff50'}/>
      <path d="M7 4 L22 8 L7 12 Z" fill={active ? '#FBD000' : '#ffffff50'}/>
      {active && (
        <>
          <rect x="10" y="5" width="3" height="3" fill="#5C3317" opacity="0.6"/>
          <rect x="16" y="5" width="3" height="3" fill="#fff" opacity="0.4"/>
          <rect x="10" y="8" width="3" height="3" fill="#fff" opacity="0.4"/>
          <rect x="16" y="8" width="3" height="3" fill="#5C3317" opacity="0.6"/>
        </>
      )}
    </svg>
  );
}

function TrophyIcon({ active }: { active: boolean }) {
  const c = active ? '#FBD000' : 'rgba(255,255,255,0.5)';
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
      {/* Cup body */}
      <path d="M8 5 H18 V13 C18 17 14 19 13 19 C12 19 8 17 8 13 Z" fill={active ? '#FBD000' : 'rgba(255,255,255,0.25)'} stroke={active ? '#C8960C' : 'transparent'} strokeWidth="1"/>
      {/* Handles */}
      <path d="M8 8 C5 8 4 11 6 12 L8 12" stroke={c} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M18 8 C21 8 22 11 20 12 L18 12" stroke={c} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      {/* Base */}
      <rect x="10" y="19" width="6" height="2" rx="1" fill={c}/>
      <rect x="8" y="21" width="10" height="2" rx="1" fill={c}/>
      {/* Shine */}
      {active && <ellipse cx="11" cy="10" rx="1.5" ry="2.5" fill="rgba(255,255,255,0.4)" transform="rotate(-15 11 10)"/>}
    </svg>
  );
}

function InfoIcon({ active }: { active: boolean }) {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
      <circle cx="13" cy="13" r="10" fill={active ? '#C084FC' : '#ffffff20'} stroke={active ? '#9333EA' : 'transparent'} strokeWidth="1.5"/>
      {active && <circle cx="13" cy="13" r="10" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1"/>}
      <rect x="10.5" y="12" width="5" height="7" rx="1.5" fill={active ? '#fff' : '#ffffff70'}/>
      <rect x="10.5" y="9" width="5" height="2.5" rx="1.25" fill={active ? '#fff' : '#ffffff70'}/>
    </svg>
  );
}

const TABS = [
  { path: '/',            label: 'Aléatoire', icon: QuestionIcon },
  { path: '/circuits',   label: 'Circuits',  icon: FlagIcon      },
  { path: '/scores',     label: 'Scores',    icon: TrophyIcon    },
  { path: '/info',       label: 'Infos',     icon: InfoIcon      },
];

export function BottomNav() {
  return (
    <nav
      className="relative z-50 flex items-center justify-around px-2 py-2 shrink-0"
      style={{
        background: 'linear-gradient(180deg, #C41010 0%, #8B0000 100%)',
        borderTop: '3px solid #FBD000',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.5)',
        paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 8px)',
      }}
    >
      {TABS.map(({ path, label, icon: Icon }) => (
        <NavLink key={path} to={path} end className="flex-1">
          {({ isActive }) => (
            <motion.div
              className="flex flex-col items-center gap-1 py-1 relative"
              whileTap={{ scale: 0.88 }}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute -inset-x-2 -inset-y-1 rounded-xl"
                  style={{ background: 'rgba(251,208,0,0.18)', border: '1.5px solid rgba(251,208,0,0.35)' }}
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <div className="relative z-10">
                <Icon active={isActive} />
              </div>
              <span
                className="relative z-10 tracking-wide"
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  color: isActive ? '#FBD000' : 'rgba(255,255,255,0.5)',
                  fontSize: 7,
                }}
              >
                {label}
              </span>
            </motion.div>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
