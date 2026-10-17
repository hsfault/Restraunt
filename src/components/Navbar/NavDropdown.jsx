import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { menu, categories } from '../../data/menu.js';
import { rooms } from '../../data/gallery.js';
import RevealImage from '../RevealImage.jsx';
import { ease } from '../../lib/motion.js';
import { useHashLink } from '../../lib/useHashLink.js';

const COLUMNS = ['small', 'fire', 'desserts'];

function MenuColumns({ close }) {
  return (
    <div className="grid grid-cols-3 divide-x divide-bone/10">
      {COLUMNS.map((cat, ci) => {
        const items = menu.filter((m) => m.category === cat);
        const lead = items.find((m) => m.chefsPick) ?? items[0];
        return (
          <div key={cat} className="px-5 first:pl-1 last:pr-1">
            <p className="meta mb-3 text-ash">
              0{ci + 1} — {categories.find((c) => c.id === cat).label}
            </p>
            <RevealImage src={lead.image} alt={lead.name} ratio="4 / 3" className="mb-4 rounded-xl" delay={0.05 + ci * 0.06} play eager />
            <ul className="space-y-0.5">
              {items.slice(0, 4).map((m) => (
                <li key={m.id}>
                  <Link
                    to={`/menu#${m.id}`}
                    onClick={close}
                    className="flex min-h-[32px] items-center justify-between gap-3 text-[13px] text-ash transition-colors hover:text-bone"
                  >
                    <span className="truncate">{m.name}</span>
                    <span className="font-mono text-[11px] tabular text-ash/70">{m.price.toLocaleString('en-US')}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

function PrivateColumns({ close }) {
  const hash = useHashLink();
  return (
    <div className="grid grid-cols-3 divide-x divide-bone/10">
      {rooms.map((r, i) => (
        <Link key={r.id} to="/#private" onClick={hash('/#private', close)} className="group block px-5 first:pl-1 last:pr-1">
          <RevealImage src={r.image} alt={r.name} ratio="4 / 3" className="mb-3 rounded-xl" delay={0.05 + i * 0.06} play eager />
          <p className="text-[15px] font-semibold text-bone">{r.name}</p>
          <p className="meta mt-1 text-ash">{r.meta}</p>
        </Link>
      ))}
    </div>
  );
}

export default function NavDropdown({ kind, onEnter, onLeave, close }) {
  return (
    <motion.div
      className="absolute left-0 right-0 top-full mx-auto mt-2 w-[min(760px,calc(100vw-24px))] rounded-[18px] p-5 glass-nav"
      style={{ backgroundColor: 'rgba(21,19,17,0.82)' }}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: ease.ui }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {kind === 'menu' ? <MenuColumns close={close} /> : <PrivateColumns close={close} />}
      <div className="mt-5 flex items-center justify-between border-t border-bone/10 pt-4">
        <p className="serif-em text-lg text-bone/80">
          {kind === 'menu' ? 'Thirty-two plates. One fire.' : 'Rooms for eight to thirty. Menus built around the hearth.'}
        </p>
        <Link to={kind === 'menu' ? '/menu' : '/reserve'} onClick={close} className="meta flex min-h-[44px] items-center text-bone hover:text-ember">
          {kind === 'menu' ? 'Full menu →' : 'Enquire →'}
        </Link>
      </div>
    </motion.div>
  );
}
