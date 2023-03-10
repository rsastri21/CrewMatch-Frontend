/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // Note the addition of the `app` directory.
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      width: {
        '128': '32rem',
        '156': '34rem',
        '104': '28rem',
      },
      height: {
        '128': '32rem'
      },
      spacing: {
        '128': '32rem',
        '256': '48rem'
      }
    },
  },
  plugins: [],
}
