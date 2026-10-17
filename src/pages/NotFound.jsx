import PageTransition from '../components/PageTransition.jsx';
import PageTitle from '../components/PageTitle.jsx';
import Footer from '../components/Footer.jsx';
import { LoopArrowLink } from '../sections/MenuPreview.jsx';

export default function NotFound() {
  return (
    <PageTransition>
      <main className="min-h-[70svh] pb-24">
        <PageTitle text="LOST" eyebrow="— 404" />
        <div className="px-4 md:px-8">
          <p className="serif-em text-[clamp(2rem,4vw,3.4rem)] text-bone">The coals went out here.</p>
          <p className="mt-3 max-w-[40ch] text-ash">This page doesn’t exist, or it never made it off the grill. The fire is still going at home.</p>
          <div className="mt-8">
            <LoopArrowLink to="/">Back to the fire</LoopArrowLink>
          </div>
        </div>
      </main>
      <Footer />
    </PageTransition>
  );
}
