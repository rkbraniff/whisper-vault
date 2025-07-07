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
        ember:      '#FF6A3D',
        emberDim:   '#F5C97E',
        violetDeep: '#5E4B8B',
        violetSoft: '#A593E0',
        whisper:    '#E0E0E0',
        'obsidian-light': '#232323',
        'whisper-dim': '#B0B0B0',
        accent:     '#00FFD0',
        error:      '#FF3B30',
        success:    '#2ECC40',
        info:       '#3DA5FF',
        focus:      '#FFD600',
      },
      fontFamily: {
        heading: ['Cinzel', 'serif'],
        body:    ['Inter', 'sans-serif'],
        ritual:  ['Fira Mono', 'monospace'],
        whisper: ['Quicksand', 'sans-serif']
      },
      borderRadius: {
        xl: '1.25rem',
        '2xl': '2rem',
      },
      boxShadow: {
        'ember-glow': '0 0 8px 2px #FF6A3D55',
        'violet-glow': '0 0 8px 2px #5E4B8B55',
      },
      outline: {
        focus: ['2px solid #FFD600', '2px'],
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
};
