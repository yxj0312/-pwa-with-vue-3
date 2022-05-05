module.exports = {
  // purge:['./public/index.html','./src/**/*.{vue,js}'],
  darkMode: false,
  content: ["./src/**/*.{html,vue,js}"],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}