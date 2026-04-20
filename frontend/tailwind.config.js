/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Backgrounds (dark mode first-class)
        'bg-base': '#0D0D14',
        'bg-surface': '#13131C',
        'bg-elevated': '#1A1A26',
        'bg-hover': '#20202F',

        // Borders
        'border-subtle': 'rgba(255,255,255,0.06)',
        'border-default': 'rgba(255,255,255,0.10)',
        'border-strong': 'rgba(255,255,255,0.18)',

        // Text
        'text-primary': '#F0F0FA',
        'text-secondary': '#9090AA',
        'text-muted': '#55556A',

        // Accent - Indigo/Violet family
        'accent': '#6366F1',
        'accent-hover': '#5558E8',
        'accent-subtle': '#1E1E40',
        'accent-text': '#A5B4FC',

        // Semantic
        'success': '#22C55E',
        'success-subtle': '#052E16',
        'warning': '#F59E0B',
        'warning-subtle': '#1C1300',
        'danger': '#EF4444',
        'danger-subtle': '#2D0A0A',
        'info': '#38BDF8',
        'info-subtle': '#0A1F2D',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        xs: ['11px', { lineHeight: '1.4' }],
        sm: ['13px', { lineHeight: '1.5' }],
        base: ['14px', { lineHeight: '1.5' }],
        lg: ['16px', { lineHeight: '1.6' }],
        xl: ['18px', { lineHeight: '1.6' }],
        '2xl': ['20px', { lineHeight: '1.6' }],
        '3xl': ['24px', { lineHeight: '1.6' }],
        '4xl': ['28px', { lineHeight: '1.6' }],
        '5xl': ['32px', { lineHeight: '1.6' }],
        '6xl': ['48px', { lineHeight: '1.2' }],
      },
      spacing: {
        '0.5': '2px',
        '1': '4px',
        '1.5': '6px',
        '2': '8px',
        '2.5': '10px',
        '3': '12px',
        '3.5': '14px',
        '4': '16px',
        '4.5': '18px',
        '5': '20px',
        '5.5': '22px',
        '6': '24px',
        '7': '28px',
        '8': '32px',
        '9': '36px',
        '10': '40px',
        '12': '48px',
        '14': '56px',
        '16': '64px',
      },
      borderRadius: {
        '5': '5px',
        '7': '7px',
        '10': '10px',
        '14': '14px',
      },
      boxShadow: {
        'floating': '0 0 0 1px rgba(255,255,255,0.06), 0 8px 32px rgba(0, 0, 0, 0.5), 0 2px 8px rgba(0, 0, 0, 0.3)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'pulse-once': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.3)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out',
        'scale-in': 'scale-in 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-once': 'pulse-once 0.3s ease-out',
      },
    },
  },
  plugins: [],
}
