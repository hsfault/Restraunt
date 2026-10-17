import { useMemo } from 'react';
import { emphasisWords } from './format.js';

// Splits text into words (with *emphasis* flags) and each word into chars.
export function useSplitText(text) {
  return useMemo(() => {
    const words = emphasisWords(text);
    return words.map((w, i) => ({ ...w, index: i, chars: Array.from(w.text) }));
  }, [text]);
}
