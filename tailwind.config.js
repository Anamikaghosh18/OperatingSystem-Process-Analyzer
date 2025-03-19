/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'navy': {
          900: '#0A192F',
          800: '#112240',
          700: '#1D3461',
          600: '#2A4365',
        },
        'blue-accent': {
          500: '#64FFDA',
          400: '#88FFEA',
        },
        'slate': {
          400: '#8892B0',
          300: '#A8B2D1',
        }
      }
    },
  },
  plugins: [],
};