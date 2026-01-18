/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: '#496da1',
        'accent-light': '#7a9ccf',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        serif: ['Instrument Serif', 'serif'],
      },
    },
  },
  safelist: [
    'bg-blue-50', 'text-blue-600',
    'bg-green-50', 'text-green-600',
    'bg-indigo-50', 'text-indigo-600',
    'bg-amber-50', 'text-amber-600',
  ],
  plugins: [],
}
