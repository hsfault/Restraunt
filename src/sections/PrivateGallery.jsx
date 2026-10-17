import { useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { X } from 'lucide-react';
import { gallery } from '../data/gallery.js';
import { useIsDesktop } from '../lib/useMediaQuery.js';
import { useFocusTrap } from '../lib/useFocusTrap.js';
import { useScrollLock } from '../lib/lenis.js';
import { ease } from '../lib/motion.js';
import Img from '../components/Img.jsx';
import SplitText from '../components/SplitText.jsx';
import { LoopArrowLink } from './MenuPreview.jsx';

const SHAPES = {
  wide: { w: 'w-[78vw] lg:w-[42vw]', ratio: '16 / 10', radius: [20, 20, 20, 20] },
  arch: { w: 'w-[64vw] lg:w-[22vw]', ratio: '5 / 7', radius: [999, 999, 24, 24] },
  tall: { w: 'w-[64vw] lg:w-[20vw]', ratio: '5 / 7', radius: [20, 20, 20, 20] },
  square: { w: 'w-[72vw] lg:w-[27vw]', ratio: '1 / 1', radius: [20, 20, 20, 20] },
};
const OFFSET = { top: 'lg:mt-0', mid: 'lg:mt-[7vh]', low: 'lg:mt-[14vh]' };

const radiusStyle = ([tl, tr, br, bl]) => ({
  borderTopLeftRadius: tl,
  borderTopRightRadius: tr,
  borderBottomRightRadius: br,
  borderBottomLeftRadius: bl,
});

function Item({ item, onOpen }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '0px -5% 0px -5%' });
  const shape = SHAPES[item.shape];
  return (
    <figure ref={ref} className={`shrink-0 snap-center ${shape.w} ${OFFSET[item.offset]}`}>
      <button type="button" onClick={() => onOpen(item)} className="block w-full text-left" aria-label={`View ${item.title}`}>
        <motion.div layoutId={`room-${item.id}`} className="relative overflow-hidden bg-smoke" style={{ aspectRatio: shape.ratio, ...radiusStyle(shape.radius) }}>
          <motion.div
            className="absolute inset-0"
            initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
            animate={{ clipPath: inView ? 'inset(0% 0% 0% 0%)' : 'inset(100% 0% 0% 0%)' }}
            transition={{ duration: 1.1, ease: ease.primary }}
          >
            <Img
              animated
              src={item.image}
              alt={item.alt}
              className="h-full w-full object-cover"
              initial={{ scale: 1.25 }}
              animate={{ scale: inView ? 1 : 1.25 }}
              transition={{ duration: 1.4, ease: ease.ui }}
            />
          </motion.div>
        </motion.div>
      </button>
      <figcaption className="meta mt-3 text-ash">{item.caption}</figcaption>
    </figure>
  );
}

function Lightbox({ item, onClose }) {
  const ref = useRef(null);
  useFocusTrap(ref, true, onClose);
  useScrollLock(true, 'lightbox');
  const shape = SHAPES[item.shape];
  return createPortal(
    <div className="theme-dark fixed inset-0 z-modal flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={item.title} ref={ref}>
      <motion.div className="absolute inset-0 bg-ink/90" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
      <div className="relative flex max-h-full w-full flex-col items-center">
        <motion.div
          layoutId={`room-${item.id}`}
          className="relative overflow-hidden"
          style={{
            aspectRatio: shape.ratio,
            width: `min(92vw, calc(78svh * ${shape.ratio.replace(' / ', '/')}))`,
            ...radiusStyle([24, 24, 24, 24]),
          }}
          transition={{ type: 'spring', stiffness: 280, damping: 32 }}
        >
          <Img src={item.image} alt={item.alt} eager className="h-full w-full object-cover" />
        </motion.div>
        <motion.div className="mt-4 flex w-full max-w-[92vw] items-center justify-between gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.3 } }} exit={{ opacity: 0 }}>
          <p className="meta text-bone">{item.caption}</p>
          <button type="button" onClick={onClose} className="grid h-11 w-11 place-items-center rounded-full border border-bone/20 hover:bg-smoke" aria-label="Close" data-autofocus>
            <X className="h-5 w-5" />
          </button>
        </motion.div>
      </div>
    </div>,
    document.body,
  );
}

function Header() {
  return (
    <div className="flex flex-col gap-6 px-4 md:flex-row md:items-end md:justify-between md:px-10">
      <div>
        <p className="meta mb-4 text-ash">— Private dining</p>
        <SplitText as="h2" text="Rooms for the *long* table." className="section-title block max-w-[12ch]" />
      </div>
      <div className="max-w-[34ch] md:pb-2">
        <p className="text-[14px] leading-relaxed text-ash">Birthdays, signings, a family that hasn’t sat together in years. Eight to thirty guests, menus built around the hearth.</p>
        <div className="mt-3">
          <LoopArrowLink to="/reserve">Enquire</LoopArrowLink>
        </div>
      </div>
    </div>
  );
}

function Pinned({ onOpen }) {
  const ref = useRef(null);
  const track = useRef(null);
  const [dist, setDist] = useState(0);

  useLayoutEffect(() => {
    const measure = () => track.current && setDist(Math.max(0, track.current.scrollWidth - window.innerWidth + 24));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track.current);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const x = useTransform(p, (v) => -v * dist);

  return (
    <section ref={ref} className="relative" style={{ height: `calc(100svh + ${dist}px)` }}>
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center gap-10 overflow-hidden pb-10 pt-24">
        <Header />
        <motion.div ref={track} style={{ x }} className="flex w-max items-start gap-[4vw] px-10">
          {gallery.map((g) => (
            <Item key={g.id} item={g} onOpen={onOpen} />
          ))}
        </motion.div>
        <div className="mx-10 h-px bg-bone/10">
          <motion.div className="h-full origin-left bg-bone" style={{ scaleX: p }} />
        </div>
      </div>
    </section>
  );
}

function Swipe({ onOpen }) {
  return (
    <section className="py-24">
      <Header />
      <div className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2">
        {gallery.map((g) => (
          <Item key={g.id} item={g} onOpen={onOpen} />
        ))}
      </div>
    </section>
  );
}

export default function PrivateGallery() {
  const desktop = useIsDesktop();
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(null);
  return (
    <>
      {desktop && !reduced ? <Pinned onOpen={setOpen} /> : <Swipe onOpen={setOpen} />}
      <AnimatePresence>{open && <Lightbox key={open.id} item={open} onClose={() => setOpen(null)} />}</AnimatePresence>
    </>
  );
}
