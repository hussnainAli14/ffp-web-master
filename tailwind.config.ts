import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/modules/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        'primary': {
          'bg': '#0D2D3A',
          'btn': '#0E7090',
          'black': '#101828',
          'white': '#FFFFFF',
          'gray': '#667085',
          'chip': '#363F72',
        },
        'secondary': {
          'white': '#D0D5DD',
          'gray': '#F8F9FC',
          'btn': '#A5F0FC',
          'bg': '#164C63',
        },
        'tertiary': {
          'gray': '#475467',
          'white': '#F9FAFB',
        },
        'quarternary': {
          'gray': '#9EABB0',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
