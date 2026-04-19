/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#0a1020',
          900: '#0e1528',
          800: '#141d38',
          700: '#1c2850',
        },
        electric: '#3ea6ff',
        amber: {
          warm: '#f5b041',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
