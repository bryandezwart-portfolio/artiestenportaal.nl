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
        canvas: "#F5F5F7",
        surface: "#FFFFFF",
        ink: "#1D1D1F",
        muted: "#6E6E73",
        line: "#E5E5EA",
        accent: "#0071E3",
        accentSoft: "#E8F2FF",
        artist: "#C9A24B",
        label: "#0071E3",
        danger: "#D0432B",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [],
};
export default config;
