/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        navbar: ["Changa", "sans-serif"],
        menu: ["Lilita One", "sans-serif"],
        description: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("tailwindcss-animated"),
  ],
};
