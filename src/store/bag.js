import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { menuById } from '../data/menu.js';

export const useBag = create(
  persist(
    (set, get) => ({
      items: [], // [{ id, qty }]
      open: false,
      pulse: 0, // bumps whenever the badge should pop

      add: (id, qty = 1) =>
        set((s) => {
          const existing = s.items.find((i) => i.id === id);
          const items = existing
            ? s.items.map((i) => (i.id === id ? { ...i, qty: Math.min(20, i.qty + qty) } : i))
            : [...s.items, { id, qty }];
          return { items, pulse: s.pulse + 1 };
        }),
      setQty: (id, qty) =>
        set((s) => ({
          items: qty <= 0 ? s.items.filter((i) => i.id !== id) : s.items.map((i) => (i.id === id ? { ...i, qty: Math.min(20, qty) } : i)),
        })),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      clear: () => set({ items: [] }),
      setOpen: (open) => set({ open }),

      count: () => get().items.reduce((n, i) => n + i.qty, 0),
    }),
    {
      name: 'saltfire-bag',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ items: s.items }),
    },
  ),
);

// Bag lines joined with menu data; unknown ids (stale storage) are dropped.
export function useBagLines() {
  const items = useBag((s) => s.items);
  const lines = items
    .filter((i) => menuById[i.id])
    .map((i) => ({ ...menuById[i.id], qty: i.qty, line: menuById[i.id].price * i.qty }));
  const subtotal = lines.reduce((n, l) => n + l.line, 0);
  const count = lines.reduce((n, l) => n + l.qty, 0);
  return { lines, subtotal, count };
}
