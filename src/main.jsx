import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App, { INTRO_KEY } from './App.jsx';
import { useUI } from './store/ui.js';
import './index.css';

if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';

// The preloader plays once per session, and never with reduced motion.
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let seen = false;
try {
  seen = sessionStorage.getItem(INTRO_KEY) === '1';
} catch {
  seen = false;
}
useUI.setState({ intro: !reduced && !seen ? 'running' : 'done' });

// Hash routing (/#/menu) so the build runs from any static host or folder without server rewrites.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
);
