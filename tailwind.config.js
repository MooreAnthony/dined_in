/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dark: {
          primary: '#1A1A1A',
          secondary: '#2D2D2D',
          accent: '#6366F1',
          text: {
            primary: '#FFFFFF',
            secondary: '#CCCCCC',
            muted: '#999999',
          },
          border: '#404040',
        },
      },
      backgroundSize: {
        '300%': '300%',
      },
      animation: {
        gradient: 'gradient 8s linear infinite',
        fadeIn: 'fadeIn 0.2s ease-out forwards',
        modalIn: 'modalIn 0.3s ease-out',
        modalOut: 'modalOut 0.2s ease-in',
        fadeIn: 'fadeIn 0.2s ease-out',
        fadeOut: 'fadeOut 0.2s ease-in',
      },
      keyframes: {
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateX(-10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        },
        modalIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        modalOut: {
          '0%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(0.95)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
      },
      boxShadow: {
        'dark-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.35)',
        'dark-md': '0 4px 6px -1px rgba(0, 0, 0, 0.35), 0 2px 4px -1px rgba(0, 0, 0, 0.45)',
        'dark-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.35), 0 4px 6px -2px rgba(0, 0, 0, 0.45)',
      },
    },
  },
  plugins: [],
};