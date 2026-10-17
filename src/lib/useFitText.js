import { useLayoutEffect, useRef, useState } from 'react';

// Sizes a single line of text so it spans its container edge to edge.
export function useFitText({ max = Infinity, min = 0 } = {}) {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const [size, setSize] = useState(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const text = textRef.current;
    if (!container || !text) return undefined;
    const measure = () => {
      text.style.fontSize = '100px';
      const w = text.scrollWidth;
      const available = container.clientWidth;
      text.style.fontSize = '';
      if (!w) return;
      setSize(Math.max(min, Math.min(max, (100 * available) / w)));
    };
    measure();
    document.fonts?.ready.then(measure);
    const ro = new ResizeObserver(measure);
    ro.observe(container);
    return () => ro.disconnect();
  }, [max, min]);

  return { containerRef, textRef, fontSize: size };
}
