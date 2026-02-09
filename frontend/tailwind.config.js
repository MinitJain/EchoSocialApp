/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@copilotkit/**/*.{js,jsx,ts,tsx}", // Add this line
  ],
  theme: {
    extend: {
      backdropBlur: {
        md: "12px",
        lg: "16px",
      },
      blur: {
        sm: "4px",
        md: "8px",
      },
    },
  },
  plugins: [],
};
