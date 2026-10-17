import { useLocation } from 'react-router-dom';
import { scrollToTarget } from './lenis.js';

// For links like "/#chef": when already on that page, scroll instead of routing.
export function useHashLink() {
  const { pathname } = useLocation();
  return (to, after) => (e) => {
    const [path, hash] = to.split('#');
    if (hash && (path || '/') === pathname) {
      e.preventDefault();
      scrollToTarget(`#${hash}`);
    }
    after?.();
  };
}
