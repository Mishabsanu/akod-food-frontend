import type { Config } from "tailwindcss";
const { nextui } = require("@nextui-org/react");

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#d4af37", // Gold
          text: "#1a1a1a", // Dark Charocal
          secondary: "#111111", // Almost Black
          white: "#ffffff",
          bgLight: "#faf9f6", // Off-white luxury background
          bgAccent: "#f2ece4", // Warm accent
          background: "#faf9f6", // Main background
          box: "#ffffff",
          circle: "#d4af37", // Gold
        },
      },
      screens: {
        xs: "400px",
        "3xl": "1680px",
        "4xl": "2200px",
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};
export default config;
