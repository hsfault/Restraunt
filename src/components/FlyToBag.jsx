import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { useUI } from '../store/ui.js';
import { useBag } from '../store/bag.js';

function bagTarget() {
  const els = [...document.querySelectorAll('[data-bag-target]')];
  const el = els.find((e) => e.getBoundingClientRect().width > 0);
  const r = el?.getBoundingClientRect();
  return r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : { x: window.innerWidth - 60, y: 46 };
}

// Returns add(item, originElement): the item's thumbnail arcs into the nav bag,
// and lands in the bag when it arrives.
export function useAddToBag() {
  const reduced = useReducedMotion();
  const fly = useUI((s) => s.fly);
  const add = useBag((s) => s.add);
  return (item, originEl, qty = 1) => {
    const rect = originEl?.getBoundingClientRect();
    if (reduced || !rect) {
      add(item.id, qty);
      return;
    }
    fly({ id: item.id, qty, src: item.image, rect: { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 } });
  };
}

function Flight({ flight }) {
  const land = useUI((s) => s.land);
  const add = useBag((s) => s.add);
  // Wait one frame so the nav can slide back in before we read its position.
  const [to, setTo] = useState(null);
  useEffect(() => {
    const t = setTimeout(() => setTo(bagTarget()), 60);
    return () => clearTimeout(t);
  }, []);

  const size = 64;
  const from = flight.rect;
  if (!to) return null;
  const peak = Math.min(from.y, to.y) - 140;
  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-cursor overflow-hidden rounded-full border border-bone/30 shadow-[0_10px_40px_rgba(255,91,31,0.45)]"
      style={{ width: size, height: size }}
      initial={{ x: from.x - size / 2, y: from.y - size / 2, scale: 0.6, opacity: 0 }}
      animate={{
        x: [from.x - size / 2, (from.x + to.x) / 2 - size / 2, to.x - size / 2],
        y: [from.y - size / 2, peak - size / 2, to.y - size / 2],
        scale: [0.6, 1, 0.25],
        opacity: [0, 1, 0.8],
      }}
      transition={{
        duration: 0.85,
        times: [0, 0.45, 1],
        x: { duration: 0.85, ease: 'linear' },
        y: { duration: 0.85, ease: ['easeOut', 'easeIn'] },
      }}
      onAnimationComplete={() => {
        add(flight.id, flight.qty);
        land(flight.key);
      }}
    >
      <img src={flight.src} alt="" className="h-full w-full object-cover" />
    </motion.div>
  );
}

export default function FlyToBag() {
  const flights = useUI((s) => s.flights);
  return createPortal(
    flights.map((f) => <Flight key={f.key} flight={f} />),
    document.body,
  );
}
