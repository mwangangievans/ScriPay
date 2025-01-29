/** @type {import('tailwindcss').Config} */
const { fontFamily } = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    "./src/**/*.{html, ts}",
    "./node_modules/flowbite/**/*.js"
  ],
 
  theme: {
    screens: {
      'sm': '640px',
      // => @media (min-width: 640px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    },
    extend: {
      
      colors: {
        background: {
        'purple_dark': '#6A2CE5',
        'purple_medium': '#A9A3F5',
        'purple_light': '#D4D1FA',
        'bright_sky_blue': '#3DB8F5',
        'font_color': '#2E2E2E'
      },
      fontFamily: {
        sans: ['Poppins', ...fontFamily.sans],
      },
      fontWeight: {
        'amy-extra-bold': 900
      }
    },
  },
  plugins: [
        require('flowbite/plugin')
    ]
}
}