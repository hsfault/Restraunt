export const rs = (n) => `Rs ${Math.round(n).toLocaleString('en-US')}`;

export const pad = (n, len = 2) => String(n).padStart(len, '0');

export const TAX_RATE = 0.16;
export const SERVICE_RATE = 0.05;

export function totals(subtotal) {
  const tax = Math.round(subtotal * TAX_RATE);
  const service = Math.round(subtotal * SERVICE_RATE);
  return { subtotal, tax, service, total: subtotal + tax + service };
}

// Split "I cooked on a *coal* angithi" into [{text, em}] tokens per word.
export function emphasisWords(text) {
  const out = [];
  text.split(/(\*[^*]+\*)/).forEach((part) => {
    if (!part) return;
    const em = part.startsWith('*') && part.endsWith('*');
    const clean = em ? part.slice(1, -1) : part;
    clean.split(/\s+/).filter(Boolean).forEach((w) => out.push({ text: w, em }));
  });
  return out;
}
