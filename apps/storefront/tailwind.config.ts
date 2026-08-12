import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue'
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0c2340',
          dark: '#08172b',
        },
        brand: {
          orange: '#ff890b',
          'orange-hover': '#e0831a',
        }
      }
    }
  },
  plugins: [],
}