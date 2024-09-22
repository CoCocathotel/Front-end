/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        backgroundImage: {
          'Bg': "url('assets/image/bg.png')",
        },
        animation: {
          slide: 'slide 100s linear infinite',  
        },
        keyframes: {
          slide: {
            '0%, 100%': { transform: 'translateX(0)' },
            '50%': { transform: 'translateX(-100%)' }, 
          },
        },
        fontFamily:{
          Kanit: ['Kanit']
        }
      },
    },
    plugins: [],
  }