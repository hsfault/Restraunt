import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { useBag } from '../store/bag.js';
import { categoryLabel } from '../data/menu.js';
import { useFocusTrap } from '../lib/useFocusTrap.js';
import { useScrollLock } from '../lib/lenis.js';
import { rs } from '../lib/format.js';
import { ease } from '../lib/motion.js';
import Img from '../components/Img.jsx';
import { QtyStepper } from '../components/BagDrawer.jsx';

export default function DishModal({ dish, onClose }) {
  const ref = useRef(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const add = useBag((s) => s.add);
  const setBagOpen = useBag((s) => s.setOpen);
  useFocusTrap(ref, true, onClose);
  useScrollLock(true, 'dish-modal');

  const content = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: ease.ui, delay: 0.25 } },
    exit: { opacity: 0, transition: { duration: 0.15 } },
  };

  return createPortal(
    <div className="fixed inset-0 z-modal flex items-center justify-center p-3 md:p-8">
      <motion.div className="absolute inset-0 bg-ink/80" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} onClick={onClose} />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`dish-title-${dish.id}`}
        className="relative grid max-h-[calc(100svh-24px)] w-full max-w-[880px] grid-cols-1 overflow-y-auto md:grid-cols-[1fr_1.05fr] md:overflow-visible"
        data-lenis-prevent
      >
        <motion.div className="absolute inset-0 rounded-[24px] border border-bone/10 bg-char" {...content} animate={{ opacity: 1, y: 0, transition: { duration: 0.4 } }} />
        <div className="relative p-2">
          <motion.div layoutId={`dish-img-${dish.id}`} className="relative aspect-[4/5] overflow-hidden" style={{ borderRadius: 16 }} transition={{ type: 'spring', stiffness: 280, damping: 32 }}>
            <Img src={dish.image} alt={dish.name} eager className="h-full w-full object-cover" />
          </motion.div>
        </div>
        <motion.div className="relative flex flex-col p-5 md:p-8" {...content}>
          <p className="meta text-ash">
            {categoryLabel[dish.category]}
            {dish.chefsPick && <span className="text-saffron"> · ★ Chef’s pick</span>}
          </p>
          <h3 id={`dish-title-${dish.id}`} className="display mt-3 text-[clamp(2rem,4vw,3rem)] leading-[0.9]">
            {dish.name}
          </h3>
          <p className="mt-4 text-[14px] leading-relaxed text-bone/80">{dish.story}</p>
          <div className="mt-5 border-t border-bone/10 pt-4">
            <p className="meta mb-2 text-ash">On the plate</p>
            <ul className="grid grid-cols-1 gap-x-4 gap-y-1 text-[13px] text-bone/90 sm:grid-cols-2">
              {dish.components.map((c) => (
                <li key={c} className="flex gap-2">
                  <span className="text-ash">—</span>
                  {c}
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-4 text-[13px] text-ash">
            Pairs with <span className="serif-em text-[17px] text-bone">{dish.pairsWith}</span>
          </p>
          <div className="mt-auto flex flex-wrap items-center gap-3 pt-6">
            <p className="mr-auto font-mono text-xl tabular">{rs(dish.price * qty)}</p>
            <QtyStepper value={qty} min={1} onChange={setQty} label={dish.name} />
            <button
              type="button"
              onClick={() => {
                add(dish.id, qty);
                setAdded(true);
              }}
              className="btn-ember min-w-[150px]"
            >
              {added ? (
                <>
                  <Check className="h-4 w-4" /> In your bag
                </>
              ) : (
                'Add to bag'
              )}
            </button>
          </div>
          {added && (
            <button
              type="button"
              onClick={() => {
                onClose();
                setBagOpen(true);
              }}
              className="meta mt-2 min-h-[44px] self-end text-bone hover:text-ember"
            >
              View bag →
            </button>
          )}
        </motion.div>
        <motion.button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full bg-ink/60 text-bone backdrop-blur hover:bg-ink"
          aria-label="Close dish"
          data-autofocus
          {...content}
        >
          <X className="h-5 w-5" />
        </motion.button>
      </div>
    </div>,
    document.body,
  );
}
