import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { chef } from '../data/brand.js';
import { emphasisWords } from '../lib/format.js';
import { ease } from '../lib/motion.js';
import Img from '../components/Img.jsx';
import SplitText from '../components/SplitText.jsx';

const SIGNATURE =
  'M8 58 C 16 24 36 14 36 46 C 36 70 16 70 26 46 C 36 24 58 28 56 54 C 55 68 64 66 70 50 C 76 36 84 40 82 55 C 81 63 90 62 96 48 L 100 40 C 102 58 108 60 116 44 C 120 36 126 38 124 52 C 123 60 132 60 140 46 C 146 34 151 18 148 16 C 143 30 139 60 146 64 C 153 67 160 50 168 46 C 182 40 196 58 214 44 C 224 36 236 40 252 34';

function Manifesto() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' });
  let n = 0;
  return (
    <div ref={ref} className="mt-8 space-y-4">
      {chef.manifesto.map((line, li) => (
        <p key={li} className="text-[clamp(1.25rem,2.2vw,1.9rem)] font-medium leading-[1.2] tracking-[-0.015em] text-bone" aria-label={line.replace(/\*/g, '')}>
          {emphasisWords(line).map((w, wi) => {
            const i = n++;
            const underline = w.text.replace(/[^a-z]/gi, '') === chef.underline;
            return (
              <span key={wi} aria-hidden className={`relative inline-block whitespace-nowrap ${w.em ? 'serif-em text-[1.12em] text-ember' : ''}`}>
                <span className="mask-loose">
                  <motion.span
                    className="inline-block"
                    initial={{ y: '110%' }}
                    animate={{ y: inView ? '0%' : '110%' }}
                    transition={{ duration: 0.9, ease: ease.ui, delay: li * 0.35 + i * 0.012 }}
                  >
                    {w.text}
                  </motion.span>
                </span>
                {underline && (
                  <svg viewBox="0 0 120 14" preserveAspectRatio="none" className="absolute -bottom-2 left-0 h-3 w-full overflow-visible" aria-hidden>
                    <motion.path
                      d="M2 9 C 22 3 44 4 62 7 C 80 10 98 5 118 4"
                      fill="none"
                      stroke="#FF5B1F"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: inView ? 1 : 0 }}
                      transition={{ duration: 0.9, ease: ease.ui, delay: 1.4 }}
                    />
                  </svg>
                )}
                {' '}
              </span>
            );
          })}
        </p>
      ))}
    </div>
  );
}

export default function Chef() {
  const frame = useRef(null);
  const sig = useRef(null);
  const sigIn = useInView(sig, { once: true, margin: '0px 0px -10% 0px' });
  const { scrollYProgress } = useScroll({ target: frame, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);

  return (
    <div className="grid gap-12 px-4 py-24 md:grid-cols-12 md:gap-8 md:px-10 md:py-32">
      <div className="md:col-span-5">
        <div ref={frame} className="arch relative mx-auto aspect-[3/4] w-full max-w-[520px] overflow-hidden bg-smoke">
          <Img animated src={chef.image} alt="Chef Daniyal Rehman in a black apron beside the hearth, arms crossed" className="absolute inset-x-0 top-[-10%] h-[120%] w-full object-cover" style={{ y }} />
        </div>
      </div>
      <div className="flex flex-col justify-center md:col-span-6 md:col-start-7">
        <p className="meta mb-4 text-ash">— The chef</p>
        <SplitText as="h2" text={chef.name} className="display block text-[clamp(2.4rem,5.4vw,5.4rem)] leading-[0.9]" stagger={0.04} />
        <p className="meta mt-4 text-ash">{chef.title}</p>
        <Manifesto />
        <div ref={sig} className="mt-10 flex items-end gap-4">
          <svg viewBox="0 0 260 80" className="h-16 w-52 text-bone" aria-label="Signature of Daniyal Rehman" role="img">
            <motion.path
              d={SIGNATURE}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: sigIn ? 1 : 0 }}
              transition={{ duration: 1.6, ease: [0.45, 0, 0.25, 1], delay: 0.3 }}
            />
          </svg>
          <p className="meta pb-2 text-ash">Lahore, 2026</p>
        </div>
      </div>
    </div>
  );
}
