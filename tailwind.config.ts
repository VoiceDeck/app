const svgToDataUri = require("mini-svg-data-uri");
const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
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
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      boxShadow: {
        sm: "0px 10px 10px 0px rgba(0, 0, 0, 0.15), 0px 4px 4px 0px rgba(0, 0, 0, 0.10), 0px 1px 0px 0px rgba(0, 0, 0, 0.05)",
        md: "0px 10px 20px 0px rgba(0, 0, 0, 0.20), 0px 5px 10px 0px rgba(0, 0, 0, 0.10), 0px 2px 4px 0px rgba(0, 0, 0, 0.10)",
        lg: "0px 15px 30px 0px rgba(0, 0, 0, 0.20), 0px 10px 20px 0px rgba(0, 0, 0, 0.15), 0px 3px 6px 0px rgba(0, 0, 0, 0.10)",
        xl: "0px 20px 40px 0px rgba(0, 0, 0, 0.25), 0px 15px 30px 0px rgba(0, 0, 0, 0.15), 0px 5px 10px 0px rgba(0, 0, 0, 0.05)",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
    function ({ matchUtilities, theme }: { matchUtilities: any; theme: any }) {
      matchUtilities(
        {
          "bg-grid": (value: string) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
            )}")`,
          }),
        },
        {
          values: flattenColorPalette(theme("backgroundColor")),
          type: "color",
        }
      );

      matchUtilities(
        {
          highlight: (value: string) => ({
            boxShadow: `inset 0 1px 0 0 ${value}`,
          }),
        },
        {
          values: flattenColorPalette(theme("backgroundColor")),
          type: "color",
        }
      );
    },
  ],
};
