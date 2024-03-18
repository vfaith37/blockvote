/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "selector",
  theme: {
    extend: {
      backgroundImage: {
        'hero': "url('./assets/Jobby.svg')",
        'heroq': "url('./assets/Jobby.svg')"
      }
    },
  },
  plugins: [],
}