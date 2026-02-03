/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'america-blue': '#1c2f8f',
        'america-red': '#e03a3e',
        'america-dark': '#111827',
      }
    },
  },
  plugins: [],
}
