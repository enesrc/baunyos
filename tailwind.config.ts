import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
      },
      colors: {
        bg: "rgb(var(--bg))",
        fg: "rgb(var(--fg))",
        surface1: "rgb(var(--surface-1))",
        surface2: "rgb(var(--surface-2))",
        border: "rgb(var(--border))",
        accent: "rgb(var(--accent))",
        glass: "rgb(var(--glass))",
        glassBorder: "rgb(var(--glass-border))",
      },
      borderRadius: {
        xl: "var(--r-xl)",
        lg: "var(--r-lg)",
        md: "var(--r-md)",
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
      },
    },
  },
  plugins: [typography],
} satisfies Config;