/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}", // If using App Router
    
  ],
  theme: {
    extend: {
      colors: {
        topGreen: "#2E6D5C",
        secondGreen: "#B3D8A8",
        thirdGreen: "#FBFFE4",
        lastGreen: "#A3D1C6"

      },
    },
  },
  plugins: [],
};
