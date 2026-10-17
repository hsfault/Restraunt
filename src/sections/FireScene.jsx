import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion, cubicBezier } from 'framer-motion';
import { fireLines } from '../data/brand.js';
import { useViewport } from '../lib/useMediaQuery.js';
import Img from '../components/Img.jsx';

const inOut = cubicBezier(0.76, 0, 0.24, 1);
const ALT = 'An open oak hearth: glowing coals under iron grates while cooks turn skewers, sparks in the air';

function Lines({ style }) {
  return (
    <div className="absolute inset-x-0 bottom-0 px-5 pb-[12vh] md:px-12">
      <ul className="max-w-4xl space-y-3">
        {fireLines.map((l, i) => (
          <motion.li key={l} style={style?.(i)} className="flex items-baseline gap-4">
            <span className="meta w-6 shrink-0 text-ember">0{i + 1}</span>
            <span className="text-[clamp(1.6rem,4.4vw,4.2rem)] font-bold leading-[1] tracking-[-0.03em] text-bone">{l}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

function StaticFire() {
  return (
    <section id="fire" className="theme-dark relative h-[100svh] overflow-hidden bg-ink" aria-label="The fire">
      <Img src="images/fire-hearth.jpg" alt={ALT} className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-transparent" />
      <h2 className="section-title absolute left-5 top-[18vh] md:left-12">
        Cooked over <span className="serif-em">oak</span>.
      </h2>
      <Lines />
    </section>
  );
}

// Pinned ~250vh: an arch window opens to full-bleed fire, three lines arrive,
// then the frame tucks into an inset card before the next panel covers it.
export default function FireScene() {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const { w, h } = useViewport();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  const md = w >= 768;
  const aw = md ? w * 0.24 : w * 0.62;
  const ah = Math.min(md ? w * 0.34 : w * 0.86, h * 0.62);

  const grow = useTransform(p, [0.04, 0.5], [0, 1], { ease: inOut });
  const shrink = useTransform(p, [0.9, 1], [0, 1], { ease: inOut });
  const clipPath = useTransform([grow, shrink], ([g, s]) => {
    const k = 1 - g;
    const ix = ((w - aw) / 2) * k + 12 * s;
    const iy = ((h - ah) / 2) * k + 12 * s;
    const rTop = (aw / 2) * k + 32 * s;
    const rBot = 24 * k + 32 * s;
    return `inset(${iy.toFixed(1)}px ${ix.toFixed(1)}px ${iy.toFixed(1)}px ${ix.toFixed(1)}px round ${rTop.toFixed(1)}px ${rTop.toFixed(1)}px ${rBot.toFixed(1)}px ${rBot.toFixed(1)}px)`;
  });
  const imgScale = useTransform(grow, [0, 1], [1.3, 1]);
  const leftX = useTransform(p, [0.04, 0.42], ['0vw', '-70vw']);
  const rightX = useTransform(p, [0.04, 0.42], ['0vw', '70vw']);
  const subOpacity = useTransform(p, [0.04, 0.2], [1, 0]);
  const shade = useTransform(p, [0.42, 0.56], [0, 1]);
  const t0 = useTransform(p, [0.52, 0.6], [0, 1]);
  const t1 = useTransform(p, [0.62, 0.7], [0, 1]);
  const t2 = useTransform(p, [0.72, 0.8], [0, 1]);
  const y0 = useTransform(t0, [0, 1], [24, 0]);
  const y1 = useTransform(t1, [0, 1], [24, 0]);
  const y2 = useTransform(t2, [0, 1], [24, 0]);
  const lineStyle = (i) => [{ opacity: t0, y: y0 }, { opacity: t1, y: y1 }, { opacity: t2, y: y2 }][i];

  if (reduced) return <StaticFire />;

  const head = 'display text-[clamp(2.4rem,7vw,7rem)] leading-[0.86] text-bone';

  return (
    <section id="fire" ref={ref} className="relative h-[250vh] bg-ink" aria-label="The fire">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.div className="theme-dark absolute inset-0" style={{ clipPath }}>
          <Img animated src="images/fire-hearth.jpg" alt={ALT} className="h-full w-full object-cover" style={{ scale: imgScale }} />
          <motion.div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/10" style={{ opacity: shade }} />
          <Lines style={lineStyle} />
        </motion.div>

        {/* Split headline either side of the arch (above/below it on phones). */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center md:flex-row">
          <motion.h2 style={{ x: leftX }} className={`${head} absolute top-[15vh] md:static md:w-[38vw] md:pr-[3vw] md:text-right`}>
            Cooked over
          </motion.h2>
          <div className="shrink-0" style={{ width: md ? aw : 0 }} />
          <motion.div style={{ x: rightX }} className="absolute bottom-[9vh] text-center md:static md:w-[38vw] md:pl-[3vw] md:text-left">
            <p className={head}>Oak</p>
            <motion.p style={{ opacity: subOpacity }} className="serif-em mt-3 text-[clamp(1.1rem,1.6vw,1.6rem)] text-ash">
              every plate starts as a split log.
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
