/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "custom-black-4": "#1e2124",
        "custom-black-3": "#282b30",
        "custom-black-2": "#36393e",
        "custom-black-1": "#424549",
        "custom-gray-text": "#BCBCBC",
        "custom-gray-text-2": "#BFC9CA",
        "twitter-black": "#292f33",
      },
    },
  },
  plugins: [],
};
