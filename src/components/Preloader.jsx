import { Fragment, useEffect, useRef, useState } from 'react';
import { animate, motion } from 'framer-motion';
import { useScrollLock } from '../lib/lenis.js';
import { useUI } from '../store/ui.js';
import { ease } from '../lib/motion.js';
import { pad } from '../lib/format.js';

const WORD = 'SALTFIRE';
const ORDER = 'SFAILRTE'; // letters arrive slightly out of order
const FRAMES = Array.from({ length: 8 }, (_, i) => `/images/preloader-${i + 1}.jpg`);

// 0 letters + flipbook · 1 window collapses · 2 letters drop · 3 curtain lifts
export default function Preloader({ onDone }) {
  const [stage, setStage] = useState(0);
  const [frame, setFrame] = useState(0);
  const [failed, setFailed] = useState({});
  const counter = useRef(null);
  const setIntro = useUI((s) => s.setIntro);
  useScrollLock(true, 'preloader');

  useEffect(() => {
    const count = animate(0, 100, {
      duration: 2.3,
      ease: [0.7, 0, 0.3, 1],
      onUpdate: (v) => {
        if (counter.current) counter.current.textContent = pad(Math.round(v), 3);
      },
    });
    const flip = setInterval(() => setFrame((f) => (f + 1) % FRAMES.length), 90);
    const timers = [
      setTimeout(() => {
        clearInterval(flip);
        setStage(1);
      }, 2400),
      setTimeout(() => setStage(2), 2700),
      setTimeout(() => {
        setStage(3);
        setIntro('lifting');
      }, 3000),
      setTimeout(() => {
        setIntro('done');
        onDone();
      }, 3750),
    ];
    return () => {
      count.stop();
      clearInterval(flip);
      timers.forEach(clearTimeout);
    };
  }, [onDone, setIntro]);

  return (
    <motion.div
      className="fixed inset-0 z-preloader flex items-center justify-center bg-bone"
      initial={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      animate={{ clipPath: stage >= 3 ? 'inset(0% 0% 100% 0%)' : 'inset(0% 0% 0% 0%)' }}
      transition={{ duration: 0.7, ease: ease.primary }}
      role="status"
      aria-label="Loading SALTFIRE"
    >
      <div className="relative">
        <span ref={counter} className="absolute -top-6 right-0 font-mono text-[12px] tracking-[0.12em] text-ember tabular md:-top-8">
          000
        </span>
        <div className="flex items-center text-[clamp(3.2rem,9vw,9rem)] font-black leading-[0.8] tracking-[-0.04em] text-ember" style={{ fontStretch: '110%' }}>
          {Array.from(WORD).map((ch, i) => (
            <Fragment key={i}>
              {i === 4 && (
                <motion.span
                  className="torn relative mx-[0.05em] inline-block h-[0.82em] overflow-hidden bg-ink"
                  initial={{ width: '0.7em', scaleX: 1 }}
                  animate={stage >= 1 ? { width: '0em', scaleX: 0, marginLeft: 0, marginRight: 0 } : { width: '0.7em', scaleX: 1 }}
                  transition={{ duration: 0.45, ease: ease.primary }}
                  aria-hidden
                >
                  {FRAMES.map((src, f) => (
                    <span key={src} className="absolute inset-0" style={{ opacity: f === frame ? 1 : 0 }}>
                      {failed[f] ? (
                        <span className="img-fallback block h-full w-full" />
                      ) : (
                        <img
                          src={src}
                          alt=""
                          className="h-full w-full object-cover"
                          onError={() => setFailed((x) => ({ ...x, [f]: true }))}
                        />
                      )}
                    </span>
                  ))}
                </motion.span>
              )}
              <span className="mask">
                <motion.span
                  className="inline-block"
                  initial={{ y: '110%' }}
                  animate={{ y: stage >= 2 ? '110%' : '0%' }}
                  transition={
                    stage >= 2
                      ? { duration: 0.4, ease: ease.primary, delay: i * 0.03 }
                      : { duration: 0.7, ease: ease.ui, delay: 0.15 + ORDER.indexOf(ch) * 0.2 }
                  }
                >
                  {ch}
                </motion.span>
              </span>
            </Fragment>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
