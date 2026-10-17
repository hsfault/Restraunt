import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { seating } from '../data/gallery.js';
import { occasions } from '../data/brand.js';
import { useUI } from '../store/ui.js';
import { ease } from '../lib/motion.js';
import { pad, rs } from '../lib/format.js';
import { validateCard, digits, receiptNumber } from '../lib/payment.js';
import { primeAudio } from '../lib/audio.js';
import PageTransition from '../components/PageTransition.jsx';
import PageTitle from '../components/PageTitle.jsx';
import Footer from '../components/Footer.jsx';
import Field, { FieldError } from '../components/Field.jsx';
import CardFields from '../components/CardFields.jsx';
import PayButton from '../components/PayButton.jsx';
import Img from '../components/Img.jsx';
import { QtyStepper } from '../components/BagDrawer.jsx';

const STEPS = ['Date', 'Time & guests', 'Details', 'Confirm'];
const DEPOSIT = 2000;
const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const SLOTS = Array.from({ length: 10 }, (_, i) => {
  const mins = 18 * 60 + i * 30;
  const h = Math.floor(mins / 60) - 12;
  return `${h}:${pad(mins % 60)}pm`;
});

const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const sameDay = (a, b) => a && b && a.getTime() === b.getTime();
const longDate = (d) => d.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }).replace(',', '').toUpperCase();

// Deterministic "full" slots per date so the grid doesn't reshuffle on every render.
function isFull(date, slot) {
  let h = 7;
  for (const c of `${date.toDateString()}${slot}`) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h % 4 === 0;
}

function Calendar({ value, onChange }) {
  const today = startOfDay(new Date());
  const [month, setMonth] = useState(() => new Date((value ?? today).getFullYear(), (value ?? today).getMonth(), 1));
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const lead = (first.getDay() + 6) % 7;
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const minMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const maxMonth = new Date(today.getFullYear(), today.getMonth() + 3, 1);
  const shift = (n) => setMonth(new Date(month.getFullYear(), month.getMonth() + n, 1));

  return (
    <div className="max-w-[460px]">
      <div className="mb-4 flex items-center justify-between">
        <p className="display text-2xl">{month.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</p>
        <div className="flex gap-1">
          <button type="button" onClick={() => shift(-1)} disabled={month <= minMonth} className="grid h-11 w-11 place-items-center rounded-full border border-bone/15 hover:bg-smoke disabled:opacity-30" aria-label="Previous month">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => shift(1)} disabled={month >= maxMonth} className="grid h-11 w-11 place-items-center rounded-full border border-bone/15 hover:bg-smoke disabled:opacity-30" aria-label="Next month">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-y-1 text-center" role="grid" aria-label="Choose a date">
        {WEEKDAYS.map((d) => (
          <span key={d} className="meta pb-2 text-ash">
            {d}
          </span>
        ))}
        {Array.from({ length: lead }, (_, i) => (
          <span key={`b${i}`} />
        ))}
        {Array.from({ length: days }, (_, i) => {
          const d = new Date(month.getFullYear(), month.getMonth(), i + 1);
          const monday = d.getDay() === 1;
          const disabled = d < today || monday;
          const selected = sameDay(d, value);
          return (
            <button
              key={i}
              type="button"
              disabled={disabled}
              onClick={() => onChange(d)}
              aria-pressed={selected}
              aria-label={`${d.toDateString()}${monday ? ', closed' : ''}`}
              className={`relative mx-auto grid h-11 w-11 place-items-center rounded-full font-mono text-[13px] tabular transition-colors ${
                selected ? 'text-ink' : disabled ? `cursor-not-allowed text-ash/30 ${monday ? 'line-through' : ''}` : 'text-bone hover:bg-smoke'
              } ${sameDay(d, today) && !selected ? 'ring-1 ring-bone/30' : ''}`}
            >
              {selected && <motion.span layoutId="cal-selected" className="absolute inset-0 rounded-full bg-ember" transition={{ type: 'spring', stiffness: 320, damping: 28 }} />}
              <span className="relative">{i + 1}</span>
            </button>
          );
        })}
      </div>
      <p className="meta mt-4 text-ash">Closed Mondays · bookings up to three months ahead</p>
    </div>
  );
}

const slide = {
  enter: (dir) => ({ x: dir > 0 ? 70 : -70, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.55, ease: ease.ui } },
  exit: (dir) => ({ x: dir > 0 ? -70 : 70, opacity: 0, transition: { duration: 0.3, ease: ease.primary } }),
};

