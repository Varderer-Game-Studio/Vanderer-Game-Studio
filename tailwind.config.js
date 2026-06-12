/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './index.tsx', './App.tsx', './components/**/*.{ts,tsx}', './data/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#05060a', deep: '#0b0e17', surface: '#121726',
        gold: { DEFAULT: '#E8C36B', bright: '#F6D98A', dim: '#8A7236' },
        ink: { DEFAULT: '#ECEEF5', dim: '#9AA2B6' },
      },
      fontFamily: { display: ['Fraunces', 'serif'], sans: ['Inter', 'sans-serif'] },
      maxWidth: { content: '1200px' },
    },
  },
  plugins: [],
};
