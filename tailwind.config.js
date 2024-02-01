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
        // page background 'DawnPink'
        "vd-beige-200": "#F7EDE8",
        // container backgrounds
        "vd-beige-400": "#E7C9BA",
        "vd-beige-300": "#F1E0D7",
        "vd-beige-100": "#FBF7F5",
        // accent 'Gothic'
        "vd-blue-900": "#252F56", // main text 'CloudBurst'
        "vd-blue-700": "#3A5264",
        "vd-blue-600": "#416279",
        "vd-blue-500": "#4B778F",
        "vd-blue-400": "#6692A9",
        "vd-blue-300": "#98B8C8",
        "vd-blue-200": "#C2D6DF",
        // accent 'ElSalva'
        "vd-orange-800": "#87362D",
        "vd-orange-700": "#9F3D32",
        "vd-orange-600": "#C14E41",
        "vd-orange-500": "#D6695D",
        "vd-orange-400": "#E48F85",
        "vd-orange-300": "#EFB8B2",
        "vd-orange-200": "#F6D6D2",
        // accent 'Woodsmoke'
        "vd-gray-600": "#42424A",
        "vd-gray-500": "#5F5F6A",
        "vd-gray-400": "#92939E",
        "vd-gray-300": "#B9BAC0",
        "vd-gray-200": "#DADADD",
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
	plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};
