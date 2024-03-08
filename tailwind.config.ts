import type { Config } from "tailwindcss";
const { fontFamily } = require("tailwindcss/defaultTheme");

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      colors: {
        "vd-beige": {
          600: "rgb(var(--vd-beige-600) / <alpha-value>)",
          400: "rgb(var(--vd-beige-400) / <alpha-value>)",
          300: "rgb(var(--vd-beige-300) / <alpha-value>)",
          200: "rgb(var(--vd-beige-200) / <alpha-value>)",
          100: "rgb(var(--vd-beige-100) / <alpha-value>)",
        },
        "vd-blue": {
          900: "rgb(var(--vd-blue-900) / <alpha-value>)",
          700: "rgb(var(--vd-blue-700) / <alpha-value>)",
          600: "rgb(var(--vd-blue-600) / <alpha-value>)",
          500: "rgb(var(--vd-blue-500) / <alpha-value>)",
          400: "rgb(var(--vd-blue-400) / <alpha-value>)",
          300: "rgb(var(--vd-blue-300) / <alpha-value>)",
          200: "rgb(var(--vd-blue-200) / <alpha-value>)",
          100: "rgb(var(--vd-blue-100) / <alpha-value>)",
          50: "rgb(var(--vd-blue-50) / <alpha-value>)",
        },
        "vd-orange": {
          900: "rgb(var(--vd-orange-900) / <alpha-value>)",
          800: "rgb(var(--vd-orange-800) / <alpha-value>)",
          700: "rgb(var(--vd-orange-700) / <alpha-value>)",
          600: "rgb(var(--vd-orange-600) / <alpha-value>)",
          500: "rgb(var(--vd-orange-500) / <alpha-value>)",
          400: "rgb(var(--vd-orange-400) / <alpha-value>)",
          300: "rgb(var(--vd-orange-300) / <alpha-value>)",
          200: "rgb(var(--vd-orange-200) / <alpha-value>)",
        },
        "vd-gray": {
          600: "rgb(var(--vd-gray-600) / <alpha-value>)",
          500: "rgb(var(--vd-gray-500) / <alpha-value>)",
          400: "rgb(var(--vd-gray-400) / <alpha-value>)",
          300: "rgb(var(--vd-gray-300) / <alpha-value>)",
          200: "rgb(var(--vd-gray-200) / <alpha-value>)",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
