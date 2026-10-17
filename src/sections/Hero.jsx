import { Fragment, useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { brand } from '../data/brand.js';
import { kitchenStatus } from '../lib/time.js';
import { useFitText } from '../lib/useFitText.js';
import { useIntroTiming } from '../lib/useIntro.js';
import { useHashLink } from '../lib/useHashLink.js';
import { useFinePointer, useViewport } from '../lib/useMediaQuery.js';
import { ease } from '../lib/motion.js';
import MagneticButton from '../components/MagneticButton.jsx';
import SparkCanvas from '../components/SparkCanvas.jsx';
import Img from '../components/Img.jsx';

const SPARKS = ['255,91,31', '255,154,77', '214,146,22', '255,120,40'];
const RING = 'COOKED OVER OAK · SERVED WITHOUT HURRY · 1,200°F AT THE COALS · NO GAS · ';
const CALLOUTS = [
  { id: 'chops', at: [84, 13], side: 'right', label: 'Lamb chops · seared at 1,200°F' },
  { id: 'labneh', at: [14, 16], side: 'left', label: 'Labneh · oak-smoked 60 min' },
  { id: 'salt', at: [82, 88], side: 'right', label: 'Pomegranate · herb oil · flaky salt' },
];

function useLahoreClock() {
  const fmt = () =>
    new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Karachi', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date());
  const [time, setTime] = useState(fmt);
  useEffect(() => {
    const t = setInterval(() => setTime(fmt()), 15_000);
    return () => clearInterval(t);
  }, []);
  return time;
}

// The hearth never sits still: a reading that drifts around 1,190°F.
function HearthReading() {
  const [temp, setTemp] = useState(1188);
  useEffect(() => {
    const t = setInterval(() => setTemp((v) => Math.max(1164, Math.min(1214, v + Math.round((Math.random() - 0.5) * 14)))), 900);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="inline-flex items-center gap-2">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inset-0 animate-ping rounded-full bg-ember/70" />
        <span className="relative h-1.5 w-1.5 rounded-full bg-ember" />
      </span>
      Hearth <span className="tabular text-bone">{temp.toLocaleString('en-US')}°F</span>
    </span>
  );
}

function TopMeta({ show, delay }) {
  const time = useLahoreClock();
  return (
    <motion.div
      className="meta flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-b border-bone/10 pb-3 text-ash"
      initial={{ opacity: 0 }}
      animate={show ? { opacity: 1 } : {}}
      transition={{ duration: 0.8, delay }}
    >
      <span>Live-fire kitchen &amp; bar · Gulberg III</span>
      <span className="hidden md:inline">Oak · Charcoal · Salt · Patience</span>
      <span className="flex items-center gap-5">
        <span>
          Lahore <span className="tabular text-bone">{time}</span>
        </span>
        <HearthReading />
      </span>
    </motion.div>
  );
}

function StatusChip({ show, delay }) {
  const [status, setStatus] = useState(() => kitchenStatus());
  useEffect(() => {
    const t = setInterval(() => setStatus(kitchenStatus()), 60_000);
    return () => clearInterval(t);
  }, []);
  return (
    <motion.p
      className="inline-flex h-11 items-center gap-2.5 rounded-full border border-bone/10 bg-char px-4 text-[12px] text-bone/90"
      initial={{ opacity: 0, y: 12 }}
      animate={show ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: ease.ui, delay }}
    >
      <span className="relative flex h-2 w-2">
        {status.open && <span className="absolute inset-0 animate-ping rounded-full bg-saffron/70" />}
        <span className={`relative h-2 w-2 rounded-full ${status.open ? 'bg-saffron' : 'bg-ash'}`} />
      </span>
      {status.label}
    </motion.p>
  );
}

// One wordmark letter: rises from its mask, then fans out slightly with the cursor.
function Letter({ c, i, ready, delay, spread }) {
  const x = useTransform(spread, (v) => v * (i - 3.5) * 4);
  return (
    <span className="mask">
      <motion.span className="inline-block" style={{ x }}>
        <motion.span
          className="inline-block"
          initial={{ y: '110%' }}
          animate={{ y: ready ? '0%' : '110%' }}
          transition={{ duration: 1, ease: ease.ui, delay: delay + i * 0.06 }}
        >
          {c}
        </motion.span>
      </motion.span>
    </span>
  );
}

function Callout({ c, i, show, delay, fade }) {
  const right = c.side === 'right';
  return (
    <motion.div className="pointer-events-none absolute hidden lg:block" style={{ left: `${c.at[0]}%`, top: `${c.at[1]}%`, opacity: fade }}>
      <div className={`absolute top-0 flex -translate-y-1/2 items-center ${right ? 'left-0' : 'right-0 flex-row-reverse'}`}>
        <motion.span
          className="block h-2 w-2 shrink-0 rounded-full border-2 border-ember bg-ink"
          initial={{ scale: 0 }}
          animate={{ scale: show ? 1 : 0 }}
          transition={{ duration: 0.4, delay: delay + i * 0.25 }}
        />
        <svg width="72" height="2" className="shrink-0 overflow-visible" aria-hidden>
          <motion.line
            x1={right ? 0 : 72}
            x2={right ? 72 : 0}
            y1="1"
            y2="1"
            className="stroke-bone/40"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: show ? 1 : 0 }}
            transition={{ duration: 0.6, ease: ease.ui, delay: delay + 0.1 + i * 0.25 }}
          />
        </svg>
        <motion.span
          className="whitespace-nowrap rounded-full border border-bone/10 bg-ink/90 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-bone shadow-[0_8px_24px_-12px_rgba(23,19,15,0.4)]"
          initial={{ opacity: 0, x: right ? -8 : 8 }}
          animate={show ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, ease: ease.ui, delay: delay + 0.45 + i * 0.25 }}
        >
          <span className="text-ember">0{i + 1}</span> {c.label}
        </motion.span>
      </div>
    </motion.div>
  );
}

