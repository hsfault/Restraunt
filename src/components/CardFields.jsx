import { CreditCard } from 'lucide-react';
import Field from './Field.jsx';
import { formatCard, formatExpiry, digits } from '../lib/payment.js';

export default function CardFields({ value, onChange, errors, nonce }) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2 text-ash">
        <CreditCard className="h-4 w-4" strokeWidth={1.6} />
        <p className="text-[12px]">Mock payment. No real card is charged — try 4242 4242 4242 4242.</p>
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
        <Field
          id="card"
          label="Card number"
          inputMode="numeric"
          autoComplete="cc-number"
          className="col-span-2"
          value={value.card}
          onChange={(e) => onChange({ ...value, card: formatCard(e.target.value) })}
          error={errors.card}
          nonce={nonce}
        />
        <Field
          id="exp"
          label="Expiry MM/YY"
          inputMode="numeric"
          autoComplete="cc-exp"
          value={value.exp}
          onChange={(e) => onChange({ ...value, exp: formatExpiry(e.target.value) })}
          error={errors.exp}
          nonce={nonce}
        />
        <Field
          id="cvc"
          label="CVC"
          inputMode="numeric"
          autoComplete="cc-csc"
          value={value.cvc}
          onChange={(e) => onChange({ ...value, cvc: digits(e.target.value).slice(0, 4) })}
          error={errors.cvc}
          nonce={nonce}
        />
      </div>
    </div>
  );
}
