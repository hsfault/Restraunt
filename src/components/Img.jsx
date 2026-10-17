import { useState } from 'react';
import { motion } from 'framer-motion';

// Lazy image with a gradient fallback if the file failed to generate or load.
export default function Img({ src, alt, className = '', eager = false, animated = false, ...rest }) {
  const [failed, setFailed] = useState(false);
  if (failed || !src) {
    return <div role="img" aria-label={alt} className={`img-fallback ${className}`} />;
  }
  const Tag = animated ? motion.img : 'img';
  return (
    <Tag
      src={src}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      draggable={false}
      onError={() => setFailed(true)}
      className={className}
      {...rest}
    />
  );
}