function PlateRig({ ready, delay, progress, tiltX, tiltY }) {
  const rotate = useTransform(progress, [0, 1], [0, 90]);
  const scale = useTransform(progress, [0, 1], [1, 0.85]);
  const ringRotate = useTransform(progress, [0, 1], [0, -70]);
  const fade = useTransform(progress, [0, 0.18], [1, 0]);

  return (
    <span
      className="absolute block"
      style={{ width: 'var(--plate)', height: 'var(--plate)', left: 'calc(var(--plate) / -2)', top: 'calc(50% - var(--plate) / 2)' }}
    >
      {/* Warm wash and sparks lifting off the plate */}
      <span className="pointer-events-none absolute -inset-[45%] rounded-full bg-[radial-gradient(circle,rgba(255,154,77,0.28)_0%,rgba(255,91,31,0.08)_35%,transparent_62%)]" />
      <motion.span className="pointer-events-none absolute -inset-x-[20%] -bottom-[10%] -top-[70%] block" initial={{ opacity: 0 }} animate={{ opacity: ready ? 1 : 0 }} transition={{ duration: 1.2, delay: delay + 1 }}>
        <SparkCanvas count={38} colors={SPARKS} speed={1.3} />
      </motion.span>

      {/* Orbiting text ring, counter-rotating */}
      <motion.span className="pointer-events-none absolute -inset-[9%] block" style={{ rotate: ringRotate }}>
        <motion.svg
          viewBox="0 0 200 200"
          className="spin-reverse h-full w-full overflow-visible"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={ready ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.4, ease: ease.ui, delay: delay + 0.6 }}
          aria-hidden
        >
          <defs>
            <path id="hero-ring" d="M100,100 m-94,0 a94,94 0 1,1 188,0 a94,94 0 1,1 -188,0" />
          </defs>
          <circle cx="100" cy="100" r="99" className="fill-none stroke-bone/10" strokeWidth="0.3" />
          <text className="fill-bone stroke-ink font-mono" style={{ fontSize: 5.6, letterSpacing: '0.18em', paintOrder: 'stroke', strokeWidth: 1.6, strokeLinejoin: 'round' }}>
            <textPath href="#hero-ring" textLength="588">
              {RING}
              {RING}
            </textPath>
          </text>
        </motion.svg>
      </motion.span>

      {/* The plate: scroll-driven turn, cursor tilt, slow spin */}
      <motion.span className="absolute inset-0 block" style={{ rotate, scale, rotateX: tiltX, rotateY: tiltY, transformPerspective: 900 }}>
        <motion.span
          className="block h-full w-full rounded-full shadow-[0_40px_120px_rgba(255,91,31,0.35),0_20px_40px_-10px_rgba(23,19,15,0.45)]"
          initial={{ opacity: 0, scale: 0.6, rotate: -120 }}
          animate={ready ? { opacity: 1, scale: 1, rotate: 0 } : {}}
          transition={{ duration: 1.8, ease: ease.ui, delay: delay + 0.2 }}
        >
          <span className="spin-slow block h-full w-full overflow-hidden rounded-full">
            <Img
              src="images/hero-plate.jpg"
              alt="Charred lamb chops on dark stone with smoked labneh, pomegranate and herb oil, seen from above"
              eager
              fetchpriority="high"
              className="h-full w-full scale-[1.14] object-cover"
            />
          </span>
        </motion.span>
      </motion.span>

      {CALLOUTS.map((c, i) => (
        <Callout key={c.id} c={c} i={i} show={ready} delay={delay + 1.4} fade={fade} />
      ))}
    </span>
  );
}

