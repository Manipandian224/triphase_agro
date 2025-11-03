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
        background: 'hsl(var(--background))', // #FFFFFF
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))', // #0A84FF
          foreground: 'hsl(var(--primary-foreground))',
          hover: '#007AFF',
          disabled: '#DDEFFF',
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
          DEFAULT: 'hsl(var(--destructive))', // #FF3B30
          foreground: 'hsl(var(--destructive-foreground))',
        },
        success: 'hsl(var(--success))', // #34C759
        warning: 'hsl(var(--warning))', // #FFD60A
        border: 'hsl(var(--border))', // #E6E6EA
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        gray: {
          50: '#F2F2F5',
          100: '#E6E6EA',
          400: '#8E8E93',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      boxShadow: {
        card: '0 6px 18px rgba(15,15,15,0.06)',
        button: '0 6px 12px rgba(10,132,255,0.12)',
      },
      borderRadius: {
        lg: '12px', // card
        md: '8px', // button
        sm: '6px', // input
      },
      fontFamily: {
        sans: ['"SF Pro Text"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        body: ['"SF Pro Text"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        headline: ['"SF Pro Display"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        h1: ['32px', {lineHeight: '1.35', fontWeight: '600', letterSpacing: '-0.01em'}],
        h2: ['24px', {lineHeight: '1.4', fontWeight: '600', letterSpacing: '-0.01em'}],
        body: ['16px', {lineHeight: '1.55', fontWeight: '400'}],
        small: ['13px', {lineHeight: '1.6', fontWeight: '400'}],
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
