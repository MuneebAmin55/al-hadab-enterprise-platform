import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        basalt: {
          950: "#09111E",
          900: "#0F1E2E",
          800: "#1E2C3D",
          700: "#334155",
          600: "#475569",
          500: "#64748B",
          300: "#CBD5E1",
          200: "#E2E8F0",
          100: "#F1F5F9"
        },
        sand: {
          50: "#FAF8F5",
          100: "#F3EFEA",
          200: "#E2D9CC",
          300: "#D1C7B7",
          400: "#B8AC99"
        },
        copper: {
          700: "#863C05",
          600: "#A34A08",
          500: "#C25E1A",
          400: "#DD7835",
          300: "#E89B66",
          100: "#FCEEE3",
          50: "#FDF6F0"
        }
      },
      fontFamily: {
        sans: ["Inter", "URW DIN Arabic", "system-ui", "sans-serif"],
        display: ["URW DIN Arabic", "Inter", "system-ui", "sans-serif"],
        arabic: ["URW DIN Arabic", "Cairo", "system-ui", "sans-serif"]
      },
      boxShadow: {
        "elevation-1": "0px 1px 3px rgba(9, 17, 30, 0.04), 0px 1px 2px rgba(9, 17, 30, 0.02)",
        "elevation-2": "0px 4px 12px rgba(9, 17, 30, 0.06), 0px 1px 3px rgba(9, 17, 30, 0.04)",
        "elevation-3": "0px 10px 24px rgba(9, 17, 30, 0.08), 0px 2px 6px rgba(9, 17, 30, 0.04)",
        "elevation-4": "0px 20px 48px rgba(9, 17, 30, 0.12), 0px 4px 12px rgba(9, 17, 30, 0.06)"
      }
    }
  },
  plugins: []
} satisfies Config;
