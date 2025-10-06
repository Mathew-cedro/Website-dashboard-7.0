/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        title: ['Orbitron', 'sans-serif'],
      },
      colors: {
        'twitch-purple': '#9146FF',
        'twitch-dark': '#0e0e10',
        'twitch-card': '#1f1f23',
        // Light theme colors
        'light-bg': '#f4f4f5', // zinc-100
        'light-card': '#ffffff',
        'light-text': '#27272a', // zinc-800
        'light-text-secondary': '#71717a', // zinc-500
        'light-border': '#e4e4e7', // zinc-200
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in-up': 'slideInUp 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideInUp: {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
      },
    },
  },
  plugins: [],
}