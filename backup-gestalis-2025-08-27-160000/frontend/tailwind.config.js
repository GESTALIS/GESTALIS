/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Charte graphique GESTALIS
        gestalis: {
          primary: '#004b5d',
          'primary-light': '#006d8a',
          'primary-dark': '#003a4a',
          secondary: '#f89032',
          'secondary-light': '#ffa64d',
          'secondary-dark': '#e67a1a',
          accent: '#eca08e',
          'accent-light': '#f0b8a8',
          'accent-dark': '#d88c7a',
          tertiary: '#ba8a36',
          'tertiary-light': '#d4a85a',
          'tertiary-dark': '#a67a2a',
          quaternary: '#d65a31', // Orange foncé pour Trésorerie
          'quaternary-light': '#e67a4a',
          'quaternary-dark': '#c04a2a',
          quinary: '#2d7d8a', // Cyan pour Clients/Fournisseurs
          'quinary-light': '#4a9ba8',
          'quinary-dark': '#1f5f6a',
          senary: '#c44569', // Rose pour RH
          'senary-light': '#d46a8a',
          'senary-dark': '#a63a5a',
          septenary: '#f39c12', // Jaune pour Analyse
          'septenary-light': '#f7b84a',
          'septenary-dark': '#d6890a',
          neutral: '#ededed',
        },
        // ShadCN UI colors (pour compatibilité)
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      // Animations personnalisées
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
} 