export default function ReservePage() {
  const showReceipt = useUI((s) => s.showReceipt);
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState(2);
  const [seat, setSeat] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [occasion, setOccasion] = useState('Just hungry');
  const [notes, setNotes] = useState('');
  const [card, setCard] = useState({ card: '', exp: '', cvc: '' });
  const [errors, setErrors] = useState({});
  const [nonce, setNonce] = useState(0);
  const [processing, setProcessing] = useState(false);
  const seatName = useMemo(() => seating.find((s) => s.id === seat)?.name ?? '', [seat]);

  const validate = (s) => {
    const e = {};
    if (s === 0 && !date) e.date = 'Pick a night. We’re closed Mondays.';
    if (s === 1) {
      if (!time) e.time = 'Choose a time.';
      if (!seat) e.seat = 'Where would you like to sit?';
    }
    if (s === 2) {
      if (name.trim().length < 2) e.name = 'A name for the table, please.';
      if (digits(phone).length < 10) e.phone = 'A full number, so we can confirm.';
      if (!/^\S+@\S+\.\S+$/.test(email)) e.email = 'That email won’t reach you.';
    }
    if (s === 3) Object.assign(e, validateCard(card));
    setErrors(e);
    setNonce((n) => n + 1);
    return Object.keys(e).length === 0;
  };

  const goTo = (n) => {
    setDir(n > step ? 1 : -1);
    setErrors({});
    setStep(n);
  };
  const next = () => validate(step) && goTo(step + 1);

  const pay = () => {
    if (!validate(3)) return;
    primeAudio();
    setProcessing(true);
    setTimeout(() => {
      showReceipt({
        kind: 'reservation',
        number: receiptNumber('RES'),
        date: new Date().toISOString(),
        reservation: { name: name.trim(), date: longDate(date), time, guests, seating: seatName.toUpperCase(), occasion: occasion.toUpperCase() },
        subtotal: DEPOSIT,
        tax: 0,
        service: 0,
        total: DEPOSIT,
      });
      setProcessing(false);
    }, 1600);
  };

  const summary = [
    ['Date', date ? longDate(date) : '—', 0],
    ['Time', time || '—', 1],
    ['Guests', String(guests), 1],
    ['Seating', seatName || '—', 1],
    ['Name', name || '—', 2],
    ['Phone', phone || '—', 2],
    ['Occasion', occasion, 2],
  ];

  return (
    <PageTransition>
      <main className="pb-24">
        <PageTitle text="RESERVE" eyebrow="— Tables Tue–Sun · 6:00pm to 10:30pm" aside="Parties of up to twelve. For the long table or a buyout, choose Business and tell us in the notes." />

        <div className="px-4 md:px-8">
          {/* Step indicator */}
          <div className="border-t border-bone/10 pt-6">
            <div className="flex items-baseline justify-between gap-4">
              <p className="font-mono text-[13px] tabular text-bone">
                {pad(step + 1)} <span className="text-ash">— 04</span>
              </p>
              <ol className="hidden gap-6 sm:flex">
                {STEPS.map((s, i) => (
                  <li key={s} className={`meta transition-colors ${i === step ? 'text-bone' : i < step ? 'text-ash' : 'text-ash/40'}`}>
                    {s}
                  </li>
                ))}
              </ol>
              <p className="meta text-bone sm:hidden">{STEPS[step]}</p>
            </div>
            <div className="mt-4 h-px bg-bone/10">
              <motion.div className="h-full origin-left bg-ember" animate={{ scaleX: (step + 1) / STEPS.length }} transition={{ duration: 0.7, ease: ease.primary }} />
            </div>
          </div>

          <div className="relative mt-10 min-h-[520px] overflow-hidden">
            <AnimatePresence mode="wait" custom={dir} initial={false}>
              <motion.div key={step} custom={dir} variants={slide} initial="enter" animate="center" exit="exit">
                {step === 0 && (
                  <div className="grid gap-10 md:grid-cols-12">
                    <div className="md:col-span-4">
                      <h2 className="display text-[clamp(2rem,4vw,3.4rem)] leading-[0.9]">
                        Which <span className="serif-em">night</span>?
                      </h2>
                      <p className="mt-3 max-w-[30ch] text-[14px] text-ash">Friday and Saturday fill a week out. Tuesday is when the kitchen tries new things.</p>
                    </div>
                    <div className="md:col-span-7 md:col-start-6">
                      <Calendar value={date} onChange={setDate} />
                      <FieldError error={errors.date} nonce={nonce} />
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div className="grid gap-10 md:grid-cols-12">
                    <div className="md:col-span-5">
                      <p className="meta mb-4 text-ash">Time · {date && longDate(date)}</p>
                      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 md:grid-cols-3 lg:grid-cols-5">
                        {SLOTS.map((s) => {
                          const full = isFull(date, s);
                          const on = time === s;
                          return (
                            <button
                              key={s}
                              type="button"
                              disabled={full}
                              onClick={() => setTime(s)}
                              aria-pressed={on}
                              aria-label={full ? `${s}, full` : s}
                              className={`relative min-h-[44px] rounded-xl border font-mono text-[12px] tabular transition-colors ${
                                on ? 'border-ember text-ink' : full ? 'border-bone/5 text-ash/40 line-through' : 'border-bone/15 text-bone hover:border-bone/40'
                              }`}
                            >
                              {on && <motion.span layoutId="time-pill" className="absolute inset-0 rounded-[11px] bg-ember" transition={{ type: 'spring', stiffness: 320, damping: 30 }} />}
                              <span className="relative">{s}</span>
                            </button>
                          );
                        })}
                      </div>
                      <FieldError error={errors.time} nonce={nonce} />
                      <div className="mt-8 flex items-center justify-between border-t border-bone/10 pt-6">
                        <div>
                          <p className="meta text-ash">Guests</p>
                          <p className="mt-1 text-[13px] text-ash">{guests > 8 ? 'Over eight? We’ll call to plan the menu.' : 'Up to twelve per booking.'}</p>
                        </div>
                        <QtyStepper value={guests} onChange={setGuests} min={1} max={12} label="guests" />
                      </div>
                    </div>
                    <div className="md:col-span-6 md:col-start-7">
                      <p className="meta mb-4 text-ash">Seating</p>
                      <div role="radiogroup" aria-label="Seating" className="border-t border-bone/10">
                        {seating.map((s) => {
                          const on = seat === s.id;
                          return (
                            <button
                              key={s.id}
                              type="button"
                              role="radio"
                              aria-checked={on}
                              onClick={() => setSeat(s.id)}
                              className={`group flex w-full items-center gap-4 border-b border-bone/10 py-3 text-left transition-colors ${on ? 'text-bone' : 'text-bone/80 hover:text-bone'}`}
                            >
                              <span className="h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                                <Img src={s.image} alt="" className="h-full w-full object-cover transition-transform duration-700 ease-ui group-hover:scale-110" />
                              </span>
                              <span className="flex-1">
                                <span className="block text-[16px] font-semibold">{s.name}</span>
                                <span className="block text-[13px] text-ash">{s.line}</span>
                              </span>
                              <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border transition-colors ${on ? 'border-ember bg-ember text-ink' : 'border-bone/20'}`}>
                                {on && <Check className="h-4 w-4" />}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                      <FieldError error={errors.seat} nonce={nonce} />
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="grid gap-10 md:grid-cols-12">
                    <div className="md:col-span-4">
                      <h2 className="display text-[clamp(2rem,4vw,3.4rem)] leading-[0.9]">
                        Who’s <span className="serif-em">coming</span>?
                      </h2>
                      <p className="mt-3 max-w-[30ch] text-[14px] text-ash">We’ll text a confirmation and call only if something changes.</p>
                    </div>
                    <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2 md:col-span-7 md:col-start-6">
                      <Field id="r-name" label="Name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} nonce={nonce} />
                      <Field id="r-phone" label="Phone" type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} error={errors.phone} nonce={nonce} />
                      <Field id="r-email" label="Email" type="email" autoComplete="email" className="sm:col-span-2" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} nonce={nonce} />
                      <div className="sm:col-span-2">
                        <p className="meta mb-3 text-ash">Occasion</p>
                        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Occasion">
                          {occasions.map((o) => (
                            <button
                              key={o}
                              type="button"
                              role="radio"
                              aria-checked={occasion === o}
                              onClick={() => setOccasion(o)}
                              className={`min-h-[44px] rounded-full border px-4 text-[13px] transition-colors ${occasion === o ? 'border-bone bg-bone text-ink' : 'border-bone/15 text-bone hover:border-bone/40'}`}
                            >
                              {o}
                            </button>
                          ))}
                        </div>
                      </div>
                      <Field id="r-notes" as="textarea" label="Notes · allergies, high chair, a cake" className="sm:col-span-2" value={notes} onChange={(e) => setNotes(e.target.value)} />
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="grid gap-10 md:grid-cols-12">
                    <div className="md:col-span-5">
                      <h2 className="display text-[clamp(2rem,4vw,3.4rem)] leading-[0.9]">
                        One last <span className="serif-em">look</span>.
                      </h2>
                      <dl className="mt-6 border-t border-bone/10">
                        {summary.map(([k, v, s]) => (
                          <div key={k} className="flex items-center justify-between gap-4 border-b border-bone/10 py-2.5">
                            <dt className="meta text-ash">{k}</dt>
                            <dd className="flex items-center gap-3 text-right text-[14px] text-bone">
                              {v}
                              <button type="button" onClick={() => goTo(s)} className="meta min-h-[44px] text-ash hover:text-ember" aria-label={`Edit ${k}`}>
                                Edit
                              </button>
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                    <div className="md:col-span-6 md:col-start-7">
                      <p className="meta mb-4 text-ash">Deposit · comes off your bill</p>
                      <CardFields value={card} onChange={setCard} errors={errors} nonce={nonce} />
                      <PayButton processing={processing} onClick={pay} className="mt-8">
                        Confirm &amp; pay {rs(DEPOSIT)} deposit
                      </PayButton>
                      <p className="mt-3 text-[12px] text-ash">Cancel up to 24 hours before for a full refund.</p>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-bone/10 pt-6">
            <button type="button" onClick={() => goTo(step - 1)} disabled={step === 0} className="meta flex min-h-[44px] items-center gap-2 text-bone disabled:opacity-0">
              <ChevronLeft className="h-4 w-4" /> Back
            </button>
            {step < 3 && (
              <button type="button" onClick={next} className="btn-bone h-12 px-6">
                {step === 2 ? 'Review' : 'Continue'}
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </PageTransition>
  );
}
