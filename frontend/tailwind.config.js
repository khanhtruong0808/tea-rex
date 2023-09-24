/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        navbar: ["Changa", "sans-serif"],
        menu: ["Brush Script MT", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
