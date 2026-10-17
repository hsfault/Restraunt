import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Img from './Img.jsx';
import { ease } from '../lib/motion.js';

// 260x320 image that follows the cursor (lerp 0.25) and tilts with its speed.
export default function HoverImage({ item }) {
  const box = useRef(null);
  useEffect(() => {
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const pos = { ...target };
    let rot = 0;
    let raf = 0;
    const onMove = (e) => {
      target.x = e.clientX;
      target.y = e.clientY;
    };
    const loop = () => {
      const dx = (target.x - pos.x) * 0.25;
      pos.x += dx;
      pos.y += (target.y - pos.y) * 0.25;
      rot += (Math.max(-8, Math.min(8, dx * 0.35)) - rot) * 0.15;
      if (box.current) box.current.style.transform = `translate3d(${pos.x + 28}px, ${pos.y - 160}px, 0) rotate(${rot.toFixed(2)}deg)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  return createPortal(
    <div ref={box} className="pointer-events-none fixed left-0 top-0 z-[70] h-[320px] w-[260px]" aria-hidden>
      <AnimatePresence>
        {item && (
          <motion.div
            key={item.id}
            className="absolute inset-0 overflow-hidden rounded-[18px] bg-smoke shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]"
            initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
            animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
            exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
            transition={{ duration: 0.55, ease: ease.primary }}
          >
            <Img src={item.image} alt="" eager className="h-full w-full object-cover" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>,
    document.body,
  );
}
