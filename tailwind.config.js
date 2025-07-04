/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: false, 
    content: [
      "./src/app/**/*.{js,ts,jsx,tsx}",
      "./src/components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        fontFamily: {
          sans: ["var(--font-inter)", "sans-serif"],
          fun: ["var(--font-fredoka)", "cursive"],
        },
        animation: {
          bounce: "bounce 0.6s infinite",
          fadeIn: 'fadeIn 1.2s ease-in-out',
        },
      },
        keyframes: {
          fadeIn: {
            '0%': { opacity: 0 },
            '100%': { opacity: 1 },
          },
        },
    },
    plugins: [],
  };
  