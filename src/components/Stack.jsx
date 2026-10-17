import { Children, createRef, useLayoutEffect, useMemo, useState } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
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

  const { scrollYProgress } = useScroll({ target: nextRef ?? selfRef, offset: ['start end', 'start start'] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.96]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.5]);
  const covered = Boolean(nextRef) && !reduced;

  return (
    <div ref={selfRef} className={`sticky ${index > 0 ? '-mt-8' : ''}`} style={{ top, zIndex: index + 1 }}>
      <motion.div style={covered ? { scale, opacity, transformOrigin: '50% 100%' } : undefined}>{children}</motion.div>
    </div>
  );
}

const TONES = {
  char: { bg: 'bg-char', fill: '#151311', text: 'text-ash' },
  ember: { bg: 'bg-ember', fill: '#FF5B1F', text: 'text-ink/70' },
  ink: { bg: 'bg-ink', fill: '#0B0A09', text: 'text-ash' },
};

export function PanelNotch({ tone = 'char' }) {
  const t = TONES[tone];
  return (
    <div className="pointer-events-none absolute -top-[35px] left-1/2 z-10 h-9 w-[140px] -translate-x-1/2" aria-hidden>
      <svg viewBox="0 0 140 36" className="absolute inset-0 h-full w-full">
        <path d="M0 36 C 24 36 30 32 38 20 C 46 7 54 0 70 0 C 86 0 94 7 102 20 C 110 32 116 36 140 36 Z" fill={t.fill} />
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
  return (
    <section id={id} className={`relative rounded-t-[28px] md:mx-3 md:rounded-t-[32px] ${t.bg} ${className}`} {...rest}>
      {notch && <PanelNotch tone={tone} />}
      <div className={`relative rounded-t-[28px] [overflow:clip] md:rounded-t-[32px] ${innerClassName}`}>{children}</div>
    </section>
  );
}
