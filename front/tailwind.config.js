/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],

  safelist: [
    "xs:block",
    "sm:block",
    "md:block",
    "lg:block",
    "xl:block",
    "2xl:block",
    "3xl:block",

    // hidden
    "xs:hidden",
    "sm:hidden",
    "md:hidden",
    "lg:hidden",
    "xl:hidden",
    "2xl:hidden",
    "3xl:hidden",
  ],

  theme: {
    screens: {
      xs: "30rem",
      sm: "40rem",
      md: "48rem",
      lg: "64rem",
      xl: "80rem",
      "2xl": "96rem",
      "3xl": "117.5rem",
    },
    extend: {
      // colors
      colors: {
        white: "#ffffff",
        black: "#000000",
        gold: "#CE9D35",
        green: "#4cd964",
        orange: "#f54f11",
        grey: "#a0a0a0",
        blue: "#007aff",
      },
      //   fonts
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
      },
      // animmation
      keyframes: {
        overlayShow: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        overlayHide: {
          from: { opacity: 1 },
          to: { opacity: 0 },
        },
        contentShow: {
          from: {
            opacity: 0,
            transform: "scale(0.96)",
          },
          to: {
            opacity: 1,
            transform: "scale(1)",
          },
        },
        contentHide: {
          from: {
            opacity: 1,
            transform: "scale(1)",
          },
          to: {
            opacity: 0,
            transform: "scale(0.96)",
          },
        },
      },
      animation: {
        overlayShow: "overlayShow 200ms ease-out",
        overlayHide: "overlayHide 150ms ease-in",
        contentShow: "contentShow 200ms ease-out",
        contentHide: "contentHide 150ms ease-in",
      },
    },
  },

  plugins: [],
};
