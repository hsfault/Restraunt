import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Img from './Img.jsx';
import { ease } from '../lib/motion.js';

// clip-path wipe from the bottom while the image settles from 1.25 to 1.
export default function RevealImage({
  src,
  alt,
  className = '',
  imgClassName = '',
  ratio,
  delay = 0,
  play,
  eager = false,
  style,
  children,
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const show = play === undefined ? inView : play;
  return (
    <motion.div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      style={{ aspectRatio: ratio, ...style }}
      initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
      animate={{ clipPath: show ? 'inset(0% 0% 0% 0%)' : 'inset(100% 0% 0% 0%)' }}
      transition={{ duration: 1.1, ease: ease.primary, delay }}
    >
      <Img
        animated
        src={src}
        alt={alt}
        eager={eager}
        className={`h-full w-full object-cover ${imgClassName}`}
        initial={{ scale: 1.25 }}
        animate={{ scale: show ? 1 : 1.25 }}
        transition={{ duration: 1.4, ease: ease.ui, delay }}
      />
      {children}
    </motion.div>
  );
}
