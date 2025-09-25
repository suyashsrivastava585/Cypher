/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1E3A8A",
        "primary-foreground": "#ffffff",
        secondary: "#9333EA",
        "secondary-foreground": "#ffffff",
        background: "#1F2937",
        "muted-foreground": "#9CA3AF",
        available: "#16A34A",
        warning: "#F59E0B",
        border: "#374151",
        foreground: "#F3F4F6",
      },
      backgroundImage: {
        "gradient-hero":
          "linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)",
        "gradient-card":
          "linear-gradient(to bottom right, rgba(31,41,55,0.8), rgba(55,65,81,0.6))",
        "gradient-primary": "linear-gradient(to right, #1E3A8A, #9333EA)",
      },
      boxShadow: {
        card: "0 8px 20px rgba(0,0,0,0.4)",
        primary: "0 8px 20px rgba(30, 58, 138, 0.6)",
      },
      backdropBlur: {
        xs: "4px",
        sm: "8px",
        md: "12px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
