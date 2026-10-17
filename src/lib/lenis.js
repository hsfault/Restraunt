import Lenis from 'lenis';
import { useEffect } from 'react';

let lenis = null;
const locks = new Set();

export function initLenis({ smooth }) {
  if (lenis || !smooth) return lenis;
  // lerp 0.14 (brief said 0.09): lower values felt floaty and laggy on the wheel.
  lenis = new Lenis({ lerp: 0.14, wheelMultiplier: 1, smoothWheel: true });
  const raf = (time) => {
    lenis?.raf(time);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);
  apply();
  return lenis;
}

export const getLenis = () => lenis;

function apply() {
  const locked = locks.size > 0;
  document.documentElement.classList.toggle('scroll-locked', locked);
  if (!lenis) return;
  if (locked) lenis.stop();
  else lenis.start();
}

export function lockScroll(key) {
  locks.add(key);
  apply();
}

export function unlockScroll(key) {
  locks.delete(key);
  apply();
}

// Lock page scroll while `active` is true (preloader, modals, drawers, menus).
export function useScrollLock(active, key) {
  useEffect(() => {
    if (!active) return undefined;
    lockScroll(key);
    return () => unlockScroll(key);
  }, [active, key]);
}

export function scrollToTarget(target, { offset = 0, immediate = false } = {}) {
  if (lenis) {
    lenis.scrollTo(target, { offset, immediate, force: true, duration: 1.4 });
    return;
  }
  if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: immediate ? 'auto' : 'smooth' });
    return;
  }
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top, behavior: immediate ? 'auto' : 'smooth' });
}

export function resetScroll() {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
  window.scrollTo(0, 0);
}
