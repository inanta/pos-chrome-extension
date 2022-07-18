module.exports = {
  mode: "jit",
  purge: {
    content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"]
    // safelist: ["text-xl", "text-2xl"]
  },
  // content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  // important: true,
  theme: {
    // colors: {
    //   'primary': '#0d6efd'
    // },
    // fontFamily: {
    //   body: ["Nunito", "sans-serif"],
    //   title: ["Lora", "serif"]
    // },
    extend: {
      colors: {
        primary: "#0093ff",
        secondary: "#4d4d4d",
        tertiary: "#c9c9c9"
      }
    }
  },

  plugins: [require("@tailwindcss/line-clamp")]
};