export default function Hero() {
  const section = useRef(null);
  const hash = useHashLink();
  const fine = useFinePointer();
  const { w } = useViewport();
  const { ready, delay } = useIntroTiming();
  const { containerRef, textRef, fontSize } = useFitText({ max: 352, min: 60 });
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end start'] });

  // Cursor position, -1..1 from the centre of the screen.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spread = useSpring(px, { stiffness: 90, damping: 20 });
  const tiltY = useSpring(useTransform(px, (v) => v * 10), { stiffness: 120, damping: 18 });
  const tiltX = useSpring(useTransform(py, (v) => -v * 10), { stiffness: 120, damping: 18 });
  useEffect(() => {
    if (!fine) return undefined;
    const onMove = (e) => {
      px.set((e.clientX / window.innerWidth) * 2 - 1);
      py.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [fine, px, py]);

  // Leave room above the wordmark for the plate and its ring, which overhang it.
  const plate = w * (w >= 768 ? 0.3 : 0.46);
  const font = fontSize ?? w * 0.18;
  const overhang = Math.max(24, plate * 0.59 - font * 0.4 + 8);

  const letters = Array.from(brand.name);
  const after = delay + letters.length * 0.06;

  return (
    <section
      ref={section}
      className="relative flex min-h-[100svh] flex-col overflow-hidden px-3 pb-4 pt-[92px] md:px-6 md:pb-6"
      aria-label="SALTFIRE, live-fire kitchen and bar"
    >
      <TopMeta show={ready} delay={after} />

      <h1 ref={containerRef} className="relative z-[1] w-full" style={{ marginTop: overhang }} aria-label={brand.name}>
        <span
          ref={textRef}
          className="wordmark flex w-max whitespace-nowrap text-bone [--plate:46vw] md:[--plate:30vw]"
          style={{ fontSize: fontSize ?? 'clamp(4.5rem, 18vw, 22rem)' }}
          aria-hidden
        >
          {letters.map((c, i) => (
            <Fragment key={i}>
              {i === 4 && (
                <span className="relative z-[2] inline-block w-0 self-stretch">
                  <PlateRig ready={ready} delay={delay} progress={scrollYProgress} tiltX={tiltX} tiltY={tiltY} />
                </span>
              )}
              <Letter c={c} i={i} ready={ready} delay={delay} spread={spread} />
            </Fragment>
          ))}
        </span>
      </h1>

      <div className="min-h-[calc(var(--hero-under,0px)+2.5rem)] flex-1" style={{ '--hero-under': `${Math.max(0, plate * 0.59 - font * 0.4)}px` }} />

      <motion.div
        className="relative z-[3] grid grid-cols-1 gap-y-5 border-t border-bone/10 pt-5 text-[12.5px] leading-relaxed sm:grid-cols-12 sm:gap-x-0"
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: after }}
      >
        <div className="sm:col-span-3 sm:pr-6">
          <p className="meta text-bone">SALTFIRE</p>
          <p className="meta text-ash">Lahore · Est. 2019</p>
        </div>
        <p className="max-w-[34ch] text-bone/80 sm:col-span-5 sm:border-l sm:border-bone/10 sm:px-6">{brand.intro}</p>
        <div className="flex flex-col sm:col-span-4 sm:border-l sm:border-bone/10 sm:pl-6">
          <Link to="/#visit" onClick={hash('/#visit')} className="group inline-flex min-h-[32px] items-center gap-1 text-bone">
            Visit the kitchen
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
          <p className="text-ash">Hours · Tue–Sun, 6:00pm–12:00am</p>
        </div>
      </motion.div>

      <div className="relative z-[3] mt-6 flex flex-wrap items-end justify-between gap-4">
        <StatusChip show={ready} delay={after + 0.1} />
        <motion.div
          className="hidden items-center gap-3 md:flex"
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: after + 0.3 }}
          aria-hidden
        >
          <span className="meta text-ash">Scroll</span>
          <span className="relative block h-px w-16 overflow-hidden bg-bone/15">
            <span className="scroll-cue absolute inset-y-0 left-0 w-1/2 bg-ember" />
          </span>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={ready ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: ease.ui, delay: after + 0.2 }}>
          <MagneticButton to="/reserve" className="btn-ember h-14 px-7 text-[15px]">
            Reserve a table
            <ArrowUpRight className="h-4 w-4" />
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}
