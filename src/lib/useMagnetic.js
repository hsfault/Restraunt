import { useRef } from 'react';
import { useMotionValue, useSpring } from 'framer-motion';

// Pulls an element up to `strength` px toward the cursor while hovered.
export function useMagnetic(strength = 8) {
  const ref = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 260, damping: 18, mass: 0.4 });
  const y = useSpring(my, { stiffness: 260, damping: 18, mass: 0.4 });

  const onPointerMove = (e) => {
    if (e.pointerType !== 'mouse' || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
    mx.set(Math.max(-1, Math.min(1, dx)) * strength);
    my.set(Math.max(-1, Math.min(1, dy)) * strength);
  };
  const onPointerLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return { ref, style: { x, y }, handlers: { onPointerMove, onPointerLeave } };
}
