module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0a0b12",
          900: "#12131c",
          800: "#1c1e2b",
          700: "#2a2d3f"
        },
        neon: {
          pink: "#ff2d6a",
          cyan: "#2de2e6",
          amber: "#ffb020"
        },
        paper: "#f4f0ea"
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"]
      },
      boxShadow: {
        feed: "0 12px 40px rgba(0,0,0,0.35)"
      }
    }
  },
  plugins: []
};
