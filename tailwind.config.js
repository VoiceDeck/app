/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
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
        sans:["Plus Jakarta Sans",]
      },
      colors: {
        // main text 'CloudBurst'
        textBlue: "#252F56",
        // page background 'DawnPink'
        beige200: "#F7EDE8",
        // container backgrounds
        beige400: "#E7C9BA",
        beige300: "#F1E0D7",
        beige100: "#FBF7F5",        
        // accent 'Gothic'
        blue700: "#3A5264",
        blue600: "#416279",
        blue500: "#4B778F",
        blue400: "#6692A9",
        blue300: "#98B8C8",
        blue200: "#C2D6DF",
        // accent 'ElSalva'
        orange800: "#87362D",
        orange700: "#9F3D32",
        orange600: "#C14E41",
        orange500: "#D6695D",
        orange400: "#E48F85",
        orange300: "#EFB8B2",
        orange200: "#F6D6D2",
        // accent 'Woodsmoke'
        gray600: "#42424A",
        gray500: "#5F5F6A",
        gray400: "#92939E",
        gray300: "#B9BAC0",
        gray200: "#DADADD",

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
}