import { AnimatePresence, motion } from 'framer-motion';
import { ease } from '../lib/motion.js';

// The label morphs into a progress line while the mock payment "processes".
export default function PayButton({ processing, children, onClick, className = '' }) {
  return (
    <button type="button" onClick={onClick} disabled={processing} aria-busy={processing} className={`btn-ember relative h-14 w-full overflow-hidden text-[15px] disabled:cursor-wait ${className}`}>
      <AnimatePresence mode="wait" initial={false}>
        {processing ? (
          <motion.span key="bar" className="absolute inset-x-8 top-1/2 h-[2px] -mt-px overflow-hidden rounded-full bg-ink/20" initial={{ opacity: 0, scaleX: 0.3 }} animate={{ opacity: 1, scaleX: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: ease.ui }}>
            <motion.span className="block h-full origin-left bg-ink" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.5, ease: [0.65, 0, 0.35, 1] }} />
            <span className="sr-only">Processing payment</span>
          </motion.span>
        ) : (
          <motion.span key="label" className="inline-flex items-center gap-2" initial={{ y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -18, opacity: 0 }} transition={{ duration: 0.3, ease: ease.ui }}>
            {children}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
