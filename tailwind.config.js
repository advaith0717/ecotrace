/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f0f7f0',
          100: '#dceddc',
          200: '#bbdabc',
          300: '#8ec08f',
          400: '#5ea160',
          500: '#3d8340',
          600: '#2d6830',
          700: '#255228',
          800: '#1f4222',
          900: '#1a371d',
        },
        slate: {
          850: '#1a2332',
        }
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
