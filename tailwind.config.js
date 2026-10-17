/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      // Role tokens backed by CSS variables (see index.css): `ink` is the page
      // ground, `bone` the main text. The site is light; `.theme-dark` flips a subtree.
      colors: {
        ink: 'rgb(var(--ink) / <alpha-value>)',
        char: 'rgb(var(--char) / <alpha-value>)',
        smoke: 'rgb(var(--smoke) / <alpha-value>)',
        bone: 'rgb(var(--bone) / <alpha-value>)',
        ash: 'rgb(var(--ash) / <alpha-value>)',
        ember: 'rgb(var(--ember) / <alpha-value>)',
        glow: 'rgb(var(--glow) / <alpha-value>)',
        saffron: 'rgb(var(--saffron) / <alpha-value>)',
        paper: '#FAF8F3',
        // Fixed, theme-independent ends of the palette.
        coal: '#0B0A09',
        cream: '#F6F2EB',
      },
      fontFamily: {
        sans: ['Archivo', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['"Instrument Serif"', 'ui-serif', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        meta: ['0.6875rem', { lineHeight: '1.4', letterSpacing: '0.12em' }],
        wordmark: ['clamp(4.5rem, 19vw, 22rem)', { lineHeight: '0.8', letterSpacing: '-0.04em' }],
        section: ['clamp(2.5rem, 7vw, 7rem)', { lineHeight: '0.88', letterSpacing: '-0.03em' }],
      },
      borderRadius: {
        panel: '32px',
        arch: '999px 999px 24px 24px',
      },
      transitionTimingFunction: {
        primary: 'cubic-bezier(0.76, 0, 0.24, 1)',
        ui: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      zIndex: {
        nav: '60',
        drawer: '80',
        modal: '90',
        curtain: '100',
        preloader: '110',
        cursor: '120',
        grain: '130',
      },
    },
  },
  plugins: [],
};
