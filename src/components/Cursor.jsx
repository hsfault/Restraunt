import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useFinePointer } from '../lib/useMediaQuery.js';
import { popSpring } from '../lib/motion.js';

const SIZE = 84;
const SCALE = { default: 10 / SIZE, link: 6 / SIZE, label: 1 };

export default function Cursor() {
  const fine = useFinePointer();
  useEffect(() => {
    document.documentElement.classList.toggle('has-cursor', fine);
    return () => document.documentElement.classList.remove('has-cursor');
  }, [fine]);
  return fine ? <CursorDot /> : null;
}

function CursorDot() {
  const el = useRef(null);
  const [mode, setMode] = useState('default');
  const [label, setLabel] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const target = { x: -100, y: -100 };
    const pos = { x: -100, y: -100 };
    let raf = 0;
    const loop = () => {
      pos.x += (target.x - pos.x) * 0.18;
      pos.y += (target.y - pos.y) * 0.18;
      if (el.current) el.current.style.transform = `translate3d(${pos.x - SIZE / 2}px, ${pos.y - SIZE / 2}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onMove = (e) => {
      target.x = e.clientX;
      target.y = e.clientY;
      setVisible(true);
    };
    const onOver = (e) => {
      const t = e.target instanceof Element ? e.target : null;
      const tagged = t?.closest('[data-cursor]');
      if (tagged && tagged.getAttribute('data-cursor')) {
        setMode('label');
        setLabel(tagged.getAttribute('data-cursor'));
        return;
      }
      if (t?.closest('a, button, [role="button"], label, select, summary')) {
        setMode('link');
        return;
      }
      setMode('default');
    };
    const onLeave = () => setVisible(false);
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerover', onOver, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerover', onOver);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <div ref={el} className="pointer-events-none fixed left-0 top-0 z-cursor" style={{ width: SIZE, height: SIZE }} aria-hidden>
      <motion.div
        className="flex h-full w-full items-center justify-center rounded-full bg-ember"
        initial={false}
        animate={{ scale: visible ? SCALE[mode] : 0 }}
        transition={popSpring}
      >
        <motion.span
          className="font-mono text-[11px] uppercase tracking-[0.12em] text-bone"
          animate={{ opacity: mode === 'label' ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {label}
        </motion.span>
      </motion.div>
    </div>
  );
}
