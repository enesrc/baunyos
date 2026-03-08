import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: ["selector", "[data-theme='dark']"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
      },
      colors: {
        "light-1": "var(--light-1)",
        "light-2": "var(--light-2)",
        "light-3": "var(--light-3)",
        "light-4": "var(--light-4)",

        "dark-1": "var(--dark-1)",
        "dark-2": "var(--dark-2)",
        "dark-3": "var(--dark-3)",
        "dark-4": "var(--dark-4)",
        "dark-5": "var(--dark-5)",
        "dark-6": "var(--dark-6)",
        "dark-7": "var(--dark-7)",

        "yellow": "var(--yellow)",
        "yellow-bright": "var(--yellow-bright)",
        "yellow-dull": "var(--yellow-dull)",

        "indigo": "var(--indigo)",
        "indigo-bright": "var(--indigo-bright)",
        "indigo-dull": "var(--indigo-dull)",

        "cyan": "var(--cyan)",
        "cyan-bright": "var(--cyan-bright)",
        "cyan-brighter": "var(--cyan-brighter)",
        "cyan-dull": "var(--cyan-dull)",

        "amber": "var(--amber)",
        "amber-bright": "var(--amber-bright)",
        "amber-dull": "var(--amber-dull)",
      },
    },
  },
  plugins: [typography],
} satisfies Config;