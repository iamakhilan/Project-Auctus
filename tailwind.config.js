/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        duo: {
          green: 'var(--green)',
          'green-hover': 'var(--green-hover)',
          'green-shadow': 'var(--green-shadow)',
          'dark-blue': 'var(--dark-blue)',
          blue: 'var(--blue)',
          'gray-text': 'var(--gray-text)',
          'gray-light': 'var(--gray-light)',
          border: 'var(--border-color)',
          'nav-text': 'var(--nav-text)',
          'footer-green': 'var(--footer-green)',
          red: 'var(--red)',
          orange: 'var(--orange)',
          golden: 'var(--golden)',
        },
      },
      fontFamily: {
        body: ['Nunito', 'DIN Round Pro', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        feather: ['"Feather Bold"', 'Nunito', 'DIN Round Pro', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
