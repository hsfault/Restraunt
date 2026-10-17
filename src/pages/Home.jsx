import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PageTransition from '../components/PageTransition.jsx';
import Ticker from '../components/Ticker.jsx';
import Footer from '../components/Footer.jsx';
import { Stack, Panel } from '../components/Stack.jsx';
import Hero from '../sections/Hero.jsx';
import FireScene from '../sections/FireScene.jsx';
import Coverflow from '../sections/Coverflow.jsx';
import Anatomy from '../sections/Anatomy.jsx';
import MenuPreview from '../sections/MenuPreview.jsx';
import Numbers from '../sections/Numbers.jsx';
import Chef from '../sections/Chef.jsx';
import PrivateGallery from '../sections/PrivateGallery.jsx';
import Press from '../sections/Press.jsx';
import ReserveCTA from '../sections/ReserveCTA.jsx';
import { ingredients } from '../data/brand.js';
import { useUI } from '../store/ui.js';
import { scrollToTarget } from '../lib/lenis.js';

export default function Home() {
  const location = useLocation();

  // Deep links like "/#chef": wait for the curtain (or preloader) to clear first.
  useEffect(() => {
    if (!location.hash) return undefined;
    const { navigated, intro } = useUI.getState();
    const delay = intro === 'running' ? 3900 : navigated ? 900 : 300;
    const t = setTimeout(() => scrollToTarget(location.hash), delay);
    return () => clearTimeout(t);
  }, [location.hash, location.key]);

  return (
    <PageTransition>
      <main>
        <Hero />
        <Ticker items={ingredients} />
        <Stack>
          <FireScene key="fire" />
          <Panel key="signature" aria-label="Signature dishes">
            <Coverflow />
          </Panel>
          <Panel key="anatomy" tone="dark">
            <Anatomy />
          </Panel>
          <Panel key="menu" aria-label="Menu preview">
            <MenuPreview />
          </Panel>
          <Panel key="numbers" aria-label="By the numbers">
            <Numbers />
          </Panel>
          <Panel key="chef" id="chef" aria-label="The chef">
            <Chef />
          </Panel>
          <Panel key="private" id="private" aria-label="Private dining">
            <PrivateGallery />
          </Panel>
          <Panel key="press" aria-label="Press">
            <Press />
          </Panel>
          <Panel key="reserve" tone="ember" aria-label="Reserve">
            <ReserveCTA />
          </Panel>
        </Stack>
      </main>
      <Footer />
    </PageTransition>
  );
}
