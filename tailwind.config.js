/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        'scratch-blue': 'var(--scratch-blue)',
        'scratch-green': 'var(--scratch-green)',
        'scratch-purple': 'var(--scratch-purple)',
        'scratch-orange': 'var(--scratch-orange)',
        'scratch-red': 'var(--scratch-red)',
      },
    },
  },
  plugins: [],
} 