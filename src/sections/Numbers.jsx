import { useEffect, useRef, useState } from 'react';
import { animate, useInView } from 'framer-motion';
import { numbers } from '../data/brand.js';
import { ease } from '../lib/motion.js';

function Count({ from = 0, to, format = (v) => v.toLocaleString('en-US') }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' });
  const [v, setV] = useState(from);
  useEffect(() => {
    if (!inView) return undefined;
    const c = animate(from, to, { duration: 2, ease: ease.ui, onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [inView, from, to]);
  return (
    <span ref={ref} className="tabular" aria-label={format(to)}>
      {format(v)}
    </span>
  );
}

export default function Numbers() {
  const { year, seats, heat } = numbers;
  return (
    <div className="px-3 pb-16 pt-20 md:px-6 md:pb-20 md:pt-24">
      <p className="meta mb-6 px-1 text-ash md:px-4">— By the numbers</p>
      <div className="flex flex-col gap-3 md:flex-row md:items-stretch">
        <div className="flex min-h-[340px] flex-col justify-between rounded-[24px] bg-ember p-6 text-ink md:min-h-[520px] md:w-[40%] md:p-9">
          <p className="meta text-ink/70">Gulberg III · Lahore</p>
          <div>
            <p className="font-mono text-[clamp(5rem,13vw,11rem)] font-bold leading-[0.85] tracking-[-0.06em]">
              <Count from={1990} to={year.value} format={(v) => String(v)} />
            </p>
            <p className="mt-4 text-2xl font-semibold tracking-[-0.02em]">{year.label}</p>
            <p className="mt-1 max-w-[30ch] text-[14px] text-ink/70">{year.sub}</p>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-[1.5] flex-col justify-between rounded-[24px] border border-bone/25 p-6 md:p-9">
            <p className="meta text-ash">Capacity</p>
            <div className="mt-10 flex flex-wrap items-end justify-between gap-4">
              <p className="font-mono text-[clamp(4rem,10vw,8.5rem)] font-bold leading-[0.85] tracking-[-0.06em] text-bone">
                <Count to={seats.value} />
                <span className="ml-3 align-baseline font-sans text-[clamp(1.2rem,2vw,1.8rem)] font-semibold tracking-[-0.01em]">{seats.label}</span>
              </p>
              <p className="max-w-[22ch] text-[14px] text-ash">{seats.sub}</p>
            </div>
          </div>
          <div className="flex flex-1 flex-col justify-between rounded-[24px] border border-bone/25 p-6 md:ml-[14%] md:p-9">
            <p className="meta text-ash">Heat</p>
            <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
              <p className="font-mono text-[clamp(3rem,7vw,6rem)] font-bold leading-[0.85] tracking-[-0.06em] text-bone">
                <Count to={heat.value} />
                <span>{heat.label}</span>
              </p>
              <p className="max-w-[22ch] text-[14px] text-ash">{heat.sub}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
