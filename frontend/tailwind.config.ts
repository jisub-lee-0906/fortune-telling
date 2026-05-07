import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Toss Identity Colors
        blue: {
          50: '#E8F3FF',
          100: '#C9E2FF',
          500: '#3182F6', // Toss Blue (Main Brand)
          600: '#1B64DA', // Hover state
        },
        gray: {
          50: '#F9FAFB',
          100: '#F2F4F6', // Toss Background Grey
          200: '#E5E8EB', // Border / Divider
          300: '#D1D6DB',
          400: '#B0B8C1', // Placeholders / Disabled
          500: '#8B95A1', // Subtext
          600: '#6B7684',
          700: '#4E5968',
          800: '#333D4B', // Secondary Text
          900: '#191F28', // Main Text (Toss Black)
        },
      },
      fontFamily: {
        sans: [
          '"Pretendard Variable"',
          '"Pretendard"',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'Roboto',
          '"Helvetica Neue"',
          '"Segoe UI"',
          '"Apple SD Gothic Neo"',
          '"Noto Sans KR"',
          '"Malgun Gothic"',
          'sans-serif',
        ],
      },
      boxShadow: {
        'toss-sm': '0 2px 8px 0 rgba(0, 0, 0, 0.04)',
        'toss-md': '0 8px 24px 0 rgba(0, 0, 0, 0.08)',
        'toss-lg': '0 20px 48px 0 rgba(0, 0, 0, 0.12)',
      },
      borderRadius: {
        'toss': '24px',
      }
    },
  },
  plugins: [
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('@tailwindcss/typography'),
  ],
};
export default config;
