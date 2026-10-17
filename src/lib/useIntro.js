import { useState } from 'react';
import { useUI } from '../store/ui.js';

// When should a page's opening title rise? After the preloader curtain on a
// first visit, or just before the route curtain clears on navigation.
export function useIntroTiming() {
  const intro = useUI((s) => s.intro);
  const [viaNav] = useState(() => useUI.getState().navigated);
  if (viaNav) return { ready: true, delay: 0.5 };
  if (intro === 'running') return { ready: false, delay: 0 };
  if (intro === 'lifting') return { ready: true, delay: 0.5 };
  return { ready: true, delay: 0.2 };
}
