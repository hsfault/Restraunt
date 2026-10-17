import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { pickupSlots } from '../data/brand.js';
import { useBag, useBagLines } from '../store/bag.js';
import { useUI } from '../store/ui.js';
import { rs, totals } from '../lib/format.js';
import { validateCard, digits, receiptNumber } from '../lib/payment.js';
import { primeAudio } from '../lib/audio.js';
import PageTransition from '../components/PageTransition.jsx';
import PageTitle from '../components/PageTitle.jsx';
import Footer from '../components/Footer.jsx';
import Field, { FieldError } from '../components/Field.jsx';
import CardFields from '../components/CardFields.jsx';
import PayButton from '../components/PayButton.jsx';
import { BagLines } from '../components/BagDrawer.jsx';
import { LoopArrowLink } from '../sections/MenuPreview.jsx';

function Step({ n, title, children }) {
  return (
    <section className="border-t border-bone/10 py-8">
      <p className="meta mb-5 text-ash">
        <span className="text-bone">{n}</span> — {title}
      </p>
      {children}
    </section>
  );
}

export default function BagPage() {
  const { lines, subtotal, count } = useBagLines();
  const clear = useBag((s) => s.clear);
  const showReceipt = useUI((s) => s.showReceipt);
  const [slot, setSlot] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [card, setCard] = useState({ card: '', exp: '', cvc: '' });
  const [errors, setErrors] = useState({});
  const [nonce, setNonce] = useState(0);
  const [processing, setProcessing] = useState(false);
  const t = totals(subtotal);

  const pay = () => {
    const e = { ...validateCard(card) };
    if (!slot) e.slot = 'Pick a pickup time.';
    if (name.trim().length < 2) e.name = 'Who’s collecting?';
    if (digits(phone).length < 10) e.phone = 'We’ll text when it’s ready, so a full number please.';
    setErrors(e);
    setNonce((n) => n + 1);
    if (Object.keys(e).length) return;
    primeAudio();
    setProcessing(true);
    setTimeout(() => {
      showReceipt({
        kind: 'order',
        number: receiptNumber('SF'),
        date: new Date().toISOString(),
        items: lines.map((l) => ({ qty: l.qty, name: l.name, amount: l.line })),
        pickup: slot,
        customer: name.trim(),
        ...t,
      });
      clear();
      setProcessing(false);
    }, 1600);
  };

  return (
    <PageTransition>
      <main className="pb-24">
        <PageTitle text="YOUR BAG" eyebrow={`— ${count} ${count === 1 ? 'item' : 'items'} · pickup from Gulberg III`} />
        {lines.length === 0 ? (
          <div className="px-4 py-10 md:px-8">
            <p className="serif-em text-[clamp(2rem,4vw,3.4rem)] text-bone">Nothing on the fire yet.</p>
            <p className="mt-3 max-w-[40ch] text-ash">Pick a few plates and come back. Pickup orders run Tuesday to Sunday, 6:30pm to 10:00pm.</p>
            <div className="mt-8">
              <LoopArrowLink to="/menu">Browse the menu</LoopArrowLink>
            </div>
          </div>
        ) : (
          <div className="grid gap-10 px-4 md:px-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Step n="01" title="Your order">
                <BagLines lines={lines} />
              </Step>
              <Step n="02" title="Pickup time">
                <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Pickup time">
                  {pickupSlots.map((s) => (
                    <button
                      key={s}
                      type="button"
                      role="radio"
                      aria-checked={slot === s}
                      onClick={() => setSlot(s)}
                      className={`relative min-h-[44px] rounded-full border px-4 font-mono text-[12px] tabular transition-colors duration-300 ${
                        slot === s ? 'border-ember text-ink' : 'border-bone/15 text-bone hover:border-bone/40'
                      }`}
                    >
                      {slot === s && <motion.span layoutId="slot-pill" className="absolute inset-0 rounded-full bg-ember" transition={{ type: 'spring', stiffness: 320, damping: 30 }} />}
                      <span className="relative">{s}</span>
                    </button>
                  ))}
                </div>
                <FieldError error={errors.slot} nonce={nonce} />
              </Step>
              <Step n="03" title="Your details">
                <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
                  <Field id="name" label="Name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} nonce={nonce} />
                  <Field id="phone" label="Phone" type="tel" autoComplete="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} error={errors.phone} nonce={nonce} />
                </div>
              </Step>
              <Step n="04" title="Payment">
                <CardFields value={card} onChange={setCard} errors={errors} nonce={nonce} />
              </Step>
            </div>

            <aside className="lg:col-span-4 lg:col-start-9">
              <div className="rounded-[24px] border border-bone/10 bg-char p-6 lg:sticky lg:top-28">
                <p className="meta mb-5 text-ash">Summary</p>
                <dl className="space-y-2 font-mono text-[13px] tabular">
                  {[
                    ['Subtotal', t.subtotal],
                    ['Tax 16%', t.tax],
                    ['Service 5%', t.service],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between text-ash">
                      <dt>{k}</dt>
                      <dd className="text-bone">{rs(v)}</dd>
                    </div>
                  ))}
                  <div className="mt-3 flex items-baseline justify-between border-t border-bone/10 pt-4">
                    <dt className="text-bone">Total</dt>
                    <dd className="text-2xl text-bone">{rs(t.total)}</dd>
                  </div>
                </dl>
                <PayButton processing={processing} onClick={pay} className="mt-6">
                  Pay {rs(t.total)}
                </PayButton>
                <p className="mt-4 text-[12px] leading-relaxed text-ash">
                  Ready about 25 minutes after your slot opens. Collect from the bar on Main Boulevard; we’ll text when it’s wrapped.
                </p>
                <Link to="/menu" className="meta mt-4 flex min-h-[44px] items-center text-bone hover:text-ember">
                  ← Add something else
                </Link>
              </div>
            </aside>
          </div>
        )}
      </main>
      <Footer />
    </PageTransition>
  );
}
