/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f7f3',
          100: '#b3e8db',
          200: '#80d9c4',
          300: '#4dcaac',
          400: '#26be9a',
          500: '#00A388',
          600: '#00937a',
          700: '#007d68',
          800: '#006756',
          900: '#004d40',
        },
        'accent-purple': '#9A85A3',
        'accent-teal': '#6B9EAF',
        'accent-clay': '#D48C84',
        'accent-ochre': '#D0A97D',
        'accent-green': '#00A388',
        surface: '#FFFFFF',
        'surface-alt': '#EBECEE',
        'text-main': '#1C1C1E',
        'text-muted': '#8E8E93',
        border: '#D1D1D6',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
