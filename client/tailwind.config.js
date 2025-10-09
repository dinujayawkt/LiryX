/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#7c3aed', // primary purple
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95'
        },
        base: {
          900: '#0a0a0a',
          800: '#111111',
          700: '#171717'
        }
      },
      boxShadow: {
        glow: '0 10px 30px -10px rgba(124,58,237,0.6)'
      },
      backgroundImage: {
        'radial-spot': 'radial-gradient(1200px 600px at 50% -80px, rgba(124,58,237,0.25), transparent)'
      }
    }
  }
}
