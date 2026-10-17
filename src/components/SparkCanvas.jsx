import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

const COLORS = ['255,236,214', '255,255,255', '255,190,140', '43,14,4'];

// ~60 sparks drifting upward. Pauses when off-screen or with reduced motion.
export default function SparkCanvas({ count = 60, className = '', colors = COLORS, speed = 1 }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = false;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const spawn = (p, initial) => {
      p.x = Math.random() * w;
      p.y = initial ? Math.random() * h : h + 10;
      p.r = 0.6 + Math.random() * 1.9;
      p.vy = (0.25 + Math.random() * 0.9) * speed;
      p.phase = Math.random() * Math.PI * 2;
      p.sway = 0.2 + Math.random() * 0.6;
      p.c = colors[Math.floor(Math.random() * colors.length)];
      p.a = 0.3 + Math.random() * 0.6;
      return p;
    };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const parts = Array.from({ length: count }, () => spawn({}, true));

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        p.y -= p.vy;
        p.phase += 0.02;
        p.x += Math.sin(p.phase) * p.sway * 0.4;
        if (p.y < -10) spawn(p, false);
        const life = Math.min(1, p.y / (h * 0.6));
        ctx.beginPath();
        ctx.fillStyle = `rgba(${p.c},${(p.a * life).toFixed(3)})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    const loop = () => {
      draw();
      raf = requestAnimationFrame(loop);
    };

    if (reduced) {
      draw();
      return undefined;
    }

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(loop);
    });
    io.observe(canvas);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, [count, reduced, colors, speed]);

  return <canvas ref={ref} aria-hidden className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} />;
}
