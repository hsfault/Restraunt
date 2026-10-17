import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, animate, motion, useInView, useMotionValue } from 'framer-motion';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { dishes } from '../data/dishes.js';
import { categoryLabel } from '../data/menu.js';
import { averageColor } from '../lib/color.js';
import { useIsMdUp } from '../lib/useMediaQuery.js';
import { rs, pad } from '../lib/format.js';
import { ease } from '../lib/motion.js';
import Img from '../components/Img.jsx';
import SplitText from '../components/SplitText.jsx';
import DishModal from './DishModal.jsx';

const N = dishes.length;
const cardSpring = { type: 'spring', stiffness: 260, damping: 30, mass: 0.9 };

const rgba = (hex, a) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};

function pose(off, md) {
  const a = Math.abs(off);
  const s = Math.sign(off);
  if (a === 0) return { x: '0%', rotateY: 0, scale: 1, opacity: 1, filter: 'brightness(1) blur(0px)' };
  if (a === 1) return { x: `${s * 62}%`, rotateY: -s * (md ? 38 : 20), scale: 0.82, opacity: 1, filter: 'brightness(0.6) blur(0px)' };
  if (a === 2 && md) return { x: `${s * 105}%`, rotateY: -s * 48, scale: 0.68, opacity: 0.5, filter: 'brightness(0.6) blur(2px)' };
  return { x: `${s * (md ? 130 : 110)}%`, rotateY: -s * 55, scale: 0.55, opacity: 0, filter: 'brightness(0.5) blur(2px)' };
}

const isTyping = (el) => el instanceof HTMLElement && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA');

