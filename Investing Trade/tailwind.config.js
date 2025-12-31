/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Permanent Marker 추가
        permanent: ['"Permanent Marker"', 'cursive'],
        berkshire: ['"Berkshire Swash"', 'cursive'],
        agbalumo: ['Agbalumo', 'system-ui', 'sans-serif'],
        jua: ['Jua', 'sans-serif'],
      },
      colors: {
        'brand-blue': '#5D6DED',
        'brand-light-blue': '#7199F1',
        'brand-button': '#6C7EEB',
      }
    },
  },
  plugins: [],
}