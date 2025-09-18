/** @type {import('tailwindcss').Config} */
import { colors, typography, spacing, layout } from './src/styles/theme';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ...colors,
        // Add Claude-inspired colors
        claude: {
          bg: '#f0eee6',
          card: '#faf9f5',
          DEFAULT: '#f0eee6'
        }
      },
      fontSize: typography.fontSize,
      fontWeight: typography.fontWeight,
      lineHeight: typography.lineHeight,
      spacing,
      maxWidth: layout.container,
      borderRadius: layout.borderRadius,
    },
  },
  plugins: [],
};