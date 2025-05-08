import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
      colors: {
        lightBlue: "#E2EAFC",
        darkBlue: "#ABC4FF",
        navyBlue: "#183476",
      },
    },
  },
  plugins: [],
};

export default config;
