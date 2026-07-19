import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Inter",
          "Segoe UI",
          "sans-serif",
        ],
      },
      colors: {
        canvas: "#000000",
        surface: "#1C1C1E",
        surfaceHover: "#252527",
        ink: "#F5F5F7",
        muted: "#8E8E93",
        line: "#2C2C2E",
        accent: "#0A84FF",
        accentSoft: "#132338",
        artist: "#D9B966",
        label: "#0A84FF",
        danger: "#FF453A",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.5)",
      },
    },
  },
  plugins: [],
};
export default config;
