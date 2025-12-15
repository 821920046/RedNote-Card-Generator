/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        xhs: '#ff2442',
        'sketch-bg': '#FFFBF0',
        'sketch-text': '#3C3C3C',
        'sketch-accent': '#FF5722',
        'sketch-border': '#B0A294',
      },
      fontFamily: {
        'sans-sc': ['"Noto Sans SC"', 'sans-serif'],
        'serif-sc': ['"Noto Serif SC"', 'serif'],
        'handwriting': ['"Ma Shan Zheng"', 'cursive'],
        'artistic': ['"ZCOOL XiaoWei"', 'serif'],
        'poster': ['"ZCOOL QingKe HuangYou"', 'sans-serif'],
        'happy': ['"ZCOOL KuaiLe"', 'cursive'],
        'calligraphy': ['"Long Cang"', 'cursive'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}