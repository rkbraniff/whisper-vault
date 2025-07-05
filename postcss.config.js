// postcss.config.js  — ES-module syntax to match "type": "module"
import tailwindcss from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';

export default {
  plugins: [tailwindcss, autoprefixer]
};
