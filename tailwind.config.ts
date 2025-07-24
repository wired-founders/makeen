import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      animation: {
        "popup-glow": "popupGlow 0.4s ease-out",
      },
      keyframes: {
        popupGlow: {
          "0%": {
            boxShadow: "0 0 0 rgba(59, 130, 246, 0)",
            transform: "scale(0.96)",
          },
          "50%": {
            boxShadow: "0 0 20px rgba(59, 130, 246, 0.4)",
            transform: "scale(1.02)",
          },
          "100%": {
            boxShadow: "0 0 0 rgba(59, 130, 246, 0)",
            transform: "scale(1)",
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
