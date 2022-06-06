module.exports = {
  content: ['./views/**/*.ejs'],
  theme: {
    extend: {
      fontFamily:{
        Montserrat: ["Montserrat", "sans-serif"],
      },
      width: {
        '100': '28rem',
      },
      height: {
        '132': '37rem',
        '130': '35rem',
        '128': '32rem',
        '100': '28rem',
      },
      animation:{
        'ping-slow': 'spin 4s linear infinite',
      },
    },
  },
  plugins: [],
}
