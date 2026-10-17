import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useAnimate } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ShoppingBag } from 'lucide-react';
import { navLinks } from '../../data/brand.js';
import { useBag } from '../../store/bag.js';
import { useUI } from '../../store/ui.js';
import { useIsDesktop } from '../../lib/useMediaQuery.js';
import { useHashLink } from '../../lib/useHashLink.js';
import { ease, popSpring, spring } from '../../lib/motion.js';
import FlameMark from './FlameMark.jsx';
import NavDropdown from './NavDropdown.jsx';
import NavSearch from './NavSearch.jsx';
import MobileMenu from './MobileMenu.jsx';

function BagButton() {
  const count = useBag((s) => s.items.reduce((n, i) => n + i.qty, 0));
  const setOpen = useBag((s) => s.setOpen);
  const [scope, animate] = useAnimate();
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (scope.current) animate(scope.current, { scale: [1.6, 1] }, popSpring);
  }, [count, animate, scope]);

  return (
    <motion.button
      layout="position"
      type="button"
      data-bag-target
      onClick={() => setOpen(true)}
      className="relative grid h-11 w-11 place-items-center rounded-full text-bone transition-colors hover:bg-smoke"
      aria-label={`Open bag, ${count} ${count === 1 ? 'item' : 'items'}`}
    >
      <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.6} />
      <span
        ref={scope}
        className={`absolute right-0.5 top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-ember px-1 font-mono text-[10px] font-medium text-ink tabular transition-opacity ${
          count ? 'opacity-100' : 'opacity-0'
        }`}
        aria-hidden
      >
        {count}
      </span>
    </motion.button>
  );
}

function Burger({ open, toggle }) {
  return (
    <button
      type="button"
      onClick={toggle}
      className="relative h-11 w-11 rounded-full"
      aria-expanded={open}
      aria-controls="mobile-menu"
      aria-label={open ? 'Close menu' : 'Open menu'}
    >
      <motion.span
        className="absolute left-3 right-3 top-1/2 h-[1.5px] bg-bone"
        initial={false}
        animate={open ? { y: 0, rotate: 45 } : { y: -4, rotate: 0 }}
        transition={spring}
      />
      <motion.span
        className="absolute left-3 right-3 top-1/2 h-[1.5px] bg-bone"
        initial={false}
        animate={open ? { y: 0, rotate: -45 } : { y: 4, rotate: 0 }}
        transition={spring}
      />
    </button>
  );
}

