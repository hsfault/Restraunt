import { forwardRef, useMemo, useState } from 'react';
import { brand } from '../../data/brand.js';
import { rs } from '../../lib/format.js';
import { formatReceiptDate } from '../../lib/time.js';

const Divider = () => <div className="my-3 border-t border-dashed border-ink/40" />;

const Row = ({ k, v, bold = false }) => (
  <div className={`flex justify-between gap-4 ${bold ? 'font-bold' : ''}`}>
    <span>{k}</span>
    <span className="text-right tabular">{v}</span>
  </div>
);

function Barcode({ seed }) {
  const bars = useMemo(() => {
    let h = 2166136261;
    for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
    return Array.from({ length: 64 }, (_, i) => {
      h = Math.imul(h ^ (h >>> 13), 1274126177) ^ i;
      return 1 + (Math.abs(h) % 3);
    });
  }, [seed]);
  return (
    <div className="flex h-12 items-stretch justify-center" aria-hidden>
      {bars.map((w, i) => (
        <span key={i} style={{ width: w }} className={i % 2 === 0 ? 'bg-ink' : 'bg-transparent'} />
      ))}
    </div>
  );
}

function Banner() {
  const [failed, setFailed] = useState(false);
  return (
    <div className="relative h-[70px] overflow-hidden">
      {failed ? (
        <div className="receipt-banner-fallback absolute inset-0" />
      ) : (
        <img src="/images/receipt-banner.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" onError={() => setFailed(true)} />
      )}
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-white/30 bg-white/15 px-3 py-1 text-[10px] tracking-[0.2em] text-white backdrop-blur-md">
        · KITCHEN &amp; BAR ·
      </span>
    </div>
  );
}

// The printed slip. `feed` adds blank paper above the content, as the printer pushes it out.
const ReceiptPaper = forwardRef(function ReceiptPaper({ data, feed = 0, className = '' }, ref) {
  const isRes = data.kind === 'reservation';
  return (
    <div ref={ref} className={`zigzag w-[340px] max-w-full bg-paper font-mono text-[11px] leading-[1.6] text-ink ${className}`}>
      <div style={{ height: feed }} />
      <Banner />
      <div className="px-6 pb-6 pt-5">
        <p className="text-center text-[10px] tracking-[0.24em]">· OFFICIAL RECEIPT ·</p>
        <p className="mt-2 text-center text-[22px] font-bold tracking-[0.08em]">SALTFIRE</p>
        <p className="text-center">Live-fire kitchen</p>
        <p className="mt-1 text-center text-ink/70">{brand.address}</p>
        <p className="text-center text-ink/70">Tel {brand.phone}</p>
        <p className="text-center text-ink/70">NTN: {brand.ntn}</p>
        <Divider />
        <Row k={isRes ? 'RES #' : 'ORDER #'} v={data.number} />
        <Row k="DATE" v={formatReceiptDate(new Date(data.date))} />
        <Row k="SERVER" v="Ali R." />
        <Row k="STATUS" v="PAID ✓" bold />
        <Divider />
        {isRes ? (
          <div className="space-y-0.5">
            <p className="mb-1 font-bold tracking-[0.12em]">RESERVATION</p>
            <Row k="NAME" v={data.reservation.name} />
            <Row k="DATE" v={data.reservation.date} />
            <Row k="TIME" v={data.reservation.time} />
            <Row k="GUESTS" v={String(data.reservation.guests)} />
            <Row k="SEATING" v={data.reservation.seating} />
            <Row k="OCCASION" v={data.reservation.occasion} />
            <p className="pt-2 text-ink/70">Deposit is taken off your final bill. Table held 15 minutes.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-left">
                <th className="w-8 pb-1 font-normal">QTY</th>
                <th className="pb-1 font-normal">ITEM DESCRIPTION</th>
                <th className="pb-1 text-right font-normal">AMT</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((it) => (
                <tr key={it.name} className="align-top">
                  <td className="tabular">{it.qty}</td>
                  <td className="pr-2 uppercase">{it.name}</td>
                  <td className="whitespace-nowrap text-right tabular">{it.amount.toLocaleString('en-US')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {data.pickup && (
          <p className="mt-2">
            PICKUP · {data.pickup} · {data.customer}
          </p>
        )}
        <Divider />
        <Row k={isRes ? 'DEPOSIT' : 'SUBTOTAL'} v={rs(data.subtotal)} />
        <Row k={isRes ? 'TAX' : 'TAX 16%'} v={isRes ? 'ON FINAL BILL' : rs(data.tax)} />
        <Row k={isRes ? 'SERVICE' : 'SERVICE 5%'} v={isRes ? 'ON FINAL BILL' : rs(data.service)} />
        <div className="mt-2 border-t border-ink pt-2 text-[14px]">
          <Row k="TOTAL" v={rs(data.total)} bold />
        </div>
        <Divider />
        <Barcode seed={data.number} />
        <p className="mt-1 text-center tracking-[0.3em]">{data.number.replace(/\D/g, '').padStart(8, '0')}</p>
        <p className="mt-4 text-center">Thank you. See you by the fire.</p>
      </div>
    </div>
  );
});

export default ReceiptPaper;
