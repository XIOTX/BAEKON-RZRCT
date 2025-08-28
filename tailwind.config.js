/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './ui/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'neon-blue': '#00ffff',
        'neon-purple': '#8b5cf6',
        'neon-pink': '#ff69b4',
        'cyber-dark': '#0a0b0d',
        'cyber-darker': '#14161a',
        'terminal-green': '#39ff14',
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'neon': '0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor',
        'cyber': '0 0 20px rgba(139, 92, 246, 0.4)',
      },
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          from: { 'box-shadow': '0 0 10px rgba(139, 92, 246, 0.4)' },
          to: { 'box-shadow': '0 0 20px rgba(139, 92, 246, 0.8)' },
        }
      }
    },
  },
  plugins: [],
}
