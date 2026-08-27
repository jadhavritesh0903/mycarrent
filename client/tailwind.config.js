/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef9ff',
          100: '#d9f2ff',
          200: '#bde8ff',
          300: '#89d6ff',
          400: '#51b8ff',
          500: '#1e95ff',
          600: '#0d6ee8',
          700: '#0d58c2',
          800: '#13489d',
          900: '#153d7d',
        },
      },
      boxShadow: {
        soft: '0 15px 35px rgba(15, 23, 42, 0.08)',
      },
    },
  },
  plugins: [],
};
