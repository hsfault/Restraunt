import { motion } from 'framer-motion';
import { ArrowDownToLine, Printer, RotateCcw, Scissors, Volume2, VolumeX } from 'lucide-react';
import { ease } from '../../lib/motion.js';

// Device-style toolbar under the printer.
export default function ReceiptControls({ active, audio, canTear, busy, onReprint, onTear, onFeed, onReset, onAudio }) {
  const buttons = [
    { id: 'reprint', label: 'Re-print', Icon: Printer, onClick: onReprint },
    { id: 'tear', label: 'Tear', Icon: Scissors, onClick: onTear, disabled: !canTear },
    { id: 'feed', label: 'Feed', Icon: ArrowDownToLine, onClick: onFeed, disabled: !canTear },
    { id: 'reset', label: 'Reset', Icon: RotateCcw, onClick: onReset },
    { id: 'audio', label: 'Audio', Icon: audio ? Volume2 : VolumeX, onClick: onAudio, pressed: audio },
  ];
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-[3] flex justify-center px-2">
    <motion.div
      role="toolbar"
      aria-label="Printer controls"
      className="pointer-events-auto flex gap-1 rounded-[20px] border border-white/60 p-1.5 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.7)]"
      style={{ background: 'rgba(237,230,218,0.82)', backdropFilter: 'blur(16px) saturate(140%)', WebkitBackdropFilter: 'blur(16px) saturate(140%)' }}
      initial={{ y: 120, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 120, opacity: 0 }}
      transition={{ duration: 0.6, ease: ease.ui }}
    >
      {buttons.map(({ id, label, Icon, onClick, disabled, pressed }) => {
        const isActive = active === id || pressed;
        const isTear = id === 'tear' && canTear && !busy;
        return (
          <button
            key={id}
            type="button"
            onClick={onClick}
            disabled={disabled || (busy && id !== 'audio')}
            aria-pressed={id === 'audio' ? audio : undefined}
            className={`flex min-h-[52px] min-w-[56px] flex-col items-center justify-center gap-1 rounded-[14px] px-2 font-mono text-[9px] uppercase tracking-[0.12em] transition-colors duration-200 disabled:opacity-35 sm:min-w-[64px] ${
              isTear
                ? 'ember-pulse bg-ember text-ink'
                : isActive
                  ? 'bg-ink text-bone'
                  : 'text-ink hover:bg-ink/10'
            }`}
          >
            <Icon className="h-4 w-4" strokeWidth={1.75} />
            {label}
          </button>
        );
      })}
    </motion.div>
    </div>
  );
}
