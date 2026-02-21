/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          darkblue: '#2B3E4C',
          midblue: '#87B867',
          cream: '#FFE9BB',
          red: '#FF6B75',
          orange: '#FFA726'
        }
      }
    },
  },
  plugins: [],
}
