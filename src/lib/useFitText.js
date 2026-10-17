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
      // Measure at a known size, then write the result straight back: React won't
      // re-render (and restore the style) when the computed size is unchanged.
      const previous = text.style.fontSize;
      text.style.fontSize = '100px';
      const w = text.offsetWidth; // w-max box: in-flow letters only, not the overhanging plate
      const available = container.clientWidth;
      if (!w || !available) {
        text.style.fontSize = previous;
        return;
      }
      const next = Math.max(min, Math.min(max, (100 * available) / w));
      text.style.fontSize = `${next}px`;
      setSize(next);
    };
    measure();
    document.fonts?.ready.then(measure);
    const ro = new ResizeObserver(measure);
    ro.observe(container);
    return () => ro.disconnect();
  }, [max, min]);

  return { containerRef, textRef, fontSize: size };
}
