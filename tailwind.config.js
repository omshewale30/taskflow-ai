/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './lib/**/*.{js,jsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00DAC6', // Electric Teal
          hover: '#00C4B4',
          focus: '#00AFA0',
        },
        background: {
          dark: '#1A1D21', // Dark Charcoal
          card: '#2C2F33', // Slightly Lighter Dark
          hover: '#363A3F'
        },
        text: {
          primary: '#E1E1E1', // Off-White
          secondary: '#A0A0A0', // Light Gray
          muted: '#6C757D'
        },
        success: {
          DEFAULT: '#10B981', // Green
          background: '#10B98120'
        },
        warning: {
          DEFAULT: '#F59E0B', // Amber
          background: '#F59E0B20'
        },
        error: {
          DEFAULT: '#EF4444', // Red
          background: '#EF444420'
        },
        border: '#3F4447' // Border color
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      },
      spacing: {
        '0': '0px',
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
        '20': '80px',
        '24': '96px',
        '32': '128px'
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
        'hover': '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)'
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px'
      }
    },
  },
  plugins: [],
}