import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useSplitText } from '../lib/useSplitText.js';
import { ease } from '../lib/motion.js';

const parent = (delay, stagger) => ({
  hidden: {},
  show: { transition: { delayChildren: delay, staggerChildren: stagger } },
});
const child = (duration) => ({
  hidden: { y: '110%' },
  show: { y: '0%', transition: { duration, ease: ease.ui } },
});

// Masked text reveal. by="chars" | "words". Words wrapped in *asterisks* get
// `emClass`. Without `play`, it triggers when scrolled into view.
export default function SplitText({
  text,
  as = 'span',
  by = 'words',
  play,
  delay = 0,
  stagger = 0.05,
  duration = 0.9,
  className = '',
  emClass = 'serif-em',
  wordClass = '',
  once = true,
  margin = '0px 0px -12% 0px',
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin });
  const show = play === undefined ? inView : play;
  const words = useSplitText(text);
  const Tag = motion[as] ?? motion.span;

  return (
    <Tag
      ref={ref}
      className={className}
      aria-label={text.replace(/\*/g, '')}
      initial="hidden"
      animate={show ? 'show' : 'hidden'}
      variants={parent(delay, stagger)}
    >
      {words.map((w, i) => (
        <span key={i} aria-hidden className={`inline-block whitespace-nowrap ${w.em ? emClass : ''} ${wordClass}`}>
          {by === 'chars' ? (
            w.chars.map((c, j) => (
              <span key={j} className="mask-loose">
                <motion.span className="inline-block" variants={child(duration)}>
                  {c}
                </motion.span>
              </span>
            ))
          ) : (
            <span className="mask-loose">
              <motion.span className="inline-block" variants={child(duration)}>
                {w.text}
              </motion.span>
            </span>
          )}
          {i < words.length - 1 ? ' ' : null}
        </span>
      ))}
    </Tag>
  );
}
