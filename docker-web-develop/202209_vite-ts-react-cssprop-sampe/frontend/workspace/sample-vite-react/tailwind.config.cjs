/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "index.html",
    "src/**/*{jsx,tsx}"
  ],
  theme: {
    screens: {
      /*
      - Rules
        - 「～n」はminのみ，「～x」はmaxのみ．
      - Refs
        - https://tailwindcss.com/docs/screens
      */
      "smn": "640px", // => @media (min-width: 640px) { ... }
      "mdn": "768px", // => @media (min-width: 768px) { ... }
      "mdx": {"max": "768px"}, // => @media (max-width: 768px) { ... }
      "lgn": "1024px", // => @media (min-width: 1024px) { ... }
      "xln": "1280px", // => @media (min-width: 1280px) { ... }
      "2xln": "1536px", // => @media (min-width: 1536px) { ... }
    },
    extend: {},
  },
  plugins: [],
}
