export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#fdfbf7',
        ink: '#111111',
        accent: '#ff4500',
      },
      borderRadius: {
        none: '0px',
        DEFAULT: '0px', // Enforce sharp corners by default if needed, or just use rounded-none class
      },
      borderWidth: {
        DEFAULT: '2px', // user said "All containers must have border-2" - maybe good default?
        '2': '2px', // ensure this is explicit
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // User mentioned standard sans-serif
      }
    },
  },
  plugins: [],
}
