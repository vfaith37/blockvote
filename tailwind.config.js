/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "selector",
  theme: {
    extend: {
      fontFamily: {
        display: ["Outfit", "sans-serif"],
        body: ["Urbanist", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      colors: {
        ink: "#07090b",
      },
      backgroundImage: {
        'hero': "url('./assets/Jobby.svg')",
        'heroq': "url('./assets/Jobby.svg')"
      }
    },
  },
  plugins: [],
}