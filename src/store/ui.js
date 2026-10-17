import { create } from 'zustand';

// Transient UI state shared across components. Not persisted.
export const useUI = create((set) => ({
  // 'running' while the preloader plays, 'lifting' during its curtain, 'done' after.
  intro: 'done',
  setIntro: (intro) => set({ intro }),

  navHidden: false,
  setNavHidden: (navHidden) => set({ navHidden }),

  mobileMenu: false,
  setMobileMenu: (mobileMenu) => set({ mobileMenu }),

  searchOpen: false,
  setSearchOpen: (searchOpen) => set({ searchOpen }),

  // Thumbnails flying to the bag: [{ key, id, src, rect }]
  flights: [],
  fly: (flight) => set((s) => ({ flights: [...s.flights, { ...flight, key: `${flight.id}-${Date.now()}` }] })),
  land: (key) => set((s) => ({ flights: s.flights.filter((f) => f.key !== key) })),

  // Receipt payload: { kind: 'order' | 'reservation', ... } or null
  receipt: null,
  showReceipt: (receipt) => set({ receipt }),
  closeReceipt: () => set({ receipt: null }),

  // Set after the first route has rendered, so later pages know they arrived via curtain.
  navigated: false,
  setNavigated: () => set({ navigated: true }),

  // Name shown on the route curtain (the destination page).
  destLabel: 'SALTFIRE',
  setDestLabel: (destLabel) => set({ destLabel }),
}));
