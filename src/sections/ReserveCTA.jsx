import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import SparkCanvas from '../components/SparkCanvas.jsx';
import SplitText from '../components/SplitText.jsx';
import MagneticButton from '../components/MagneticButton.jsx';

export default function ReserveCTA() {
  return (
    <div className="relative isolate flex min-h-[88svh] flex-col justify-between overflow-hidden px-4 pb-10 pt-24 text-ink md:px-10 md:pb-14 md:pt-28">
      <SparkCanvas className="-z-10" />
      <p className="meta text-ink/70">— Tables from Tuesday · 6:00pm</p>
      <h2 className="display my-16 text-[clamp(3.4rem,11vw,11rem)] leading-[0.86]">
        <SplitText text="Your table is" by="chars" stagger={0.025} className="block" />
        <SplitText text="*waiting.*" by="chars" stagger={0.04} delay={0.3} className="block normal-case" emClass="serif-em" />
      </h2>
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <p className="max-w-[36ch] text-[14px] leading-relaxed text-ink/75">
          Forty-six seats and eight at the hearth counter. Walk-ins welcome at the bar. Deposit of Rs 2,000 holds the table and comes off the bill.
        </p>
        <div className="flex flex-wrap gap-3">
          <MagneticButton to="/reserve" className="btn-ink h-14 px-7 text-[15px]" cursor="reserve">
            Reserve a table
            <ArrowUpRight className="h-4 w-4" />
          </MagneticButton>
          <Link to="/menu" className="inline-flex h-14 items-center justify-center rounded-xl border border-ink/40 px-7 text-[15px] font-medium text-ink transition-colors hover:bg-ink hover:text-bone">
            Order for pickup
          </Link>
        </div>
      </div>
    </div>
  );
}
