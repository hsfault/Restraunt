import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { menu, categoryLabel } from '../../data/menu.js';
import { useUI } from '../../store/ui.js';
import Img from '../Img.jsx';
import { rs } from '../../lib/format.js';
import { ease, spring } from '../../lib/motion.js';

const TAG_WORDS = { V: 'vegetarian veg', GF: 'gluten-free gluten free', HOT: 'hot spicy chilli' };

function search(q) {
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  return menu
    .map((m) => {
      const hay = `${m.name} ${m.desc} ${categoryLabel[m.category]} ${m.tags.map((t) => TAG_WORDS[t]).join(' ')}`.toLowerCase();
      if (!terms.every((t) => hay.includes(t))) return null;
      const score = terms.reduce((s, t) => s + (m.name.toLowerCase().includes(t) ? 2 : 1), 0);
      return { m, score };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((r) => r.m);
}

const isTyping = (el) => el instanceof HTMLElement && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable);

export default function NavSearch() {
  const open = useUI((s) => s.searchOpen);
  const setOpen = useUI((s) => s.setSearchOpen);
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const input = useRef(null);
  const navigate = useNavigate();
  const results = useMemo(() => search(q), [q]);

  useEffect(() => setActive(0), [q]);

  useEffect(() => {
    const onKey = (e) => {
      const cmdK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k';
      const slash = e.key === '/' && !e.metaKey && !e.ctrlKey && !e.altKey && !isTyping(document.activeElement);
      if (cmdK || slash) {
        e.preventDefault();
        setOpen(true);
        setTimeout(() => input.current?.focus(), 30);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setOpen]);

  useEffect(() => {
    if (open) setTimeout(() => input.current?.focus(), 30);
  }, [open]);

  const close = () => {
    setOpen(false);
    setQ('');
  };
  const go = (item) => {
    if (!item) return;
    close();
    navigate(`/menu#${item.id}`);
  };
  const onKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(results.length - 1, a + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      go(results[active]);
    }
  };

  return (
    <motion.div layout transition={spring} className="relative">
      <motion.div
        layout
        transition={spring}
        style={{ borderRadius: 18 }}
        className={`relative flex h-9 items-center overflow-hidden border border-bone/15 ${
          open ? 'w-[230px] bg-ink/50 pl-3 pr-1 xl:w-[280px]' : 'w-9 justify-center transition-colors hover:bg-smoke'
        }`}
      >
        {open ? (
          <>
            <motion.span layout="position" className="text-ash">
              <Search className="h-4 w-4" strokeWidth={1.75} />
            </motion.span>
            <input
              ref={input}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={onKeyDown}
              onBlur={() => !q && setTimeout(() => setOpen(false), 150)}
              placeholder="Search the menu…"
              aria-label="Search the menu"
              role="combobox"
              aria-expanded={results.length > 0}
              aria-controls="nav-search-results"
              aria-activedescendant={results[active] ? `sr-${results[active].id}` : undefined}
              className="h-full min-w-0 flex-1 bg-transparent px-2 text-[13px] text-bone outline-none placeholder:text-ash/70"
            />
            <kbd className="mr-1 hidden rounded border border-bone/15 px-1 font-mono text-[9px] tracking-[0.12em] text-ash xl:inline">ESC</kbd>
            <button type="button" onClick={close} className="grid h-7 w-7 place-items-center rounded-full text-ash hover:bg-smoke hover:text-bone" aria-label="Close search">
              <X className="h-3.5 w-3.5" />
            </button>
          </>
        ) : (
          <button type="button" onClick={() => setOpen(true)} className="absolute inset-0 grid place-items-center text-bone" aria-label="Search the menu (press /)">
            <Search className="h-4 w-4" strokeWidth={1.75} />
          </button>
        )}
      </motion.div>

      <AnimatePresence>
        {open && q.trim() && (
          <motion.div
            id="nav-search-results"
            role="listbox"
            className="glass-nav absolute right-0 top-[calc(100%+20px)] w-[340px] overflow-hidden rounded-2xl p-1.5"
            style={{ backgroundColor: 'rgba(250,247,242,0.94)' }}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: ease.ui }}
          >
            {results.length === 0 ? (
              <p className="px-3 py-4 text-[13px] text-ash">Nothing on the fire matches “{q}”.</p>
            ) : (
              results.map((m, i) => (
                <button
                  key={m.id}
                  id={`sr-${m.id}`}
                  role="option"
                  aria-selected={i === active}
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => go(m)}
                  className={`flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors ${i === active ? 'bg-smoke' : ''}`}
                >
                  <Img src={m.image} alt="" className="h-11 w-11 shrink-0 rounded-lg object-cover" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-medium text-bone">{m.name}</span>
                    <span className="meta block text-[10px] text-ash">{categoryLabel[m.category]}</span>
                  </span>
                  <span className="font-mono text-[12px] tabular text-bone">{rs(m.price)}</span>
                </button>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