export default function Coverflow() {
  const md = useIsMdUp();
  const section = useRef(null);
  const inView = useInView(section, { amount: 0.35 });
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [selected, setSelected] = useState(null);
  const [colors, setColors] = useState({});
  const progress = useMotionValue(0);
  const dragging = useRef(false);

  const go = (d) => setActive((a) => (a + d + N * 10) % N);
  const dish = dishes[active];
  const color = colors[dish.id] ?? dish.dominantColor;

  useEffect(() => {
    dishes.forEach((d) =>
      averageColor(d.image, d.dominantColor).then((c) => setColors((prev) => (prev[d.id] === c ? prev : { ...prev, [d.id]: c }))),
    );
  }, []);

  useEffect(() => {
    if (!playing || !inView || selected) return undefined;
    progress.set(0);
    const ctrl = animate(progress, 1, { duration: 4, ease: 'linear', onComplete: () => go(1) });
    return () => ctrl.stop();
  }, [playing, inView, selected, active, progress]);

  useEffect(() => {
    if (!inView || selected) return undefined;
    const onKey = (e) => {
      if (isTyping(document.activeElement)) return;
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [inView, selected]);

  const onDragEnd = (_, info) => {
    const power = info.offset.x + info.velocity.x * 0.25;
    const step = Math.max(-3, Math.min(3, Math.round(-power / 160)));
    if (step) go(step);
    setTimeout(() => {
      dragging.current = false;
    }, 60);
  };

  const onCard = (i, off) => {
    if (dragging.current) return;
    if (off === 0) setSelected(dishes[i]);
    else setActive(i);
  };

  return (
    <div ref={section} id="signature" className="relative isolate overflow-hidden pb-10 pt-24 md:pb-14 md:pt-28">
      {/* Ambient colour of the active dish bleeding behind the stage */}
      <div className="absolute inset-0 -z-10" aria-hidden>
        <AnimatePresence initial={false}>
          <motion.div
            key={color}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: 'easeInOut' }}
            style={{ background: `radial-gradient(70% 60% at 50% 55%, ${rgba(color, 0.35)} 0%, ${rgba(color, 0.12)} 40%, transparent 75%)` }}
          />
        </AnimatePresence>
      </div>

      <div className="flex flex-col gap-6 px-4 md:flex-row md:items-end md:justify-between md:px-10">
        <div>
          <p className="meta mb-4 text-ash">— Signature plates · 07</p>
          <SplitText as="h2" text="Seven plates we’d *defend* in court." className="section-title block max-w-[14ch]" stagger={0.05} />
        </div>
        <p className="max-w-[30ch] text-[13px] text-ash md:pb-3 md:text-right">
          Drag, swipe or use the arrow keys. Tap the centre plate for the story behind it.
        </p>
      </div>

      <div className="relative mt-10 h-[400px] md:mt-14 md:h-[clamp(500px,40vw,600px)]" style={{ perspective: 1400 }} data-cursor={selected ? undefined : 'drag'}>
        <motion.div
          className="relative h-full preserve-3d"
          drag={selected ? false : 'x'}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.16}
          onDragStart={() => {
            dragging.current = true;
          }}
          onDragEnd={onDragEnd}
          role="group"
          aria-roledescription="carousel"
          aria-label="Signature dishes"
        >
          {dishes.map((d, i) => {
            let off = i - active;
            if (off > N / 2) off -= N;
            if (off < -N / 2) off += N;
            const target = pose(off, md);
            const hidden = selected && off !== 0;
            return (
              <motion.div
                key={d.id}
                className="absolute left-1/2 top-0 w-[64vw] max-w-[300px] md:w-[clamp(240px,24vw,340px)] md:max-w-none"
                style={{ marginLeft: md ? 'calc(clamp(240px, 24vw, 340px) / -2)' : 'calc(min(64vw, 300px) / -2)', zIndex: 10 - Math.abs(off) }}
                initial={false}
                animate={{ ...target, opacity: hidden ? 0 : target.opacity, scale: hidden ? target.scale * 0.85 : target.scale }}
                transition={cardSpring}
                aria-hidden={Math.abs(off) > 1}
              >
                <button
                  type="button"
                  onClick={() => onCard(i, off)}
                  tabIndex={Math.abs(off) <= 1 ? 0 : -1}
                  className="glass-card block w-full rounded-[22px] p-2 text-left"
                  aria-label={off === 0 ? `View ${d.name}` : `Show ${d.name}`}
                  data-cursor={off === 0 ? 'view' : undefined}
                >
                  {selected?.id === d.id ? (
                    <div className="aspect-[4/5]" />
                  ) : (
                    <motion.div layoutId={`dish-img-${d.id}`} className="relative aspect-[4/5] overflow-hidden" style={{ borderRadius: 16 }} transition={{ type: 'spring', stiffness: 280, damping: 32 }}>
                      <Img src={d.image} alt={d.name} className="h-full w-full object-cover" />
                      <span className="glass-card absolute left-3 top-3 rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-bone">◎ View dish</span>
                    </motion.div>
                  )}
                  <span className="block px-2 pb-1.5 pt-3">
                    <span className="block truncate text-[15px] font-semibold text-bone">{d.name}</span>
                    <span className="meta mt-1 block truncate text-[10px] text-ash">
                      {categoryLabel[d.category]} · {rs(d.price)}
                      {d.chefsPick && <span className="text-saffron"> · ★ Chef’s pick</span>}
                    </span>
                  </span>
                </button>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Glass control bar */}
      <motion.div
        className="relative z-10 mt-8 flex justify-center px-3"
        animate={{ y: selected ? 140 : 0, opacity: selected ? 0 : 1 }}
        transition={{ duration: 0.5, ease: ease.ui }}
      >
        <div className="glass-card flex max-w-full items-center gap-0.5 rounded-full p-1.5">
          <button type="button" onClick={() => go(-1)} className="grid h-11 w-11 place-items-center rounded-full hover:bg-white/10" aria-label="Previous dish">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            className="relative grid h-11 w-11 place-items-center rounded-full hover:bg-white/10"
            aria-label={playing ? 'Pause autoplay' : 'Play autoplay'}
            aria-pressed={playing}
          >
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            <span className="absolute bottom-1.5 left-3 right-3 h-[2px] overflow-hidden rounded-full bg-white/10">
              <motion.span className="block h-full origin-left bg-ember" style={{ scaleX: progress }} />
            </span>
          </button>
          <button type="button" onClick={() => go(1)} className="grid h-11 w-11 place-items-center rounded-full hover:bg-white/10" aria-label="Next dish">
            <ChevronRight className="h-4 w-4" />
          </button>
          <span className="mx-1.5 h-6 w-px bg-white/10" />
          <div className="flex min-w-0 items-center gap-2.5 pr-1" aria-live="polite">
            <Img src={dish.image} alt="" className="h-8 w-8 shrink-0 rounded-lg object-cover" />
            <span className="hidden max-w-[11rem] truncate text-[13px] text-bone sm:block">{dish.name}</span>
          </div>
          <span className="mx-1.5 h-6 w-px bg-white/10" />
          <span className="whitespace-nowrap px-2 font-mono text-[12px] tabular text-bone">
            {pad(active + 1)} <span className="text-ash">/ {pad(N)}</span>
          </span>
        </div>
      </motion.div>

      <AnimatePresence>{selected && <DishModal key={selected.id} dish={selected} onClose={() => setSelected(null)} />}</AnimatePresence>
    </div>
  );
}
