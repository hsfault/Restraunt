import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { press } from '../data/press.js';
import { ease } from '../lib/motion.js';
import Img from '../components/Img.jsx';

const CYCLE = 5;
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
    const t = setTimeout(() => setI((x) => (x + 1) % press.length), CYCLE * 1000);
    return () => clearTimeout(t);
  }, [inView, i]);

  return (
    <div ref={ref} className="px-4 py-24 md:px-10 md:py-32" aria-roledescription="carousel" aria-label="Press">
      <div className="mb-10 flex flex-wrap items-baseline justify-between gap-4">
        <p className="meta text-ash">— What they wrote</p>
        <p className="meta text-ash">
          <span className="text-saffron">★★★★★</span> <span className="tabular text-bone">4.9</span> · 2,140 guest reviews
        </p>
      </div>

      <div className="grid gap-12 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-7">
          <div className="min-h-[clamp(15rem,30vw,24rem)]">
            <AnimatePresence mode="wait">
              <motion.figure key={q.id} initial="hidden" animate="show" exit="exit">
                <motion.blockquote
                  className="serif-em max-w-[22ch] text-[clamp(2rem,4.6vw,4.5rem)] leading-[1.02] text-bone"
                  variants={{ show: { transition: { staggerChildren: 0.03 } }, exit: { transition: { staggerChildren: 0.012 } } }}
                  aria-live="polite"
                >
                  <span className="sr-only">{q.quote}</span>
                  <span aria-hidden>
                    <span className="mask-loose">
                      <motion.span className="inline-block text-ember" variants={word}>
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
        </div>

        {/* The plate (or person) the quote is about */}
        <div className="md:col-span-4 md:col-start-9">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[380px] overflow-hidden bg-smoke arch">
            <AnimatePresence initial={false}>
              <motion.div
                key={q.id}
                className="absolute inset-0"
                initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
                animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
                exit={{ opacity: 0, transition: { duration: 0.4, delay: 0.5 } }}
                transition={{ duration: 1.1, ease: ease.primary }}
              >
                <Img
                  animated
                  src={q.image}
                  alt={q.subject}
                  className="h-full w-full object-cover"
                  initial={{ scale: 1.25 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1.4, ease: ease.ui }}
                />
              </motion.div>
            </AnimatePresence>
          </div>
          <AnimatePresence mode="wait">
            <motion.p key={q.id} className="meta mx-auto mt-4 max-w-[380px] text-ash" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
              The plate in question · <span className="text-bone">{q.subject}</span>
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      <ul className="mt-14 grid gap-x-8 border-t border-bone/10 sm:grid-cols-3">
        {press.map((p, pi) => (
          <li key={p.id}>
            <button
              type="button"
              onClick={() => setI(pi)}
              aria-current={pi === i}
              className={`meta flex min-h-[56px] w-full flex-col justify-center gap-2 text-left transition-colors duration-300 ${pi === i ? 'text-bone' : 'text-ash hover:text-bone'}`}
            >
              <span className="relative block h-px w-full overflow-hidden bg-bone/10">
                {pi === i && (
                  <motion.span
                    key={`${i}-${inView}`}
                    className="absolute inset-0 origin-left bg-ember"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: inView ? 1 : 0 }}
                    transition={{ duration: inView ? CYCLE : 0.2, ease: 'linear' }}
                  />
                )}
              </span>
              {p.source}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
