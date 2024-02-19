/** @type {import('tailwindcss').Config} */
module.exports = {
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
};
