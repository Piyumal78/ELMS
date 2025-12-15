module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#004AAD",
        secondary: "#00C4B4",
        warning: "#FFC107",
        success: "#28A745",
        danger: "#E74C3C",
        background: "#F5F7FA",
      },
      backgroundImage: {
        "primary-gradient": "linear-gradient(to right, #004AAD, #00C4B4)",
        "secondary-gradient": "linear-gradient(to right, #00C4B4, #004AAD)",
      }
    },
  },
  plugins: [],
}
