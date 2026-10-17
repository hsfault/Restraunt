import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useMagnetic } from '../lib/useMagnetic.js';

export default function MagneticButton({ to, onClick, className = '', children, strength = 8, cursor, type = 'button', ...rest }) {
  const { ref, style, handlers } = useMagnetic(strength);
  return (
    <motion.div ref={ref} style={style} {...handlers} className="inline-block">
      {to ? (
        <Link to={to} onClick={onClick} className={className} data-cursor={cursor} {...rest}>
          {children}
        </Link>
      ) : (
        <button type={type} onClick={onClick} className={className} data-cursor={cursor} {...rest}>
          {children}
        </button>
      )}
    </motion.div>
  );
}
