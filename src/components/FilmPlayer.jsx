import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { animate, stagger } from 'framer-motion';
import { useUI } from '../store/ui.js';
import { getLenis } from '../lib/lenis.js';
import SparkCanvas from './SparkCanvas.jsx';

/**
 * The homepage as a motion-graphics film (same idea as the Zeltrion site's player).
 * - Each chapter is one homepage section, in page order. Inside a chapter the page glides,
 *   so its own scroll animations play (the fire arch opens, the anatomy explodes, the
 *   gallery slides). Between chapters there is a cut: a coal iris closes, embers rise, the
 *   next chapter's title rises in, and the iris opens onto the next scene.
 * - While playing: letterbox bars with the chapter name, and a vignette.
 * - The player is a small round play button (bottom-left) until hovered, focused or playing;
 *   then it opens into the full bar. It steps aside when the footer is in view.
 * - Scrolling, touching or arrow keys pause it. Hidden for visitors who prefer reduced motion.
 */

// `item` is the panel's index in the home Stack; the hero sits before the stack.
const CHAPTERS = [
  { title: 'Saltfire', line: 'Cooked over oak. Served without hurry.', seconds: 4, item: null },
  { title: 'The Fire', line: 'No gas. No shortcuts.', seconds: 9, item: 0 },
  { title: 'Signatures', line: 'Seven plates we’d defend in court', seconds: 6, item: 1 },
  { title: 'Anatomy', line: 'From fire to plate, layer by layer', seconds: 9, item: 2 },
  { title: 'The Menu', line: 'Thirty-two plates. One fire.', seconds: 5, item: 3 },
  { title: '2019', line: 'Forty-six seats, one open hearth', seconds: 4, item: 4 },
  { title: 'The Chef', line: 'Daniyal Rehman, head of fire', seconds: 6, item: 5 },
  { title: 'Rooms', line: 'For the long table', seconds: 8, item: 6 },
  { title: 'Press', line: 'What they wrote', seconds: 6, item: 7 },
  { title: 'Your Table', line: 'is waiting.', seconds: 5, item: 8 },
];
const STARTS = CHAPTERS.reduce((list, _c, i) => [...list, i === 0 ? 0 : list[i - 1] + CHAPTERS[i - 1].seconds], []);
const TOTAL = STARTS[STARTS.length - 1] + CHAPTERS[CHAPTERS.length - 1].seconds;
const SPARKS = ['255,91,31', '255,154,77', '242,180,65', '255,236,214'];

const clock = (s) => {
  const whole = Math.max(0, Math.floor(s));
  return `${String(Math.floor(whole / 60)).padStart(2, '0')}:${String(whole % 60).padStart(2, '0')}`;
};
const pad = (n) => String(n).padStart(2, '0');
const easeInOut = (f) => 0.5 - 0.5 * Math.cos(Math.PI * Math.min(1, Math.max(0, f)));
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function jump(y) {
  const lenis = getLenis();
  if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
  else window.scrollTo(0, y);
}

// Where each chapter starts and ends on the page. Stack panels are sticky, so their
// live rects lie once stuck; rebuild their natural tops from the (non-sticky) stack
// container plus the heights and the -32px overlap between panels.
function measureStops() {
  const stack = document.querySelector('[data-stack]');
  if (!stack) return [];
  const vh = window.innerHeight;
  const items = [...stack.children];
  let y = stack.getBoundingClientRect().top + window.scrollY;
  const tops = items.map((el, i) => {
    if (i > 0) y -= 32;
    const top = y;
    y += el.offsetHeight;
    return top;
  });
  return CHAPTERS.map((c) => {
    if (c.item === null) return { start: 0, end: 0 };
    const top = tops[c.item] ?? 0;
    const h = items[c.item]?.offsetHeight ?? vh;
    return { start: top, end: Math.max(top, top + h - vh) };
  });
}

