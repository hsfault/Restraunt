// The ember glyph: a single flame over a short hearth line.
export default function FlameMark({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        d="M12 2.2c.9 3.2 5 5.3 5 10.2A5 5 0 0 1 12 17.6a5 5 0 0 1-5-5.2c0-2.3 1.2-3.8 2.4-4.8.1 1.5.7 2.6 1.9 3.2-.4-2.9-.1-5.6.7-8.6Z"
        fill="#FF5B1F"
      />
      <path d="M12 11.4c.4 1.4 2 2.2 2 4.1a2 2 0 0 1-4 0c0-.9.5-1.6 1-2 .1.6.4 1 .8 1.2-.1-1.1 0-2.2.2-3.3Z" fill="#FF9A4D" />
      <path d="M5 21h9M17 21h2" className="stroke-bone" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
