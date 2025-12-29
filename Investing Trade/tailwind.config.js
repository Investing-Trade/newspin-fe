/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        berkshire: ['"Berkshire Swash"', 'cursive'],
        // Agbalumo 폰트 패밀리 등록
        agbalumo: ['Agbalumo', 'system-ui', 'sans-serif'],
      },
      colors: {
        // 이미지의 주요 색상을 커스텀 컬러로 등록
        'brand-blue': '#5D6DED',
        'brand-light-blue': '#7199F1',
        'brand-button': '#6C7EEB',
      }
    },
  },
  plugins: [],
}