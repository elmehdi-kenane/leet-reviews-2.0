import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#41B06E",
        secondary: "#141E46",
        accent: "#8DECB4",
        neutral: "#FFF5E0",
        gray: "#D9D9D9",
      },
      fontFamily: {
        Inter: ["Inter", "sans-serif"],
        SpaceGrotesk: ["Space Grotesk", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
