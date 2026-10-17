import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { brand } from '../data/brand.js';
import { useFitText } from '../lib/useFitText.js';
import { useHashLink } from '../lib/useHashLink.js';
import { ease } from '../lib/motion.js';

const EXPLORE = [
  { label: 'Menu', to: '/menu' },
  { label: 'Reserve a table', to: '/reserve' },
  { label: 'Order for pickup', to: '/bag' },
  { label: 'Private dining', to: '/#private' },
  { label: 'The chef', to: '/#chef' },
];

function Newsletter() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [typed, setTyped] = useState('');
  const [error, setError] = useState('');
  const message = 'You’re on the list.';

  useEffect(() => {
    if (!done) return undefined;
    let i = 0;
    const t = setInterval(() => {
      i += 1;
      setTyped(message.slice(0, i));
      if (i >= message.length) clearInterval(t);
    }, 45);
    return () => clearInterval(t);
  }, [done]);

  const submit = (e) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('That address won’t reach us.');
      return;
    }
    setError('');
    setDone(true);
  };

  return (
    <form onSubmit={submit} noValidate className="mt-2">
      <p className="mb-5 text-[13px] leading-relaxed text-ash">One letter a month. New plates, the odd recipe, first word on chef’s table nights.</p>
      <div className="relative flex items-end border-b border-bone/25 focus-within:border-ember">
        {done ? (
          <p className="flex h-12 flex-1 items-center font-mono text-[13px] text-bone" aria-live="polite">
            {typed}
            <span className="ml-0.5 inline-block h-4 w-[7px] animate-pulse bg-ember" />
          </p>
        ) : (
          <label className="flex-1">
            <span className="sr-only">Email address</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="h-12 w-full bg-transparent text-[14px] text-bone outline-none placeholder:text-ash/60"
            />
          </label>
        )}
        <AnimatePresence>
          {!done && (
            <motion.button
              type="submit"
              aria-label="Subscribe"
              className="grid h-12 w-12 place-items-center text-bone hover:text-ember"
              exit={{ x: 80, opacity: 0 }}
              transition={{ duration: 0.5, ease: ease.primary }}
            >
              <ArrowRight className="h-5 w-5" strokeWidth={1.6} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      {error && <p className="mt-2 font-mono text-[11px] text-ember">{error}</p>}
    </form>
  );
}

function GiantWordmark() {
  const { containerRef, textRef, fontSize } = useFitText({ min: 60 });
  const inView = useInView(containerRef, { once: true, margin: '0px 0px -5% 0px' });
  return (
    <div ref={containerRef} className="relative mt-16 overflow-hidden" style={{ height: fontSize ? fontSize * 0.66 : '13vw' }} aria-hidden>
      <div ref={textRef} className="wordmark flex w-max whitespace-nowrap" style={{ fontSize: fontSize ?? '19vw' }}>
        {Array.from(brand.name).map((c, i) => (
          <span key={i} className="mask">
            <motion.span
              className="metal inline-block"
              initial={{ y: '110%' }}
              animate={{ y: inView ? '0%' : '110%' }}
              transition={{ duration: 1, ease: ease.ui, delay: i * 0.05 }}
            >
              {c}
            </motion.span>
          </span>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0 overflow-hidden mix-blend-overlay">
        <div className="footer-sweep absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/80 to-transparent" />
      </div>
    </div>
  );
}

export default function Footer() {
  const hash = useHashLink();
  return (
    <footer id="visit" className="relative z-10 bg-ink px-4 pt-24 md:px-8 md:pt-32">
      <div className="flex items-start justify-between gap-6 text-[clamp(2.2rem,5vw,5.5rem)] font-bold leading-[0.92] tracking-[-0.03em]">
        <p>
          <span className="block text-bone">{brand.footerLine[0]}</span>
          <span className="block text-ash">{brand.footerLine[1]}</span>
        </p>
        <span className="text-bone">©26</span>
      </div>

      <div className="mt-16 grid grid-cols-1 border-t border-bone/10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="border-b border-bone/10 py-8 sm:pr-8 lg:border-b-0 lg:border-r">
          <p className="meta mb-4 text-ash">Visit</p>
          <address className="not-italic leading-relaxed text-bone">
            {brand.addressLines.map((l) => (
              <span key={l} className="block">
                {l}
              </span>
            ))}
          </address>
          <a href={brand.phoneHref} className="mt-2 flex min-h-[44px] items-center font-mono text-[13px] text-bone hover:text-ember">
            {brand.phone}
          </a>
          <a href={brand.mapUrl} target="_blank" rel="noreferrer" className="meta flex min-h-[44px] items-center text-ash hover:text-bone" data-cursor="open">
            Open in maps ↗
          </a>
        </div>
        <div className="border-b border-bone/10 py-8 sm:pl-8 lg:border-b-0 lg:border-r lg:px-8">
          <p className="meta mb-4 text-ash">Hours</p>
          <ul className="space-y-3">
            {brand.hours.map((h) => (
              <li key={h.days}>
                <span className="block text-[13px] text-ash">{h.days}</span>
                <span className="block text-bone">{h.time}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="border-b border-bone/10 py-8 sm:pr-8 lg:border-b-0 lg:border-r lg:px-8">
          <p className="meta mb-4 text-ash">Explore</p>
          <ul>
            {EXPLORE.map((l) => (
              <li key={l.label}>
                <Link to={l.to} onClick={hash(l.to)} className="group flex min-h-[40px] items-center gap-2 text-bone">
                  <span className="relative">
                    {l.label}
                    <span className="absolute -bottom-0.5 left-0 right-0 h-px origin-right scale-x-0 bg-bone transition-transform duration-300 ease-ui group-hover:origin-left group-hover:scale-x-100" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="py-8 sm:pl-8">
          <p className="meta mb-4 text-ash">Newsletter</p>
          <Newsletter />
        </div>
      </div>

      <GiantWordmark />

      <div className="flex flex-col gap-3 border-t border-bone/10 py-6 font-mono text-[11px] uppercase tracking-[0.12em] text-ash sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 SALTFIRE · Gulberg III, Lahore · {brand.tagline}</p>
        <ul className="flex gap-5">
          {brand.socials.map((s) => (
            <li key={s.label}>
              <a href={s.href} target="_blank" rel="noreferrer" className="flex min-h-[44px] items-center text-bone hover:text-ember">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
