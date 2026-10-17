import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { brand, navLinks } from '../../data/brand.js';
import { useScrollLock } from '../../lib/lenis.js';
import { useHashLink } from '../../lib/useHashLink.js';
import { ease } from '../../lib/motion.js';

export default function MobileMenu({ open, close }) {
  useScrollLock(open, 'mobile-menu');
  const hash = useHashLink();
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          className="fixed inset-0 z-[55] flex flex-col overflow-y-auto bg-ink px-5 pb-8 pt-28"
          initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
          animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
          transition={{ duration: 0.8, ease: ease.primary }}
          data-lenis-prevent
        >
          <nav aria-label="Mobile">
            <ul>
              {navLinks.map((l, i) => (
                <li key={l.id} className="border-b border-bone/10">
                  <Link to={l.to} onClick={hash(l.to, close)} className="flex min-h-[44px] items-baseline gap-4 py-2">
                    <span className="meta w-6 text-ash">0{i + 1}</span>
                    <span className="mask">
                      <motion.span
                        className="display inline-block text-[12vw] leading-[0.95] text-bone"
                        initial={{ y: '110%' }}
                        animate={{ y: '0%' }}
                        exit={{ y: '110%' }}
                        transition={{ duration: 0.9, ease: ease.ui, delay: 0.25 + i * 0.06 }}
                      >
                        {l.label}
                      </motion.span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <motion.div
            className="mt-auto grid grid-cols-2 gap-6 pt-10 text-[13px] text-ash"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div>
              <p className="meta mb-2 text-bone">Hours</p>
              <p>Tue – Sun</p>
              <p>6:00pm – 12:00am</p>
              <p>Closed Monday</p>
            </div>
            <div>
              <p className="meta mb-2 text-bone">Find us</p>
              {brand.addressLines.map((a) => (
                <p key={a}>{a}</p>
              ))}
              <a href={brand.phoneHref} className="mt-1 inline-flex min-h-[44px] items-center text-bone">
                {brand.phone}
              </a>
            </div>
            <Link to="/reserve" onClick={close} className="btn-ember col-span-2 w-full">
              Reserve a table
            </Link>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
