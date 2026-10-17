// Mock card helpers for the checkout and deposit forms.
export const digits = (s) => s.replace(/\D/g, '');

export const formatCard = (s) =>
  digits(s)
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, '$1 ');

export function formatExpiry(s) {
  const d = digits(s).slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
}

export function validateCard({ card, exp, cvc }) {
  const errors = {};
  if (digits(card).length !== 16) errors.card = 'Card number needs 16 digits.';
  const [mm, yy] = exp.split('/').map(Number);
  const now = new Date();
  const thisYY = now.getFullYear() % 100;
  if (!mm || !yy || mm < 1 || mm > 12) errors.exp = 'Use MM/YY.';
  else if (yy < thisYY || (yy === thisYY && mm < now.getMonth() + 1)) errors.exp = 'This card has expired.';
  if (!/^\d{3,4}$/.test(cvc)) errors.cvc = '3 or 4 digits.';
  return errors;
}

export const receiptNumber = (prefix) => `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;
