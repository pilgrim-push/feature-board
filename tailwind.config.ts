import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        chart: {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar-background)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
        'stripe-blue': 'var(--stripe-blue)',
        'stripe-blue-hover': 'var(--stripe-blue-hover)',
        'stripe-blue-light': 'var(--stripe-blue-light)',
        'stripe-bg': 'var(--stripe-bg)',
        'stripe-surface': 'var(--stripe-surface)',
        'stripe-sidebar': 'var(--stripe-sidebar)',
        'stripe-card': 'var(--stripe-card)',
        'stripe-text': 'var(--stripe-text)',
        'stripe-text-muted': 'var(--stripe-text-muted)',
        'stripe-border': 'var(--stripe-border)',
        'stripe-hover': 'var(--stripe-hover)',
        'stripe-success': 'var(--stripe-success)',
        'stripe-warning': 'var(--stripe-warning)',
        'stripe-danger': 'var(--stripe-danger)',
        'stripe-gray': {
          '50': 'var(--stripe-gray-50)',
          '100': 'var(--stripe-gray-100)',
          '200': 'var(--stripe-gray-200)',
          '300': 'var(--stripe-gray-300)',
          '400': 'var(--stripe-gray-400)',
          '500': 'var(--stripe-gray-500)',
          '600': 'var(--stripe-gray-600)',
          '700': 'var(--stripe-gray-700)',
          '800': 'var(--stripe-gray-800)',
          '900': 'var(--stripe-gray-900)',
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        serif: ["var(--font-serif)"],
        mono: ["var(--font-mono)"],
        'segoe': ['"Segoe UI"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      minWidth: {
        '24': '6rem',
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
