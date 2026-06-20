/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'nigerian-green': '#008751',
        'nigerian-gold': '#FFC107',
      },
    },
  },
  plugins: [],
}