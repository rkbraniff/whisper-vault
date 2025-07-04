/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        vault: {
          bg: 'var(--vault-bg)',
          accent: 'var(--vault-accent)',
        },
      },
    },
  },
  plugins: [],
};
