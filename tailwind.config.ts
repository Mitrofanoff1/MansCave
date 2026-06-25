import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: "#E8732A",
        dark: "#1C1A19",
      },
      fontFamily: {
        display: ['UnifixSP', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
