import { Children, createContext, createRef, useContext, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { motion, useMotionValue, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

// Sections slide over each other. Each item sticks once its bottom meets the
// viewport bottom, then dims and recedes while the next one covers it.
export function Stack({ children }) {
  const items = Children.toArray(children).filter(Boolean);
  const refs = useMemo(() => items.map(() => createRef()), [items.length]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="relative isolate">
      {items.map((child, i) => (
        <StackItem key={child.key ?? i} index={i} selfRef={refs[i]} nextRef={refs[i + 1]}>
          {child}
        </StackItem>
      ))}
    </div>
  );
}

function StackItem({ children, index, selfRef, nextRef }) {
  const reduced = useReducedMotion();
  const [top, setTop] = useState(0);

  useLayoutEffect(() => {
    const el = selfRef.current;
    if (!el) return undefined;
    const measure = () => setTop(Math.min(0, window.innerHeight - el.offsetHeight));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [selfRef]);

  // How far the next panel has slid over this one (0 → 1). Read from the live
  // rect: useScroll's offset maths misplaces sticky targets and reports 1.
  const { scrollY } = useScroll();
  const scrollYProgress = useMotionValue(0);
  useEffect(() => {
    const update = () => {
      const next = nextRef?.current;
      if (!next) return;
      const top = next.getBoundingClientRect().top;
      const vh = window.innerHeight;
      scrollYProgress.set(Math.min(1, Math.max(0, (vh - top) / vh)));
    };
    update();
    const unsub = scrollY.on('change', update);
    window.addEventListener('resize', update);
    return () => {
      unsub();
      window.removeEventListener('resize', update);
    };
  }, [nextRef, scrollY, scrollYProgress]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.96]);
  // Panels dim through an overlay (see Panel) rather than opacity, which would
  // reveal the stuck panels underneath, or a filter, which repaints every frame.
  const dim = useTransform(scrollYProgress, [0, 1], [0, 0.22]);
  const covered = Boolean(nextRef) && !reduced;

  return (
    <div ref={selfRef} className={`sticky ${index > 0 ? '-mt-8' : ''}`} style={{ top, zIndex: index + 1 }}>
      <motion.div style={covered ? { scale, transformOrigin: '50% 100%' } : undefined}>
        <CoverContext.Provider value={covered ? dim : null}>{children}</CoverContext.Provider>
      </motion.div>
    </div>
  );
}

// How far the next panel has covered this one, as an overlay opacity (or null).
const CoverContext = createContext(null);

// The notch takes its fill from the panel's own tokens, so it matches in dark islands too.
const TONES = {
  char: { bg: 'bg-char', fill: 'fill-char', text: 'text-ash' },
  ember: { bg: 'bg-ember', fill: 'fill-ember', text: 'text-coal/70' },
  ink: { bg: 'bg-ink', fill: 'fill-ink', text: 'text-ash' },
  dark: { bg: 'theme-dark bg-char', fill: 'fill-char', text: 'text-ash' },
};

export function PanelNotch({ tone = 'char' }) {
  const t = TONES[tone];
  return (
    <div className="pointer-events-none absolute -top-[35px] left-1/2 z-10 h-9 w-[140px] -translate-x-1/2" aria-hidden>
      <svg viewBox="0 0 140 36" className="absolute inset-0 h-full w-full">
        <path d="M0 36 C 24 36 30 32 38 20 C 46 7 54 0 70 0 C 86 0 94 7 102 20 C 110 32 116 36 140 36 Z" className={t.fill} />
      </svg>
      <span className={`absolute inset-x-0 top-[13px] flex items-center justify-center gap-1 font-mono text-[9px] uppercase tracking-[0.18em] ${t.text}`}>
        <ArrowDown className="h-2.5 w-2.5" strokeWidth={2} />
        Scroll
      </span>
    </div>
  );
}

export function Panel({ id, tone = 'char', className = '', innerClassName = '', notch = true, children, ...rest }) {
  const t = TONES[tone];
  const dim = useContext(CoverContext);
  return (
    <section id={id} className={`relative rounded-t-[28px] md:mx-3 md:rounded-t-[32px] ${t.bg} ${className}`} {...rest}>
      {notch && <PanelNotch tone={tone} />}
      <div className={`relative rounded-t-[28px] [overflow:clip] md:rounded-t-[32px] ${innerClassName}`}>
        {children}
        {dim && <motion.div aria-hidden className="pointer-events-none absolute inset-0 z-20 bg-coal" style={{ opacity: dim }} />}
      </div>
    </section>
  );
}
