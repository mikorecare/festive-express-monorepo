import type { Config } from 'tailwindcss'
import sharedConfig from '../../packages/shared/tailwind.config.js'

export default <Partial<Config>>{
  presets: [sharedConfig],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        sans: ['Poppins', 'sans-serif'],
      },
    },
  },
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue',
    '../../packages/shared/src/**/*.{js,vue,ts}'
  ]
}