import { motion } from 'framer-motion';
import { useIntroTiming } from '../lib/useIntro.js';
import { ease } from '../lib/motion.js';

// Giant page title whose letters rise from the baseline once the curtain clears.
export default function PageTitle({ text, eyebrow, aside, className = '' }) {
  const { ready, delay } = useIntroTiming();
  return (
    <header className={`px-4 pb-10 pt-[132px] md:px-8 md:pt-[168px] ${className}`}>
      {eyebrow && (
        <motion.p
          className="meta mb-5 text-ash"
          initial={{ opacity: 0 }}
          animate={{ opacity: ready ? 1 : 0 }}
          transition={{ duration: 0.6, delay: delay + 0.4 }}
        >
          {eyebrow}
        </motion.p>
      )}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <h1 className="wordmark text-[clamp(3.6rem,15vw,15rem)]" aria-label={text}>
          {Array.from(text).map((c, i) => (
            <span key={i} className="mask" aria-hidden>
              <motion.span
                className="inline-block"
                initial={{ y: '110%' }}
                animate={{ y: ready ? '0%' : '110%' }}
                transition={{ duration: 0.9, ease: ease.ui, delay: delay + i * 0.06 }}
              >
                {c === ' ' ? ' ' : c}
              </motion.span>
            </span>
          ))}
        </h1>
        {aside && (
          <motion.div
            className="max-w-xs pb-2 text-sm text-ash md:text-right"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 12 }}
            transition={{ duration: 0.8, ease: ease.ui, delay: delay + 0.5 }}
          >
            {aside}
          </motion.div>
        )}
      </div>
    </header>
  );
}
