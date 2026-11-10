/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        roman: {
          dark: '#0D1B2A',
          navy: '#0A192F',
          blue: '#1B2A4A',
          cyan: '#2A6F97',
          gold: '#D4AF37',
          bronze: '#C5A059',
          silver: '#C0C0C0',
          marble: '#F8F9FA',
          stone: '#F1F3F5',
          platinum: '#E2E8F0',
          charcoal: '#1E293B',
          cardLight: '#FFFFFF',
        },
      },
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        headline: ['Montserrat', 'Oswald', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        relief:
          '0 2px 4px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8), 0 6px 16px -2px rgba(13, 27, 42, 0.08)',
        'relief-gold':
          '0 4px 14px -2px rgba(197, 160, 89, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
        'card-marble': '0 4px 20px -2px rgba(13, 27, 42, 0.06), 0 1px 3px rgba(0, 0, 0, 0.03)',
      },
    },
  },
  plugins: [],
}
