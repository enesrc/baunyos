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

        "gray-1": "var(--gray-1)",
        "gray-2": "var(--gray-2)",
        "gray-3": "var(--gray-3)",
        "gray-4": "var(--gray-4)",

        "teal-0": "var(--teal-0)",
        "teal-1": "var(--teal-1)",
        "teal-2": "var(--teal-2)",
        "teal-3": "var(--teal-3)",
        "teal-4": "var(--teal-4)",

        "amber-1": "var(--amber-1)",
        "amber-2": "var(--amber-2)",
        "amber-3": "var(--amber-3)",
        "amber-4": "var(--amber-4)",

        "green-1": "var(--green-1)",
        "green-2": "var(--green-2)",
        "green-3": "var(--green-3)",
        "green-4": "var(--green-4)",

        "orange-1": "var(--orange-1)",
        "orange-2": "var(--orange-2)",
        "orange-3": "var(--orange-3)",
        "orange-4": "var(--orange-4)",

        "red-1": "var(--red-1)",
        "red-2": "var(--red-2)",
        "red-3": "var(--red-3)",
        "red-4": "var(--red-4)",
      },
    },
  },
  plugins: [typography],
} satisfies Config;