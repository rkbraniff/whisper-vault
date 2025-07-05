/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{ts,tsx,js,jsx}'
  ],
  theme: {
    extend: {
      colors: {
        obsidian:   '#0C0C0C',
        violetDeep: '#5E4B8B',
        emberSoft:  '#F5C97E',
        textPale:   '#E0E0E0'
      },
      fontFamily: {
        heading: ['Cinzel', 'serif'],
        body:    ['Inter', 'sans-serif']
      }
    }
  }
};
