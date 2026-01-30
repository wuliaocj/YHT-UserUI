/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00B578',
        secondary: '#FF7D00',
        light: '#F5F5F5',
        dark: '#333333'
      },
      fontFamily: {
        sans: ['Helvetica Neue', 'Arial', 'sans-serif']
      }
    },
  },
  plugins: [],
}