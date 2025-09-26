module.exports = {
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
        white: "#FFFFFF",
        darkBlue: "#130F26",
      },
    },
  },
  plugins: [],
};
