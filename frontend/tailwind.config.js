/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#10b981', // Tropical Emerald Green
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        luxury: {
          50: '#faf8f0',
          100: '#f5ecd3',
          200: '#eaddaa',
          300: '#dbca7a',
          400: '#cbb150', // Warm Champagne Gold
          500: '#bda13e', 
          600: '#a2832f',
          700: '#836324',
          800: '#6c5020',
          900: '#5a411c',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
