import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { menu, menuById, categories } from '../data/menu.js';
import { useUI } from '../store/ui.js';
import { useFinePointer } from '../lib/useMediaQuery.js';
import { scrollToTarget } from '../lib/lenis.js';
import { ease } from '../lib/motion.js';
import PageTransition from '../components/PageTransition.jsx';
import PageTitle from '../components/PageTitle.jsx';
import MenuRow from '../components/MenuRow.jsx';
import HoverImage from '../components/HoverImage.jsx';
import Footer from '../components/Footer.jsx';
import { CategoryTabs, rowVariants } from '../sections/MenuPreview.jsx';

const FILTERS = [
  { id: 'all', label: 'All', test: () => true },
  { id: 'veg', label: 'Vegetarian', test: (m) => m.tags.includes('V') },
  { id: 'gf', label: 'Gluten-free', test: (m) => m.tags.includes('GF') },
  { id: 'pick', label: 'Chef’s pick', test: (m) => m.chefsPick },
];

export default function MenuPage() {
  const location = useLocation();
  const fine = useFinePointer();
  const navHidden = useUI((s) => s.navHidden);
  const [filter, setFilter] = useState('all');
  const [activeCat, setActiveCat] = useState(categories[0].id);
  const [flash, setFlash] = useState(null);
  const [hover, setHover] = useState(null);
  const viaNav = useRef(useUI.getState().navigated);

  const test = FILTERS.find((f) => f.id === filter).test;
  const groups = useMemo(
    () => categories.map((c) => ({ ...c, items: menu.filter((m) => m.category === c.id && test(m)) })).filter((g) => g.items.length),
    [test],
  );

  // Scroll spy for the sticky category bar.
  useEffect(() => {
    const els = [...document.querySelectorAll('[data-cat]')];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActiveCat(e.target.getAttribute('data-cat'))),
      { rootMargin: '-30% 0px -65% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [groups]);

  // Deep link from search: /menu#dish-id scrolls to the row and flashes it ember.
  useEffect(() => {
    const id = decodeURIComponent(location.hash.slice(1));
    if (!id || !menuById[id]) return undefined;
    if (!test(menuById[id])) setFilter('all');
    const { intro } = useUI.getState();
    const delay = intro === 'running' ? 3900 : viaNav.current ? 950 : 150;
    viaNav.current = false;
    let clear = 0;
    const t = setTimeout(() => {
      scrollToTarget(`#${CSS.escape(id)}`, { offset: -window.innerHeight * 0.35 });
      setFlash(id);
      clear = setTimeout(() => setFlash(null), 3800);
    }, delay);
    return () => {
      clearTimeout(t);
      clearTimeout(clear);
    };
  }, [location.hash, location.key]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <PageTransition>
      <main className="pb-24">
        <PageTitle
          text="MENU"
          eyebrow="— Everything here meets the fire"
          aside={<>Thirty-two plates across five sections. Prices in PKR; 16% tax and 5% service added at checkout.</>}
        />

        <div className="px-4 md:px-8">
          <div className="flex flex-wrap items-center gap-2 border-y border-bone/10 py-4" role="group" aria-label="Filter the menu">
            <span className="meta mr-2 text-ash">Filter</span>
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                aria-pressed={filter === f.id}
                className={`min-h-[44px] rounded-full border px-4 text-[13px] transition-colors duration-300 ${
                  filter === f.id ? 'border-bone bg-bone text-ink' : 'border-bone/15 text-ash hover:border-bone/40 hover:text-bone'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <motion.div
          className="sticky top-3 z-30 mt-6 flex justify-center px-3"
          animate={{ y: navHidden ? 0 : 72 }}
          transition={{ duration: 0.55, ease: ease.ui }}
        >
          <div className="glass-nav max-w-full rounded-full p-1">
            <CategoryTabs
              id="menu-page-pill"
              className=""
              value={activeCat}
              items={categories.filter((c) => groups.some((g) => g.id === c.id))}
              onChange={(id) => {
                setActiveCat(id);
                scrollToTarget(`#cat-${id}`, { offset: -150 });
              }}
            />
          </div>
        </motion.div>

        <div className="mt-6 px-4 md:px-8" onMouseLeave={() => setHover(null)}>
          <AnimatePresence mode="popLayout" initial={false}>
            {groups.map((g, gi) => (
              <motion.section
                layout="position"
                key={g.id}
                id={`cat-${g.id}`}
                data-cat={g.id}
                className="grid scroll-mt-40 gap-4 pt-14 md:grid-cols-12 md:gap-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: ease.ui }}
                aria-labelledby={`h-${g.id}`}
              >
                <div className="md:col-span-3">
                  <div className="md:sticky md:top-40">
                    <p className="meta text-ash">0{gi + 1}</p>
                    <h2 id={`h-${g.id}`} className="display mt-2 text-[clamp(2rem,3.4vw,3.2rem)] leading-[0.9]">
                      {g.label}
                    </h2>
                    <p className="meta mt-3 text-ash tabular">{String(g.items.length).padStart(2, '0')} plates</p>
                  </div>
                </div>
                <motion.ul className="border-t border-bone/10 md:col-span-9" initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.04 } } }}>
                  <AnimatePresence mode="popLayout" initial={false}>
                    {g.items.map((item) => (
                      <MenuRow key={item.id} item={item} thumb variants={rowVariants} flash={flash === item.id} onHover={fine ? setHover : undefined} onLeave={() => setHover(null)} />
                    ))}
                  </AnimatePresence>
                </motion.ul>
              </motion.section>
            ))}
          </AnimatePresence>
          <p className="mt-16 max-w-[60ch] text-[13px] leading-relaxed text-ash">
            V vegetarian · GF gluten-free · HOT carries real heat. Tell us about allergies when you order; the kitchen shares one fire, so we can’t promise a trace-free plate. The bar is zero-proof.
          </p>
        </div>
        {fine && <HoverImage item={hover} />}
      </main>
      <Footer />
    </PageTransition>
  );
}
