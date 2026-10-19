/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        simola: {
          navy: '#1B2A4A',
          teal: '#00A896',
          amber: '#F77F00',
          'navy-dark': '#0f182c',
          'navy-light': '#243760',
          'teal-light': '#00c7b2',
          'amber-light': '#ff941a',
        },
        bio: {
          dark: '#0f172a',
          card: '#1e293b',
          border: '#334155',
          accent: '#00A896',
          success: '#22c55e',
          danger: '#ef4444',
          warning: '#F77F00',
        }
      }
    },
  },
  plugins: [],
}