export default function Navbar() {
  const isDesktop = useIsDesktop();
  const location = useLocation();
  const hash = useHashLink();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdown, setDropdown] = useState(null);
  const closeTimer = useRef(0);

  const intro = useUI((s) => s.intro);
  const searchOpen = useUI((s) => s.searchOpen);
  const setSearchOpen = useUI((s) => s.setSearchOpen);
  const mobileMenu = useUI((s) => s.mobileMenu);
  const setMobileMenu = useUI((s) => s.setMobileMenu);
  const flying = useUI((s) => s.flights.length > 0);
  const setNavHidden = useUI((s) => s.setNavHidden);

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 80);
    if (y > prev + 2 && y > 140) setHidden(true);
    else if (y < prev - 2 || y < 140) setHidden(false);
  });

  const isHidden = hidden && !flying && !searchOpen && !dropdown && !mobileMenu;
  useEffect(() => setNavHidden(isHidden), [isHidden, setNavHidden]);

  useEffect(() => {
    setMobileMenu(false);
    setDropdown(null);
    setSearchOpen(false);
  }, [location.pathname, setMobileMenu, setSearchOpen]);

  useEffect(() => {
    if (isDesktop) setMobileMenu(false);
  }, [isDesktop, setMobileMenu]);

  const cancelClose = () => clearTimeout(closeTimer.current);
  const scheduleClose = (delay = 120) => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setDropdown(null), delay);
  };
  const openDropdown = (kind) => {
    cancelClose();
    setDropdown(kind);
  };

  useEffect(() => {
    if (!dropdown) return undefined;
    const onKey = (e) => e.key === 'Escape' && setDropdown(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [dropdown]);

  return (
    <>
      <motion.header
        className="pointer-events-none fixed inset-x-0 top-4 z-nav flex justify-center px-3"
        initial={false}
        animate={{ y: intro === 'running' ? -120 : isHidden ? '-140%' : 0 }}
        transition={{ duration: intro === 'running' ? 0 : 0.55, ease: ease.ui, delay: intro === 'lifting' ? 0.35 : 0 }}
        onMouseEnter={cancelClose}
        onMouseLeave={() => scheduleClose()}
      >
        <div className="pointer-events-auto relative w-full max-w-[1080px] lg:w-auto">
          <motion.nav
            layout
            transition={spring}
            aria-label="Primary"
            className="glass-nav flex h-[60px] items-center justify-between pl-4 pr-2 lg:justify-start lg:gap-8"
            style={{ borderRadius: 18, backgroundColor: scrolled || mobileMenu ? 'rgba(21,19,17,0.82)' : 'rgba(21,19,17,0.55)' }}
          >
            <motion.div layout="position">
              <Link to="/" className="flex min-h-[44px] items-center gap-2" aria-label="SALTFIRE, home">
                <FlameMark />
                <span className="wordmark text-[15px] leading-none tracking-[-0.02em]">SALTFIRE</span>
              </Link>
            </motion.div>

            {isDesktop && (
              <motion.ul layout="position" className="flex items-center" style={{ gap: searchOpen ? 14 : 26 }} transition={spring}>
                {navLinks.map((l) => (
                  <motion.li
                    layout="position"
                    transition={spring}
                    key={l.id}
                    onMouseEnter={() => (l.dropdown ? openDropdown(l.dropdown) : scheduleClose(0))}
                    onFocus={() => (l.dropdown ? openDropdown(l.dropdown) : setDropdown(null))}
                  >
                    <Link
                      to={l.to}
                      onClick={hash(l.to, () => setDropdown(null))}
                      className="group relative flex h-11 items-center gap-1 whitespace-nowrap text-[14px] text-ash transition-colors duration-300 hover:text-bone"
                      aria-haspopup={l.dropdown ? 'true' : undefined}
                      aria-expanded={l.dropdown ? dropdown === l.dropdown : undefined}
                    >
                      {l.label}
                      {l.dropdown && (
                        <ChevronDown
                          className={`h-3.5 w-3.5 transition-transform duration-300 ease-ui group-hover:rotate-180 ${dropdown === l.dropdown ? 'rotate-180' : ''}`}
                          strokeWidth={1.75}
                        />
                      )}
                      <span className="absolute bottom-2.5 left-0 right-0 h-[1.5px] origin-right scale-x-0 bg-bone transition-transform duration-300 ease-ui group-hover:origin-left group-hover:scale-x-100" />
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>
            )}

            <motion.div layout="position" transition={spring} className="flex items-center gap-1.5">
              {isDesktop && <NavSearch />}
              <BagButton />
              {isDesktop ? (
                <motion.div layout="position" transition={spring}>
                  <Link to="/reserve" className="btn-bone ml-1 h-11 min-h-0 rounded-xl px-4 text-[14px]" data-cursor="reserve">
                    Reserve
                  </Link>
                </motion.div>
              ) : (
                <Burger open={mobileMenu} toggle={() => setMobileMenu(!mobileMenu)} />
              )}
            </motion.div>
          </motion.nav>

          <AnimatePresence>
            {isDesktop && dropdown && (
              <NavDropdown key={dropdown} kind={dropdown} onEnter={cancelClose} onLeave={() => scheduleClose()} close={() => setDropdown(null)} />
            )}
          </AnimatePresence>
        </div>
      </motion.header>
      <MobileMenu open={mobileMenu} close={() => setMobileMenu(false)} />
    </>
  );
}
