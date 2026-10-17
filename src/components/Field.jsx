import { motion } from 'framer-motion';

const shake = { x: [0, -7, 7, -5, 5, -2, 0] };

export function FieldError({ error, nonce }) {
  if (!error) return null;
  return (
    <motion.p key={nonce} role="alert" className="mt-1.5 font-mono text-[11px] text-ember" animate={shake} transition={{ duration: 0.45 }}>
      {error}
    </motion.p>
  );
}

// Underline input with a floating mono label.
export default function Field({ id, label, error, nonce, as = 'input', className = '', ...props }) {
  const Tag = as;
  return (
    <div className={`relative ${className}`}>
      <Tag id={id} placeholder=" " aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-err` : undefined} className={`field ${as === 'textarea' ? 'min-h-[96px] resize-none' : ''}`} {...props} />
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <div id={`${id}-err`}>
        <FieldError error={error} nonce={nonce} />
      </div>
    </div>
  );
}
