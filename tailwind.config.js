/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6366F1",
        primaryLight: "#e8e8ff8a",
        secondary: "#3B82F6",
        success: "#23C55F",
        error: "#EE4445",
        warn: "#D87606",
        info: "#4B5462",
      },
    },
  },
  plugins: [],
};
