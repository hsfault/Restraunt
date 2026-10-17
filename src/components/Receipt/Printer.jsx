import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, animate, motion, useMotionValue } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { useUI } from '../../store/ui.js';
import { useScrollLock } from '../../lib/lenis.js';
import { isAudioEnabled, printTick, setAudioEnabled, tearSound } from '../../lib/audio.js';
import { ease } from '../../lib/motion.js';
import ReceiptPaper from './ReceiptPaper.jsx';
import ReceiptControls from './ReceiptControls.jsx';
import CollectedModal from './CollectedModal.jsx';

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function Scene({ data, onClose }) {
  const navigate = useNavigate();
  const paper = useRef(null);
  const run = useRef(0);
  const y = useMotionValue(-1600);
  const rotate = useMotionValue(0);
  const opacity = useMotionValue(1);
  const [phase, setPhase] = useState('idle'); // idle | printing | printed | retracted | tearing | collected
  const [active, setActive] = useState(null);
  const [audio, setAudio] = useState(isAudioEnabled());
  const [feed, setFeed] = useState(0);
  const [toolbar, setToolbar] = useState(false);
  const pendingFeed = useRef(0);
  useScrollLock(true, 'receipt');

  // Thermal printers don't glide: move in ~steps uneven jerks with micro pauses.
  const jerkTo = useCallback(
    async (target, steps = 14) => {
      const id = ++run.current;
      if (reducedMotion()) {
        y.set(target);
        return true;
      }
      const start = y.get();
      const weights = Array.from({ length: steps }, () => 0.45 + Math.random());
      const sum = weights.reduce((a, b) => a + b, 0);
      let pos = start;
      for (const w of weights) {
        if (id !== run.current) return false;
        pos += ((target - start) * w) / sum;
        const dur = 0.04 + Math.random() * 0.08;
        printTick(dur + 0.03);
        await animate(y, pos, { duration: dur, ease: 'linear' });
        if (Math.random() < 0.5) await wait(15 + Math.random() * 90);
      }
      return id === run.current;
    },
    [y],
  );

  const height = () => paper.current?.offsetHeight ?? 900;

  const print = useCallback(async () => {
    setPhase('printing');
    y.set(-height());
    opacity.set(1);
    rotate.set(0);
    await wait(200);
    if (await jerkTo(0)) {
      setPhase('printed');
      setToolbar(true);
      setActive(null);
    }
  }, [jerkTo, y, opacity, rotate]);

  useEffect(() => {
    const t = setTimeout(print, 750);
    return () => {
      clearTimeout(t);
      run.current += 1;
    };
  }, [print]);

  // FEED: blank paper is added above the print; keep the text where it was, then push it out.
  useLayoutEffect(() => {
    if (!pendingFeed.current) return;
    y.set(y.get() - pendingFeed.current);
    pendingFeed.current = 0;
    jerkTo(0, 4).then((ok) => ok && setActive(null));
  }, [feed, jerkTo, y]);

  const onFeed = () => {
    setActive('feed');
    pendingFeed.current = 40;
    setFeed((f) => f + 40);
  };

  const onReset = async () => {
    setActive('reset');
    setPhase('printing');
    if (await jerkTo(-height(), 10)) {
      setPhase('retracted');
      setFeed(0);
      setActive(null);
    }
  };

  const onReprint = async () => {
    setActive('reprint');
    if (phase !== 'retracted') {
      setPhase('printing');
      if (!(await jerkTo(-height(), 8))) return;
    }
    setFeed(0);
    await wait(250);
    await print();
  };

  const onTear = async () => {
    setActive('tear');
    setPhase('tearing');
    run.current += 1;
    tearSound();
    if (!reducedMotion()) {
      await animate(y, y.get() + 6, { duration: 0.08, ease: 'easeOut' });
      await animate(rotate, -4, { type: 'spring', stiffness: 420, damping: 7 });
      await wait(180);
      await Promise.all([
        animate(y, y.get() + window.innerHeight, { duration: 0.7, ease: ease.primary }),
        animate(opacity, 0, { duration: 0.6, delay: 0.1 }),
      ]);
    }
    setPhase('collected');
  };

  const onAudio = () => {
    const next = !audio;
    setAudio(next);
    setAudioEnabled(next);
  };

  const back = () => {
    onClose();
    navigate('/');
  };

  useEffect(() => {
    if (phase === 'collected') return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, onClose]);

  const busy = phase === 'printing' || phase === 'tearing';

  return (
    <motion.div
      className="theme-dark fixed inset-0 z-modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      role="dialog"
      aria-modal="true"
      aria-label={data.kind === 'reservation' ? 'Reservation receipt' : 'Order receipt'}
    >
      <div className="absolute inset-0 bg-ink/95" />
      <p className="meta absolute left-4 top-5 z-[2] text-ash md:left-8" aria-live="polite">
        Terminal 02 · {phase === 'printing' ? 'Printing…' : phase === 'retracted' ? 'Ready' : phase === 'tearing' ? 'Detaching' : 'Printed'}
      </p>
      <button type="button" onClick={onClose} className="absolute right-3 top-3 z-[2] grid h-11 w-11 place-items-center rounded-full text-bone hover:bg-smoke md:right-6" aria-label="Close receipt">
        <X className="h-5 w-5" />
      </button>

      {/* Printer bar sits over the top of the paper so it reads as the slot. */}
      <motion.div
        className="absolute inset-x-0 top-[64px] z-[2] mx-auto h-[38px] w-[400px] max-w-[calc(100vw-20px)] rounded-[14px] bg-white shadow-[0_18px_40px_-12px_rgba(0,0,0,0.7),inset_0_-2px_0_rgba(0,0,0,0.06)]"
        initial={{ y: -140 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.7, ease: ease.primary }}
      >
        <span className="absolute left-4 top-[11px] h-1.5 w-1.5 rounded-full bg-ink/70" />
        <span className="absolute right-4 top-[11px] h-1.5 w-3 rounded-full bg-ink/70" />
        <span className="absolute bottom-[9px] left-1/2 h-[5px] w-[calc(100%-56px)] max-w-[356px] -translate-x-1/2 rounded-full bg-ink/85" />
      </motion.div>

      <div className="absolute inset-x-0 bottom-0 top-[92px] z-[1] overflow-y-auto overflow-x-hidden px-2.5 pb-36" data-lenis-prevent>
        <motion.div className="mx-auto w-[340px] max-w-full" style={{ y, rotate, opacity, transformOrigin: '100% 0%' }}>
          {phase !== 'collected' && <ReceiptPaper ref={paper} data={data} feed={feed} className="shadow-[0_24px_60px_-20px_rgba(0,0,0,0.9)]" />}
        </motion.div>
      </div>

      <AnimatePresence>
        {toolbar && phase !== 'collected' && (
          <ReceiptControls
            active={active}
            audio={audio}
            busy={busy}
            canTear={phase === 'printed'}
            onReprint={onReprint}
            onTear={onTear}
            onFeed={onFeed}
            onReset={onReset}
            onAudio={onAudio}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>{phase === 'collected' && <CollectedModal data={data} onClose={onClose} onBack={back} />}</AnimatePresence>
    </motion.div>
  );
}

export default function Printer() {
  const receipt = useUI((s) => s.receipt);
  const closeReceipt = useUI((s) => s.closeReceipt);
  return createPortal(
    <AnimatePresence>{receipt && <Scene key={receipt.number} data={receipt} onClose={closeReceipt} />}</AnimatePresence>,
    document.body,
  );
}
