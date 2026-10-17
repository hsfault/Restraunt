import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Receipt, X } from 'lucide-react';
import ReceiptPaper from './ReceiptPaper.jsx';
import { useFocusTrap } from '../../lib/useFocusTrap.js';
import { ease } from '../../lib/motion.js';

export default function CollectedModal({ data, onClose, onBack }) {
  const ref = useRef(null);
  useFocusTrap(ref, true, onClose);
  return (
    <motion.div className="fixed inset-0 z-[4] flex items-center justify-center p-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-ink/60" onClick={onClose} />
      <motion.div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="collected-title"
        className="relative flex max-h-[calc(100svh-24px)] w-full max-w-[420px] flex-col overflow-hidden rounded-[22px] bg-white text-ink shadow-[0_40px_120px_-30px_rgba(0,0,0,0.8)]"
        initial={{ y: 40, scale: 0.96, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 30, opacity: 0 }}
        transition={{ duration: 0.55, ease: ease.ui }}
      >
        <div className="flex items-center gap-3 border-b border-ink/10 px-5 py-3.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-ink/5">
            <Receipt className="h-4 w-4" strokeWidth={1.75} />
          </span>
          <div className="flex-1">
            <p id="collected-title" className="text-[15px] font-semibold leading-tight">
              Collected Receipt
            </p>
            <p className="text-[12px] text-ink/50">Detached from terminal</p>
          </div>
          <button type="button" onClick={onClose} className="grid h-11 w-11 place-items-center rounded-full hover:bg-ink/5" aria-label="Close receipt">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto bg-[#EFEBE3] px-4 py-6" data-lenis-prevent>
          <ReceiptPaper data={data} className="print-receipt mx-auto shadow-[0_10px_30px_-12px_rgba(0,0,0,0.35)]" />
        </div>
        <div className="flex gap-2 border-t border-ink/10 p-3">
          <button type="button" onClick={() => window.print()} className="min-h-[48px] flex-1 rounded-xl border border-ink/15 text-[14px] font-medium hover:bg-ink/5">
            Print to paper
          </button>
          <button type="button" onClick={onBack} className="btn-ink flex-1 text-[14px]">
            Back to SALTFIRE
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
