import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
      colors: {
        canvas: "#F5F5F7",
        surface: "#FFFFFF",
        surfaceHover: "#F0F0F2",
        ink: "#1D1D1F",
        muted: "#6E6E73",
        line: "#E5E5EA",
        accent: "#0071E3",
        accentSoft: "#E8F2FF",
        artist: "#C9A24B",
        label: "#0071E3",
        danger: "#D0432B",
        success: "#1F9254",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)",
      },
      keyframes: {
        blurIn: {
          "0%": { opacity: "0", filter: "blur(12px)", transform: "translateY(8px)" },
          "100%": { opacity: "1", filter: "blur(0px)", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        logoIn: {
          "0%": { opacity: "0", filter: "blur(24px)", transform: "scale(0.88)" },
          "45%": { opacity: "1", filter: "blur(6px)", transform: "scale(1.035)" },
          "70%": { filter: "blur(1px)", transform: "scale(0.99)" },
          "100%": { opacity: "1", filter: "blur(0px)", transform: "scale(1)" },
        },
        popIn: {
          "0%": { opacity: "0", transform: "scale(0.97) translateY(4px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
      },
      animation: {
        "blur-in": "blurIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
        "fade-in": "fadeIn 0.5s ease-out both",
        "logo-in": "logoIn 2.2s cubic-bezier(0.22, 1, 0.36, 1) both",
        "pop-in": "popIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) both",
      },
    },
  },
  plugins: [],
};
export default config;
