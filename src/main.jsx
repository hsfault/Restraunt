import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App.jsx';
import { useUI } from './store/ui.js';
import './index.css';

if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';

// The splash plays on every full page load (not on in-app route changes),
// and never with reduced motion.
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
useUI.setState({ intro: reduced ? 'done' : 'running' });

// Hash routing (/#/menu) so the build runs from any static host or folder without server rewrites.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
);
