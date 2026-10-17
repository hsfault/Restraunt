import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { press } from '../data/press.js';
import { ease } from '../lib/motion.js';

const word = {
  hidden: { y: '110%' },
  show: { y: '0%', transition: { duration: 0.8, ease: ease.ui } },
  exit: { y: '-110%', transition: { duration: 0.45, ease: ease.primary } },
};

export default function Press() {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.3 });
  const [i, setI] = useState(0);
  const q = press[i];

  useEffect(() => {
    if (!inView) return undefined;
    const t = setInterval(() => setI((x) => (x + 1) % press.length), 5000);
    return () => clearInterval(t);
  }, [inView, i]);

  return (
    <div ref={ref} className="px-4 py-24 md:px-10 md:py-32" aria-roledescription="carousel" aria-label="Press">
      <p className="meta mb-10 text-ash">— What they wrote</p>
      <div className="min-h-[clamp(15rem,34vw,24rem)]">
        <AnimatePresence mode="wait">
          <motion.figure key={q.id} initial="hidden" animate="show" exit="exit">
            <motion.blockquote
              className="serif-em max-w-[22ch] text-[clamp(2rem,5vw,4.5rem)] leading-[1.02] text-bone"
              variants={{ show: { transition: { staggerChildren: 0.03 } }, exit: { transition: { staggerChildren: 0.012 } } }}
              aria-live="polite"
            >
              <span className="sr-only">{q.quote}</span>
              <span aria-hidden>
                <span className="mask-loose">
                  <motion.span className="inline-block text-ash" variants={word}>
                    “
                  </motion.span>
                </span>
                {q.quote.split(' ').map((w, wi, arr) => (
                  <span key={wi} className="mask-loose">
                    <motion.span className="inline-block" variants={word}>
                      {w}
                      {wi === arr.length - 1 ? '”' : ' '}
                    </motion.span>
                  </span>
                ))}
              </span>
            </motion.blockquote>
            <motion.figcaption className="meta mt-8 text-bone" variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { delay: 0.5 } }, exit: { opacity: 0 } }}>
              {q.source} <span className="text-ash">· {q.meta}</span>
            </motion.figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>
      <ul className="mt-12 flex flex-wrap gap-x-8 gap-y-2 border-t border-bone/10 pt-6">
        {press.map((p, pi) => (
          <li key={p.id}>
            <button
              type="button"
              onClick={() => setI(pi)}
              aria-current={pi === i}
              className={`meta flex min-h-[44px] items-center gap-2 transition-colors duration-300 ${pi === i ? 'text-bone' : 'text-ash hover:text-bone'}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${pi === i ? 'bg-ember' : 'bg-bone/20'}`} />
              {p.source}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
