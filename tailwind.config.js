module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      opacity: {
        50: ".5",
      },
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
};
