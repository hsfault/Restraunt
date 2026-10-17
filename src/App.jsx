import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import { Route, Routes, useLocation } from 'react-router-dom';
import { useUI } from './store/ui.js';
import { useBag } from './store/bag.js';
import { initLenis, resetScroll } from './lib/lenis.js';
import Navbar from './components/Navbar/Navbar.jsx';
import Preloader from './components/Preloader.jsx';
import BagDrawer from './components/BagDrawer.jsx';
import FlyToBag from './components/FlyToBag.jsx';
import Printer from './components/Receipt/Printer.jsx';
import { labelFor } from './components/PageTransition.jsx';
import Home from './pages/Home.jsx';
import MenuPage from './pages/Menu.jsx';
import BagPage from './pages/Bag.jsx';
import ReservePage from './pages/Reserve.jsx';
import NotFound from './pages/NotFound.jsx';

export const INTRO_KEY = 'saltfire-intro';

export default function App() {
  const location = useLocation();
  const [preloader, setPreloader] = useState(() => useUI.getState().intro === 'running');
  const first = useRef(true);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    initLenis({ smooth: !reduced });
  }, []);

  useEffect(() => {
    useUI.getState().setDestLabel(labelFor(location.pathname));
    useBag.getState().setOpen(false);
    if (first.current) {
      first.current = false;
      return;
    }
    useUI.getState().setNavigated();
  }, [location.pathname]);

  const onIntroDone = useCallback(() => {
    try {
      sessionStorage.setItem(INTRO_KEY, '1');
    } catch {
      /* private mode: the intro simply plays again next time */
    }
    setPreloader(false);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#main"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById('main')?.focus();
        }}
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-curtain focus:rounded-lg focus:bg-bone focus:px-4 focus:py-3 focus:text-ink">
        Skip to content
      </a>
      <Navbar />
      <div id="main" tabIndex={-1} className="outline-none">
        <AnimatePresence mode="wait" onExitComplete={resetScroll}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/bag" element={<BagPage />} />
            <Route path="/reserve" element={<ReservePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </div>
      <BagDrawer />
      <FlyToBag />
      <Printer />
      {preloader && <Preloader onDone={onIntroDone} />}
      <div className="grain z-grain" aria-hidden />
    </MotionConfig>
  );
}
