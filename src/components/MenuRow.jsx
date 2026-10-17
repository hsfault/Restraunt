import { forwardRef, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import Img from './Img.jsx';
import { rs } from '../lib/format.js';
import { useAddToBag } from './FlyToBag.jsx';

// Editorial menu row: name, dotted leader, price; description and tags beneath.
const MenuRow = forwardRef(function MenuRow({ item, onHover, onLeave, flash = false, variants, thumb = false }, ref) {
  const addToBag = useAddToBag();
  const btn = useRef(null);
  const thumbRef = useRef(null);
  return (
    <motion.li
      ref={ref}
      id={item.id}
      layout="position"
      variants={variants}
      exit={variants ? 'exit' : undefined}
      className={`group relative scroll-mt-40 border-b border-bone/10 ${flash ? 'row-flash' : ''}`}
      onMouseEnter={() => onHover?.(item)}
      onMouseLeave={() => onLeave?.()}
    >
      <div className="flex items-center gap-4 py-5 md:py-6">
        {thumb && (
          <div ref={thumbRef} className="h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-smoke md:hidden">
            <Img src={item.image} alt="" className="h-full w-full object-cover" />
          </div>
        )}
        <div className="min-w-0 flex-1 transition-transform duration-500 ease-ui md:group-hover:translate-x-3">
          <div className="flex items-baseline">
            <h3 className="text-[1.05rem] font-semibold leading-tight text-bone/85 transition-colors duration-300 group-hover:text-bone md:text-[1.6rem] md:tracking-[-0.01em]">
              {item.name}
            </h3>
            <span className="leader" aria-hidden />
            <span className="whitespace-nowrap font-mono text-[13px] tabular text-bone md:text-[15px]">{rs(item.price)}</span>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <p className="text-[13px] leading-snug text-ash md:text-sm">{item.desc}</p>
            {(item.tags.length > 0 || item.chefsPick) && (
              <span className="flex gap-1.5">
                {item.chefsPick && <span className="chip border-saffron/40 text-saffron">★ Pick</span>}
                {item.tags.map((t) => (
                  <span key={t} className="chip" title={{ V: 'Vegetarian', GF: 'Gluten-free', HOT: 'Spicy' }[t]}>
                    {t}
                  </span>
                ))}
              </span>
            )}
          </div>
        </div>
        <button
          ref={btn}
          type="button"
          onClick={() => addToBag(item, thumbRef.current?.offsetParent ? thumbRef.current : btn.current)}
          className="tap flex shrink-0 items-center justify-center gap-1 rounded-full border border-bone/15 px-3 font-mono text-[11px] uppercase tracking-[0.12em] text-bone transition-all duration-300 ease-ui hover:border-ember hover:bg-ember hover:text-ink focus-visible:opacity-100 md:translate-x-2 md:opacity-0 md:group-hover:translate-x-0 md:group-hover:opacity-100"
          aria-label={`Add ${item.name} to bag`}
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={2} />
          Add
        </button>
      </div>
    </motion.li>
  );
});

export default MenuRow;
