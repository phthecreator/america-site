/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './catalogo-2026.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'america-blue': '#1c2f8f',
        'america-red': '#e03a3e',
        'america-dark': '#111827',
        'america-light': '#f8fafc',
        // Design system do catálogo (src/styles/tokens.css) — mudam com o modo claro/escuro
        am: {
          bg: 'rgb(var(--am-bg-rgb) / <alpha-value>)',
          surface: 'rgb(var(--am-surface-rgb) / <alpha-value>)',
          'surface-2': 'rgb(var(--am-surface-2-rgb) / <alpha-value>)',
          band: 'rgb(var(--am-band-rgb) / <alpha-value>)',
          'on-band': 'rgb(var(--am-on-band-rgb) / <alpha-value>)',
          text: 'rgb(var(--am-text-rgb) / <alpha-value>)',
          muted: 'rgb(var(--am-text-muted-rgb) / <alpha-value>)',
          line: 'rgb(var(--am-line-rgb) / <alpha-value>)',
          'line-strong': 'rgb(var(--am-line-strong-rgb) / <alpha-value>)',
          accent: 'rgb(var(--am-accent-rgb) / <alpha-value>)',
          'accent-hover': 'var(--am-accent-hover)',
          'on-accent': 'var(--am-on-accent)',
          'accent-text': 'var(--am-accent-text)',
          cta: 'rgb(var(--am-cta-rgb) / <alpha-value>)',
          'cta-hover': 'var(--am-cta-hover)',
          'on-cta': 'var(--am-on-cta)',
          'cta-text': 'var(--am-cta-text)',
          focus: 'var(--am-focus)'
        }
      },
      fontFamily: {
        'am-display': 'var(--am-font-display)',
        'am-body': 'var(--am-font-body)',
        'am-serif': 'var(--am-font-serif)'
      },
      animation: {
        'rotate-slow': 'rotate 20s linear infinite',
        'rotate-slower': 'rotate 30s linear infinite reverse',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'slide-up': 'slide-up 0.8s ease-out',
      },
      keyframes: {
        rotate: {
          'from': { transform: 'rotate(0deg)' },
          'to': { transform: 'rotate(360deg)' }
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(28, 47, 143, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(224, 58, 62, 0.3)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        'slide-up': {
          'from': { opacity: '0', transform: 'translateY(40px)' },
          'to': { opacity: '1', transform: 'translateY(0)' }
        }
      }
    },
  },
  plugins: [],
}
