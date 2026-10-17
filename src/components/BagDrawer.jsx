import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Minus, Plus, X } from 'lucide-react';
import { useBag, useBagLines } from '../store/bag.js';
import { useScrollLock } from '../lib/lenis.js';
import { useFocusTrap } from '../lib/useFocusTrap.js';
import { rs } from '../lib/format.js';
import { ease } from '../lib/motion.js';
import Img from './Img.jsx';

export function QtyStepper({ value, onChange, min = 0, max = 20, label = 'quantity', size = 'md' }) {
  const s = size === 'sm' ? 'h-11 w-9' : 'h-11 w-11';
  return (
    <div className="inline-flex items-center rounded-full border border-bone/15">
      <button type="button" className={`${s} grid place-items-center text-bone hover:text-ember disabled:opacity-30`} onClick={() => onChange(value - 1)} disabled={value <= min} aria-label={`Decrease ${label}`}>
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="w-6 text-center font-mono text-[13px] tabular" aria-live="polite">
        {value}
      </span>
      <button type="button" className={`${s} grid place-items-center text-bone hover:text-ember disabled:opacity-30`} onClick={() => onChange(value + 1)} disabled={value >= max} aria-label={`Increase ${label}`}>
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export function BagLines({ lines }) {
  const setQty = useBag((s) => s.setQty);
  const remove = useBag((s) => s.remove);
  return (
    <ul>
      <AnimatePresence initial={false}>
        {lines.map((l) => (
          <motion.li
            key={l.id}
            layout
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.45, ease: ease.ui }}
            className="overflow-hidden"
          >
            <div className="flex gap-4 border-b border-bone/10 py-4">
              <Img src={l.image} alt={l.name} className="h-20 w-16 shrink-0 rounded-lg object-cover" />
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-medium leading-tight text-bone">{l.name}</p>
                  <p className="whitespace-nowrap font-mono text-[13px] tabular">{rs(l.line)}</p>
                </div>
                <p className="mt-0.5 font-mono text-[11px] text-ash tabular">{rs(l.price)} each</p>
                <div className="mt-auto flex items-center justify-between pt-2">
                  <QtyStepper value={l.qty} onChange={(q) => setQty(l.id, q)} label={l.name} size="sm" />
                  <button type="button" onClick={() => remove(l.id)} className="meta min-h-[44px] px-1 text-ash hover:text-ember">
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}

export default function BagDrawer() {
  const open = useBag((s) => s.open);
  const setOpen = useBag((s) => s.setOpen);
  const { lines, subtotal, count } = useBagLines();
  const navigate = useNavigate();
  const panel = useRef(null);
  const close = () => setOpen(false);
  useScrollLock(open, 'drawer');
  useFocusTrap(panel, open, close);

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-drawer">
          <motion.div className="absolute inset-0 bg-ink/70" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close} />
          <motion.aside
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label="Your bag"
            className="absolute inset-y-0 right-0 flex w-full flex-col border-l border-bone/10 bg-ink sm:w-[440px]"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.7, ease: ease.primary }}
          >
            <div className="flex items-center justify-between border-b border-bone/10 px-6 py-4">
              <p className="display text-2xl">
                Your bag <span className="font-mono text-sm text-ash tabular">({count})</span>
              </p>
              <button type="button" onClick={close} className="grid h-11 w-11 place-items-center rounded-full hover:bg-smoke" aria-label="Close bag" data-autofocus>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6" data-lenis-prevent>
              {lines.length ? (
                <BagLines lines={lines} />
              ) : (
                <div className="py-16">
                  <p className="serif-em text-3xl text-bone">Nothing on the fire yet.</p>
                  <p className="mt-3 text-sm text-ash">Add a few plates from the menu and they’ll wait here.</p>
                  <button
                    type="button"
                    onClick={() => {
                      close();
                      navigate('/menu');
                    }}
                    className="meta mt-6 flex min-h-[44px] items-center text-bone hover:text-ember"
                  >
                    Browse the menu →
                  </button>
                </div>
              )}
            </div>
            {lines.length > 0 && (
              <div className="border-t border-bone/10 px-6 py-5">
                <div className="flex items-baseline justify-between">
                  <p className="meta text-ash">Subtotal</p>
                  <p className="font-mono text-lg tabular">{rs(subtotal)}</p>
                </div>
                <p className="mt-1 text-[12px] text-ash">Tax and service added at checkout. Pickup only.</p>
                <button
                  type="button"
                  onClick={() => {
                    close();
                    navigate('/bag');
                  }}
                  className="btn-ember mt-5 w-full"
                >
                  Checkout
                </button>
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
