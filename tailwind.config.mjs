import defaultTheme from 'tailwindcss/defaultTheme'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [...defaultTheme.fontFamily.sans],
      },
      screens: {
        'xl': '1200px',
      },
      colors: {
        // PRIMARY
        'primary-50': 'rgb(var(--primary-50))',
        'primary-100': 'rgb(var(--primary-100))',
        'primary-200': 'rgb(var(--primary-200))',
        'primary-300': 'rgb(var(--primary-300))',
        'primary-400': 'rgb(var(--primary-400))',
        'primary-500': 'rgb(var(--primary-500))',
        'primary-600': 'rgb(var(--primary-600))',
        'primary-700': 'rgb(var(--primary-700))',
        'primary-800': 'rgb(var(--primary-800))',
        'primary-900': 'rgb(var(--primary-900))',
        'primary-950': 'rgb(var(--primary-950))',
        // NEUTRAL
        'neutral-0': 'rgb(var(--neutral-0))',
        'neutral-50': 'rgb(var(--neutral-50))',
        'neutral-100': 'rgb(var(--neutral-100))',
        'neutral-200': 'rgb(var(--neutral-200))',
        'neutral-300': 'rgb(var(--neutral-300))',
        'neutral-400': 'rgb(var(--neutral-400))',
        'neutral-500': 'rgb(var(--neutral-500))',
        'neutral-600': 'rgb(var(--neutral-600))',
        'neutral-700': 'rgb(var(--neutral-700))',
        'neutral-800': 'rgb(var(--neutral-800))',
        'neutral-900': 'rgb(var(--neutral-900))',
        'neutral-950': 'rgb(var(--neutral-950))',
        // TEXT
        'text-primary': 'rgb(var(--text-primary))',
        'text-secondary': 'rgb(var(--text-secondary))',
        'text-accent': 'rgb(var(--text-accent))',
        // MOTIVATOR
        'motivator-type-1': 'rgb(var(--motivator-type-1))',
        'motivator-type-2': 'rgb(var(--motivator-type-2))',
        'motivator-type-3': 'rgb(var(--motivator-type-3))',
        // ERROR
        'error': 'rgb(var(--error))',
        // BACKGROUND
        'bg-primary': 'rgb(var(--bg-primary))',
        'bg-secondary': 'rgb(var(--bg-secondary))',
        'bg-accent': 'rgb(var(--bg-accent))',
      },
    },
  },
  plugins: [],
}
