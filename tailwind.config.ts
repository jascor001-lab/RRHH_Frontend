import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0F3D2E",
        accent: "#1DB954",
        dark: "#0B1F1A"
      }
    }
  },
  plugins: []
};

export default config;