export default function FilmPlayer() {
  const intro = useUI((s) => s.intro);
  const [enabled] = useState(() => !reduced());
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [atEnd, setAtEnd] = useState(false);
  const [cutTitle, setCutTitle] = useState(1);
  const [cutting, setCutting] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [nearFooter, setNearFooter] = useState(false);

  const stops = useRef([]);
  const playingRef = useRef(false);
  const cuttingRef = useRef(false);
  const timeRef = useRef(0);
  const overlay = useRef(null);

  const measure = useCallback(() => {
    stops.current = measureStops();
  }, []);

  const timeAt = (y) => {
    const s = stops.current;
    if (!s.length) return 0;
    for (let i = CHAPTERS.length - 1; i >= 0; i -= 1) {
      if (y >= s[i].start - 2) {
        const span = Math.max(1, s[i].end - s[i].start);
        return STARTS[i] + Math.min(1, (y - s[i].start) / span) * CHAPTERS[i].seconds;
      }
    }
    return 0;
  };

  const pause = useCallback(() => {
    playingRef.current = false;
    setPlaying(false);
  }, []);

  // ---------- The cut between chapters ----------
  const runCut = (next) =>
    new Promise((resolve) => {
      const root = overlay.current;
      if (!root) return resolve();
      cuttingRef.current = true;
      setCutTitle(next);
      setCutting(true);
      requestAnimationFrame(() => {
        const q = (sel) => root.querySelectorAll(sel);
        const iris = q('[data-iris]')[0];
        root.style.visibility = 'visible';
        iris.style.setProperty('--hole', '0%');
        animate([
          [iris, { clipPath: ['circle(0% at 50% 50%)', 'circle(80% at 50% 50%)'] }, { duration: 0.6, ease: [0.55, 0, 1, 0.45], at: 0 }],
          [q('[data-cut-number]'), { y: ['100%', '0%'], opacity: [0, 1] }, { duration: 0.5, ease: [0.16, 1, 0.3, 1], at: 0.45 }],
          [q('[data-cut-letter]'), { y: ['110%', '0%'] }, { duration: 0.6, delay: stagger(0.03), ease: [0.16, 1, 0.3, 1], at: 0.5 }],
          [q('[data-cut-line]'), { opacity: [0, 1], y: [12, 0] }, { duration: 0.5, at: 0.8 }],
          [q('[data-cut-number], [data-cut-line]'), { opacity: 0 }, { duration: 0.3, at: 1.6 }],
          [q('[data-cut-letter]'), { y: '-110%' }, { duration: 0.4, delay: stagger(0.015), ease: [0.55, 0, 1, 0.45], at: 1.55 }],
          [iris, { '--hole': ['0%', '120%'] }, { duration: 0.8, ease: [0.76, 0, 0.24, 1], at: 1.8 }],
        ]).then(() => {
          root.style.visibility = 'hidden';
          cuttingRef.current = false;
          setCutting(false);
          resolve();
        });
        // Swap scenes while the iris is closed.
        setTimeout(() => jump(stops.current[next]?.start ?? 0), 650);
      });
    });

  // ---------- Setup ----------
  useEffect(() => {
    if (!enabled) return undefined;
    measure();
    window.addEventListener('resize', measure);

    let frame = 0;
    const onScroll = () => {
      if (playingRef.current) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const t = timeAt(window.scrollY);
        timeRef.current = t;
        setTime(t);
        setAtEnd(t >= TOTAL - 0.3);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    const interrupt = (e) => {
      if (!playingRef.current) return;
      if (e.target instanceof Element && e.target.closest('[data-film]')) return;
      if (e instanceof KeyboardEvent && !['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', ' ', 'Home', 'End'].includes(e.key)) return;
      pause();
    };
    window.addEventListener('wheel', interrupt, { passive: true, capture: true });
    window.addEventListener('touchstart', interrupt, { passive: true, capture: true });
    window.addEventListener('keydown', interrupt, { capture: true });

    return () => {
      cancelAnimationFrame(frame);
      playingRef.current = false;
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('wheel', interrupt, { capture: true });
      window.removeEventListener('touchstart', interrupt, { capture: true });
      window.removeEventListener('keydown', interrupt, { capture: true });
    };
  }, [enabled, measure, pause]); // eslint-disable-line react-hooks/exhaustive-deps

  // ---------- Step aside when the footer is in view ----------
  useEffect(() => {
    const footer = document.querySelector('footer');
    if (!footer) return undefined;
    const io = new IntersectionObserver(([entry]) => setNearFooter(entry.isIntersecting), { rootMargin: '0px 0px -40px 0px' });
    io.observe(footer);
    return () => io.disconnect();
  }, []);

  // ---------- Playback: glide through a chapter, then cut to the next ----------
  useEffect(() => {
    if (!playing) return undefined;
    let frame = 0;
    let last = performance.now();
    const tick = (now) => {
      if (!playingRef.current) return;
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      if (cuttingRef.current) {
        frame = requestAnimationFrame(tick);
        return;
      }
      const before = timeRef.current;
      let i = CHAPTERS.length - 1;
      while (i > 0 && before < STARTS[i]) i -= 1;
      const chapterEnd = STARTS[i] + CHAPTERS[i].seconds;
      timeRef.current = Math.min(chapterEnd, before + dt);
      const s = stops.current[i];
      if (s) jump(s.start + easeInOut((timeRef.current - STARTS[i]) / CHAPTERS[i].seconds) * (s.end - s.start));
      setTime(timeRef.current);

      if (timeRef.current >= chapterEnd) {
        if (i === CHAPTERS.length - 1) {
          setAtEnd(true);
          pause();
          return;
        }
        runCut(i + 1).then(() => {
          timeRef.current = STARTS[i + 1] + 0.001;
          setTime(timeRef.current);
        });
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, pause]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = () => {
    if (playing) return pause();
    measure();
    if (atEnd) {
      timeRef.current = 0;
      setAtEnd(false);
      jump(0);
    } else {
      timeRef.current = timeAt(window.scrollY);
    }
    playingRef.current = true;
    setPlaying(true);
    return undefined;
  };

  const seek = (index) => {
    measure();
    timeRef.current = STARTS[index] + 0.001;
    setTime(timeRef.current);
    setAtEnd(false);
    if (playingRef.current) runCut(index);
    else jump(stops.current[index]?.start ?? 0);
  };

  if (!enabled) return null;

  const chapter = Math.max(0, STARTS.findLastIndex((start) => time >= start));
  const fresh = !playing && time < 0.3;
  const expanded = playing || hovered;
  const visible = intro === 'done' && (playing || !nearFooter);
  const bar = 'pointer-events-none fixed inset-x-0 z-[85] bg-coal transition-transform duration-700 ease-primary';

  return createPortal(
    <>
      {/* ---------- Cinema treatment while playing ---------- */}
      <div aria-hidden className={`${bar} top-0 h-[8svh] origin-top ${playing ? 'scale-y-100' : 'scale-y-0'}`}>
        <div
          className={`mx-auto flex h-full max-w-[1400px] items-end justify-between px-5 pb-2 font-mono text-[10px] uppercase tracking-[0.24em] text-cream/70 transition-opacity duration-500 md:px-10 ${
            playing ? 'opacity-100 delay-300' : 'opacity-0'
          }`}
        >
          <span>
            {pad(chapter + 1)} — {CHAPTERS[chapter].title}
          </span>
          <span className="hidden sm:inline">SALTFIRE · The film</span>
        </div>
      </div>
      <div aria-hidden className={`${bar} bottom-0 h-[11svh] origin-bottom md:h-[10svh] ${playing ? 'scale-y-100' : 'scale-y-0'}`} />
      <div
        aria-hidden
        className={`pointer-events-none fixed inset-0 z-[84] bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(11,10,9,0.35)_100%)] transition-opacity duration-700 ${
          playing ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* ---------- The cut ---------- */}
      <div ref={overlay} aria-hidden className="pointer-events-none fixed inset-0 z-[86]" style={{ visibility: 'hidden' }}>
        <div
          data-iris
          className="absolute inset-0 bg-coal [--hole:0%]"
          style={{
            WebkitMaskImage: 'radial-gradient(circle at 50% 50%, transparent var(--hole), #000 calc(var(--hole) + 0.5%))',
            maskImage: 'radial-gradient(circle at 50% 50%, transparent var(--hole), #000 calc(var(--hole) + 0.5%))',
          }}
        >
          {cutting && <SparkCanvas count={70} colors={SPARKS} speed={2.4} />}
          <div className="relative flex h-full flex-col items-center justify-center px-5 text-center text-cream">
            <span className="block overflow-hidden">
              <span data-cut-number className="block font-mono text-[11px] uppercase tracking-[0.3em] text-ember">
                Chapter {pad(cutTitle + 1)}
              </span>
            </span>
            <span className="wordmark mt-5 flex overflow-hidden pb-[0.08em] pt-[0.06em] text-[clamp(56px,12vw,190px)]">
              {Array.from(CHAPTERS[cutTitle].title).map((letter, i) => (
                <span key={`${cutTitle}-${i}`} data-cut-letter className="inline-block whitespace-pre">
                  {letter}
                </span>
              ))}
            </span>
            <span data-cut-line className="serif-em mt-5 text-[clamp(18px,2.4vw,30px)] text-glow">
              {CHAPTERS[cutTitle].line}
            </span>
          </div>
        </div>
      </div>

      {/* ---------- Player: a round play button that opens into the full bar ---------- */}
      <div
        data-film
        role="region"
        aria-label="Play the homepage as a film"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) setHovered(false);
        }}
        className={`fixed bottom-3 left-3 z-[90] transition-[transform,opacity] duration-700 ease-primary md:bottom-5 md:left-5 ${
          visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-24 opacity-0'
        }`}
      >
        <div
          className={`flex items-center rounded-full bg-coal/95 p-1.5 text-cream shadow-[0_24px_50px_-20px_rgba(11,10,9,0.7)] ring-1 ring-cream/10 transition-[gap,padding] duration-500 ease-ui ${
            expanded ? 'gap-3 pr-5' : 'gap-0'
          }`}
        >
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? 'Pause the film' : atEnd ? 'Replay the film' : 'Play the film'}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ember text-cream transition-transform duration-300 hover:scale-105"
          >
            {playing ? (
              <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden>
                <path d="M5 3h2v10H5zM9 3h2v10H9z" fill="currentColor" />
              </svg>
            ) : atEnd ? (
              <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden>
                <path d="M3 8a5 5 0 109-3M12 2v3H9" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 16 16" className="ml-0.5 h-4 w-4" aria-hidden>
                <path d="M4 2.5l9 5.5-9 5.5z" fill="currentColor" />
              </svg>
            )}
          </button>

          {/* The bar's details: folded away until hovered, focused or playing */}
          <div
            inert={expanded ? undefined : ''}
            className={`grid transition-[grid-template-columns,opacity] duration-500 ease-ui ${expanded ? 'grid-cols-[1fr] opacity-100' : 'grid-cols-[0fr] opacity-0'}`}
          >
            <div className="min-w-0 overflow-hidden">
              <div className="w-[min(440px,calc(100vw-100px))]">
                <div className="flex items-baseline justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.18em]">
                  <span className="truncate">{fresh ? 'Play the film' : `${pad(chapter + 1)} · ${CHAPTERS[chapter].title}`}</span>
                  <span className="shrink-0 tabular text-cream/70">
                    {clock(time)} / {clock(TOTAL)}
                  </span>
                </div>
                <div className="relative mt-1.5 h-4">
                  <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-cream/25" />
                  <span className="absolute left-0 top-1/2 h-px -translate-y-1/2 bg-ember" style={{ width: `${(time / TOTAL) * 100}%` }} />
                  {CHAPTERS.map((c, i) => (
                    <button
                      key={c.title}
                      type="button"
                      onClick={() => seek(i)}
                      aria-label={`Jump to ${c.title}`}
                      title={c.title}
                      className="group absolute top-0 flex h-4 w-4 -translate-x-1/2 items-center justify-center"
                      style={{ left: `${(STARTS[i] / TOTAL) * 100}%` }}
                    >
                      <i className={`block h-2 w-2 rounded-full transition-transform duration-300 group-hover:scale-150 ${i <= chapter && !fresh ? 'bg-ember' : 'bg-cream/35'}`} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
}
