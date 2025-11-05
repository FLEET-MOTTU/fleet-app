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
      colors: {
        background: "#FFFFFF",
        backgroundDark: "#0D0D0D",
        white: "#FFFFFF",
        darkBlue: "#130F26",
        gray: "#2D2D2D",
        lightGray: "#D2D2D2",
        bleuInputDark: "#1f222a",
        inputDark: "#121212",
        lightText: "#6B7280",
        black50: "#000000C5",
      },
    },
  },
  plugins: [],
};
