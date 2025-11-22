import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        success: 'hsl(var(--success))',
        warning: 'hsl(var(--warning))',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },
      boxShadow: {
        'soft-depth': '0 4px 12px rgba(0, 0, 0, 0.05), 0 8px 24px rgba(0, 0, 0, 0.05)',
        'soft-depth-lg': '0 8px 24px rgba(0, 0, 0, 0.06), 0 16px 48px rgba(0, 0, 0, 0.08)',
        'glow-primary': '0 0 12px hsl(var(--primary) / 0.5), 0 0 20px hsl(var(--primary) / 0.3)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
        lg: '0.75rem',
        md: '0.5rem',
        sm: '0.25rem',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        body: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        headline: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        h1: ['32px', {lineHeight: '1.35', fontWeight: '700', letterSpacing: '-0.02em'}],
        h2: ['24px', {lineHeight: '1.4', fontWeight: '600', letterSpacing: '-0.015em'}],
        body: ['16px', {lineHeight: '1.6', fontWeight: '400'}],
        small: ['13px', {lineHeight: '1.5', fontWeight: '400'}],
      },
      transitionDuration: {
        fast: '160ms',
        normal: '240ms',
        slow: '320ms',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
