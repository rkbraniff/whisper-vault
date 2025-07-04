const tailwind = require('@tailwindcss/postcss');
const nesting = require('@tailwindcss/nesting');

module.exports = {
  plugins: [nesting, tailwind, require('autoprefixer')],
};
