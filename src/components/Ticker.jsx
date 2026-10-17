import { useRef } from 'react';
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  useReducedMotion,
} from 'framer-motion';

const wrap = (min, max, v) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

// Infinite row whose speed follows scroll velocity and flips with scroll direction.
export default function Ticker({ items, baseVelocity = 2.2 }) {
  const reduced = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const factor = useTransform(smooth, [0, 1000], [0, 4], { clamp: false });
  const x = useTransform(baseX, (v) => `${wrap(-25, -50, v)}%`);
  const direction = useRef(1);

  useAnimationFrame((_, delta) => {
    if (reduced) return;
    const f = factor.get();
    if (f < 0) direction.current = -1;
    else if (f > 0) direction.current = 1;
    let move = direction.current * -baseVelocity * (delta / 1000);
    move += move * Math.abs(f);
    baseX.set(baseX.get() + move);
  });

  const row = (
    <span className="flex shrink-0 items-center">
      {items.map((it) => (
        <span key={it} className="flex items-center">
          <span className="serif-em whitespace-nowrap px-6 text-[clamp(1.8rem,3.4vw,2.6rem)] leading-none text-bone/70">{it}</span>
          <span className="text-[0.9rem] text-ember" aria-hidden>
            ✦
          </span>
        </span>
      ))}
    </span>
  );

  return (
    <div className="relative overflow-hidden border-y border-bone/10 py-5" aria-label={items.join(', ')}>
      <motion.div className="flex w-max" style={{ x }} aria-hidden>
        {row}
        {row}
        {row}
        {row}
      </motion.div>
    </div>
  );
}
