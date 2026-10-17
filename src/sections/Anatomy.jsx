import { useRef, useState } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Circle, Droplets, Flame, Sparkles, Waves } from 'lucide-react';
import { anatomy } from '../data/dishes.js';
import { useIsDesktop, useViewport } from '../lib/useMediaQuery.js';
import { ease } from '../lib/motion.js';
import Img from '../components/Img.jsx';
import RevealImage from '../components/RevealImage.jsx';
import SplitText from '../components/SplitText.jsx';

const ICONS = [Circle, Waves, Flame, Droplets, Sparkles];
const SIN = Math.sin((58 * Math.PI) / 180); // how far translateZ projects upward under rotateX(58deg)
const GAP = 90;

function Heading() {
  return (
    <>
      <p className="meta mb-4 text-ember">— Anatomy</p>
      <SplitText as="h2" text="From fire to plate, *layer* by layer." className="section-title block max-w-[12ch] text-[clamp(2.4rem,4.6vw,5.2rem)]" />
    </>
  );
}

function Steps({ active }) {
  return (
    <ol className="mt-10 space-y-1">
      {anatomy.map((l, i) => {
        const Icon = ICONS[i];
        const on = i === active;
        return (
          <li key={l.id} className="flex items-start gap-4 py-2.5">
            <span
              className={`grid h-10 w-10 shrink-0 place-items-center rounded-[11px] border transition-colors duration-500 ease-ui ${
                on ? 'border-ember bg-ember text-ink' : 'border-bone/20 text-ash'
              }`}
            >
              <Icon className="h-[18px] w-[18px]" strokeWidth={1.6} />
            </span>
            <span className="pt-0.5">
              <span className={`block text-[15px] font-semibold transition-colors duration-500 ${on ? 'text-bone' : 'text-ash'}`}>
                <span className="mr-2 font-mono text-[11px] tabular">0{i + 1}</span>
                {l.name}
              </span>
              <span className={`mt-0.5 block max-w-[40ch] text-[13px] leading-snug transition-colors duration-500 ${on ? 'text-bone/80' : 'text-ash/70'}`}>{l.line}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}

// Orthographic isometric view done in 2D: each disc carries the tilt itself and
// is lifted by the distance translateZ would project to. No shared 3D context,
// so browsers can't flatten the stack, and the labels share the exact same lift.
const lift = (i, s) => -SIN * i * (6 + (GAP - 6) * s);
const TILT = 'rotateX(58deg) rotateZ(-38deg)';

function Layer({ layer, i, sep, size }) {
  const y = useTransform(sep, (s) => lift(i, s));
  return (
    <motion.div className="absolute" style={{ y, left: -size / 2, top: -size / 2, width: size, height: size, mixBlendMode: i === 0 ? 'normal' : 'screen' }}>
      <div className="h-full w-full" style={{ transform: TILT }}>
        <Img src={layer.image} alt="" eager className="h-full w-full rounded-full object-cover [clip-path:circle(47%)]" />
      </div>
    </motion.div>
  );
}

function Label({ layer, i, sep, shown, size }) {
  const y = useTransform(sep, (s) => lift(i, s));
  return (
    <motion.div className="pointer-events-none absolute -mt-[5px] flex items-center" style={{ y, x: size * 0.36 }}>
      <svg width="90" height="10" className="-mt-px overflow-visible" aria-hidden>
        <motion.circle cx="3" cy="5" r="3" fill="#FF5B1F" initial={false} animate={{ scale: shown ? 1 : 0 }} transition={{ duration: 0.3 }} />
        <motion.path d="M3 5 H90" stroke="rgba(237,230,218,0.5)" strokeWidth="1" fill="none" initial={false} animate={{ pathLength: shown ? 1 : 0 }} transition={{ duration: 0.6, ease: ease.ui }} />
      </svg>
      <motion.span
        className="ml-2 whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.12em] text-bone"
        initial={false}
        animate={{ opacity: shown ? 1 : 0, x: shown ? 0 : -8 }}
        transition={{ duration: 0.4, delay: shown ? 0.35 : 0 }}
      >
        <span className="text-ash">0{i + 1} </span>
        {layer.label}
      </motion.span>
    </motion.div>
  );
}

function Pinned() {
  const ref = useRef(null);
  const [step, setStep] = useState(0);
  const [labelsOn, setLabelsOn] = useState(-1);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const sep = useTransform(p, [0.04, 0.2, 0.78, 0.92], [0, 1, 1, 0]);
  const shift = useTransform(sep, (s) => (SIN * 4 * (6 + (GAP - 6) * s)) / 2);
  const flash = useTransform(p, [0.86, 0.92, 1], [0, 1, 0.3]);
  const flashScale = useTransform(p, [0.86, 0.95], [0.6, 1.15]);
  const { w, h } = useViewport();
  const size = Math.round(Math.min(w * 0.3, h * 0.54, 440));

  useMotionValueEvent(p, 'change', (v) => {
    const s = v < 0.08 ? 0 : Math.min(4, Math.floor((v - 0.08) / 0.14));
    setStep(s);
    setLabelsOn(v > 0.08 && v < 0.8 ? s : -1);
  });

  return (
    <section ref={ref} className="relative h-[300vh]" aria-label="Anatomy of the signature plate">
      <div className="sticky top-0 grid h-[100svh] grid-cols-12 items-center gap-6 px-10">
        <div className="col-span-5 pt-10">
          <Heading />
          <Steps active={step} />
        </div>
        <div className="relative col-span-7 h-full">
          <motion.div className="absolute left-[38%] top-1/2" style={{ y: shift }}>
            <motion.div
              className="absolute -ml-[30vh] -mt-[30vh] h-[60vh] w-[60vh] rounded-full"
              style={{ opacity: flash, scale: flashScale, background: 'radial-gradient(circle, rgba(255,91,31,0.55) 0%, rgba(255,154,77,0.15) 40%, transparent 70%)' }}
              aria-hidden
            />
            {anatomy.map((l, i) => (
              <Layer key={l.id} layer={l} i={i} sep={sep} size={size} />
            ))}
            {anatomy.map((l, i) => (
              <Label key={l.id} layer={l} i={i} sep={sep} shown={i <= labelsOn} size={size} />
            ))}
          </motion.div>
          <p className="meta absolute bottom-10 right-0 text-ash">Saltfire lamb chops · Rs 4,850</p>
        </div>
      </div>
    </section>
  );
}

function Stacked() {
  return (
    <section className="px-4 py-24 md:px-10" aria-label="Anatomy of the signature plate">
      <Heading />
      <ol className="mt-12 space-y-10">
        {anatomy.map((l, i) => (
          <li key={l.id} className="grid grid-cols-[42vw_1fr] items-center gap-5 sm:grid-cols-[220px_1fr]">
            <RevealImage src={l.image} alt={l.name} ratio="1 / 1" className="rounded-full" />
            <div>
              <p className="meta text-ember">
                0{i + 1} · {l.label}
              </p>
              <p className="mt-2 text-lg font-semibold">{l.name}</p>
              <p className="mt-1 text-[13px] leading-snug text-ash">{l.line}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default function Anatomy() {
  const desktop = useIsDesktop();
  const reduced = useReducedMotion();
  return desktop && !reduced ? <Pinned /> : <Stacked />;
}
