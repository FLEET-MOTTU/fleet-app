module.exports = {
  darkMode: "class",
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        manrope: ["Manrope"],
      },
      colors: {
        background: "#F4F4FA",
        backgroundDark: "#151515",
        white: "#FFFFFF",
        darkBlue: "#130F26",
      },
    },
  },
  plugins: [],
};
