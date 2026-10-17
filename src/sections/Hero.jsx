import { Fragment, useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { brand } from '../data/brand.js';
import { kitchenStatus } from '../lib/time.js';
import { useFitText } from '../lib/useFitText.js';
import { useIntroTiming } from '../lib/useIntro.js';
import { useHashLink } from '../lib/useHashLink.js';
import { ease } from '../lib/motion.js';
import MagneticButton from '../components/MagneticButton.jsx';
import Img from '../components/Img.jsx';

function StatusChip({ show, delay }) {
  const [status, setStatus] = useState(() => kitchenStatus());
  useEffect(() => {
    const t = setInterval(() => setStatus(kitchenStatus()), 60_000);
    return () => clearInterval(t);
  }, []);
  return (
    <motion.p
      className="inline-flex h-11 items-center gap-2.5 rounded-full border border-bone/10 bg-char/70 px-4 text-[12px] text-bone/90"
      initial={{ opacity: 0, y: 12 }}
      animate={show ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: ease.ui, delay }}
    >
      <span className="relative flex h-2 w-2">
        {status.open && <span className="absolute inset-0 animate-ping rounded-full bg-saffron/70" />}
        <span className={`relative h-2 w-2 rounded-full ${status.open ? 'bg-saffron' : 'bg-ash'}`} />
      </span>
      {status.label}
    </motion.p>
  );
}

export default function Hero() {
  const section = useRef(null);
  const hash = useHashLink();
  const { ready, delay } = useIntroTiming();
  const { containerRef, textRef, fontSize } = useFitText({ max: 352, min: 64 });
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end start'] });
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  const letters = Array.from(brand.name);
  const after = delay + letters.length * 0.06;

  return (
    <section
      ref={section}
      className="relative flex min-h-[100svh] flex-col px-3 pb-4 pt-[max(178px,calc(14vw+60px))] md:px-6 md:pb-6"
      aria-label="SALTFIRE, live-fire kitchen and bar"
    >
      <h1 ref={containerRef} className="relative z-[1] w-full" aria-label={brand.name}>
        <span ref={textRef} className="wordmark flex w-max whitespace-nowrap text-bone" style={{ fontSize: fontSize ?? 'clamp(4.5rem, 19vw, 22rem)' }} aria-hidden>
          {letters.map((c, i) => (
            <Fragment key={i}>
              {i === 4 && (
                <span className="relative z-[2] inline-block w-0 self-stretch [--plate:62vw] md:[--plate:34vw]">
                  <motion.span
                    className="absolute block"
                    style={{
                      width: 'var(--plate)',
                      height: 'var(--plate)',
                      left: 'calc(var(--plate) / -2)',
                      top: 'calc(50% - var(--plate) / 2)',
                      rotate,
                      scale,
                    }}
                  >
                    <motion.span
                      className="block h-full w-full rounded-full shadow-[0_40px_120px_rgba(255,91,31,0.25)]"
                      initial={{ opacity: 0, scale: 0.7, rotate: -60 }}
                      animate={ready ? { opacity: 1, scale: 1, rotate: 0 } : {}}
                      transition={{ duration: 1.6, ease: ease.ui, delay: delay + 0.25 }}
                    >
                      <span className="spin-slow block h-full w-full overflow-hidden rounded-full [clip-path:circle(50%)]">
                        <Img
                          src="/images/hero-plate.jpg"
                          alt="Charred lamb chops on dark stone with smoked labneh, pomegranate and herb oil, seen from above"
                          eager
                          fetchpriority="high"
                          className="h-full w-full scale-[1.14] object-cover"
                        />
                      </span>
                    </motion.span>
                  </motion.span>
                </span>
              )}
              <span className="mask">
                <motion.span
                  className="inline-block"
                  initial={{ y: '110%' }}
                  animate={{ y: ready ? '0%' : '110%' }}
                  transition={{ duration: 1, ease: ease.ui, delay: delay + i * 0.06 }}
                >
                  {c}
                </motion.span>
              </span>
            </Fragment>
          ))}
        </span>
      </h1>

      <div className="min-h-10 flex-1" />

      <motion.div
        className="grid grid-cols-1 gap-y-5 border-t border-bone/10 pt-5 text-[12.5px] leading-relaxed sm:grid-cols-12 sm:gap-x-0"
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: after }}
      >
        <div className="sm:col-span-3 sm:pr-6">
          <p className="meta text-bone">SALTFIRE</p>
          <p className="meta text-ash">Lahore · Est. 2019</p>
        </div>
        <p className="max-w-[34ch] text-bone/80 sm:col-span-5 sm:border-l sm:border-bone/10 sm:px-6">{brand.intro}</p>
        <div className="flex flex-col sm:col-span-4 sm:border-l sm:border-bone/10 sm:pl-6">
          <Link to="/#visit" onClick={hash('/#visit')} className="group inline-flex min-h-[32px] items-center gap-1 text-bone">
            Visit the kitchen
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
          <p className="text-ash">Hours · Tue–Sun, 6:00pm–12:00am</p>
        </div>
      </motion.div>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <StatusChip show={ready} delay={after + 0.1} />
        <motion.div initial={{ opacity: 0, y: 16 }} animate={ready ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: ease.ui, delay: after + 0.2 }}>
          <MagneticButton to="/reserve" className="btn-ember h-14 px-7 text-[15px]" cursor="reserve">
            Reserve a table
            <ArrowUpRight className="h-4 w-4" />
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}
