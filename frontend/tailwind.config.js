/** @type {import('tailwindcss').Config} */
export default {
  mode:'jit', // added just in time mode to compile faster
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        navbar: ["Changa", "sans-serif"],
        menu: ["Brush Script MT", "sans-serif"],
      },
    },
  },
  plugins: [],
};
