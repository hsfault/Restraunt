import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { menu, categories } from '../data/menu.js';
import { useFinePointer } from '../lib/useMediaQuery.js';
import { ease } from '../lib/motion.js';
import MenuRow from '../components/MenuRow.jsx';
import HoverImage from '../components/HoverImage.jsx';
import SplitText from '../components/SplitText.jsx';

export const rowVariants = {
  hidden: { y: 36, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.6, ease: ease.ui } },
  exit: { y: -28, opacity: 0, transition: { duration: 0.28, ease: ease.primary } },
};

export function CategoryTabs({ value, onChange, id = 'menu-pill', items = categories, className = '-mx-4 px-4 md:mx-0 md:px-0' }) {
  return (
    <div role="tablist" aria-label="Menu categories" className={`no-scrollbar flex gap-1 overflow-x-auto ${className}`}>
      {items.map((c) => {
        const on = c.id === value;
        return (
          <button
            key={c.id}
            role="tab"
            aria-selected={on}
            type="button"
            onClick={() => onChange(c.id)}
            className={`relative min-h-[44px] shrink-0 whitespace-nowrap rounded-full px-4 text-[13px] font-medium transition-colors duration-300 ${on ? 'text-ink' : 'text-ash hover:text-bone'}`}
          >
            {on && <motion.span layoutId={id} className="absolute inset-0 rounded-full bg-ember" transition={{ type: 'spring', stiffness: 320, damping: 30 }} />}
            <span className="relative">{c.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function LoopArrowLink({ to, children }) {
  return (
    <Link to={to} className="group inline-flex min-h-[44px] items-center gap-3 text-lg font-medium text-bone">
      <span className="relative">
        {children}
        <span className="absolute -bottom-1 left-0 right-0 h-px bg-bone/30" />
        <span className="absolute -bottom-1 left-0 right-0 h-px origin-right scale-x-0 bg-bone transition-transform duration-500 ease-ui group-hover:origin-left group-hover:scale-x-100" />
      </span>
      <span className="relative inline-block h-5 w-5 overflow-hidden" aria-hidden>
        <span className="absolute inset-0 transition-transform duration-500 ease-ui group-hover:translate-x-full">→</span>
        <span className="absolute inset-0 -translate-x-full transition-transform duration-500 ease-ui group-hover:translate-x-0">→</span>
      </span>
    </Link>
  );
}

export default function MenuPreview() {
  const [cat, setCat] = useState('small');
  const [hover, setHover] = useState(null);
  const fine = useFinePointer();
  const items = menu.filter((m) => m.category === cat).slice(0, 6);

  return (
    <div id="menu-preview" className="px-4 pb-24 pt-24 md:px-10 md:pb-28 md:pt-28">
      <div className="grid gap-8 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="meta mb-4 text-ash">— The menu</p>
          <SplitText as="h2" text="Thirty-two plates. *One* fire." className="section-title block max-w-[10ch] text-[clamp(2.4rem,4.4vw,5.4rem)]" />
          <p className="mt-6 max-w-[36ch] text-[14px] leading-relaxed text-ash">
            Small plates to start, something from the coals, bread from the clay. Order the way Lahore eats: everything in the middle.
          </p>
        </div>
        <div className="md:col-span-7">
          <CategoryTabs value={cat} onChange={setCat} />
          <AnimatePresence mode="wait">
            <motion.ul
              key={cat}
              className="mt-4 border-t border-bone/10"
              initial="hidden"
              animate="show"
              exit="exit"
              variants={{ show: { transition: { staggerChildren: 0.04 } }, exit: { transition: { staggerChildren: 0.02 } } }}
              onMouseLeave={() => setHover(null)}
            >
              {items.map((item) => (
                <MenuRow key={item.id} item={item} variants={rowVariants} onHover={fine ? setHover : undefined} onLeave={() => setHover(null)} />
              ))}
            </motion.ul>
          </AnimatePresence>
          <div className="mt-10">
            <LoopArrowLink to="/menu">See the full menu</LoopArrowLink>
          </div>
        </div>
      </div>
      {fine && <HoverImage item={hover} />}
    </div>
  );
}
