import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useUI } from '../store/ui.js';
import { ease } from '../lib/motion.js';

export const PAGE_LABELS = { '/': 'SALTFIRE', '/menu': 'MENU', '/bag': 'YOUR BAG', '/reserve': 'RESERVE' };
export const labelFor = (path) => PAGE_LABELS[path] ?? 'LOST';

function Label() {
  const label = useUI((s) => s.destLabel);
  return <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-ink">{label}</span>;
}

// A bone curtain rises over the old page, the scroll resets while covered,
// then the curtain carries on upward to reveal the new page.
export default function PageTransition({ children }) {
  const reduced = useReducedMotion();
  const [first] = useState(() => !useUI.getState().navigated);
  const base = 'pointer-events-none fixed inset-0 z-curtain flex items-center justify-center bg-bone';

  if (reduced) {
    return (
      <>
        {children}
        <motion.div aria-hidden className={base} initial={{ opacity: first ? 0 : 1 }} animate={{ opacity: 0 }} exit={{ opacity: 1 }} transition={{ duration: 0.35 }}>
          <Label />
        </motion.div>
      </>
    );
  }

  return (
    <>
      {children}
      {/* Exit: rises from the bottom to cover. */}
      <motion.div
        aria-hidden
        className={base}
        initial={{ y: '100%' }}
        animate={{ y: '100%' }}
        exit={{ y: '0%' }}
        transition={{ duration: 0.6, ease: ease.primary }}
      >
        <motion.span initial={{ opacity: 0 }} exit={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.3 }}>
          <Label />
        </motion.span>
      </motion.div>
      {/* Enter: already covering, carries on upward and off. */}
      <motion.div
        aria-hidden
        className={base}
        initial={{ y: first ? '-100%' : '0%' }}
        animate={{ y: '-100%' }}
        transition={{ duration: 0.65, ease: ease.primary, delay: 0.15 }}
      >
        <motion.span initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 0.2, delay: 0.1 }}>
          <Label />
        </motion.span>
      </motion.div>
    </>
  );
}
