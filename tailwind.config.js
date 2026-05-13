/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        // Rosa polvo, menos saturado, más adulto.
        rose: {
          50:  '#fbf3f1',
          100: '#f5e3df',
          200: '#ecc7c0',
          300: '#dfa49a',
          400: '#d08679',
          500: '#c06b5d',
          600: '#a85648',
          700: '#874539',
          800: '#6b372e',
          900: '#562d26'
        },
        // Verde salvia: contraste natural al rosa, calma y naturaleza.
        sage: {
          50:  '#f3f5f1',
          100: '#e3e9dd',
          200: '#c8d3bf',
          300: '#a5b69a',
          400: '#8da38c',
          500: '#6f8770',
          600: '#566c58',
          700: '#445644',
          800: '#374438',
          900: '#2d372e'
        },
        // Terracotta: para acentos cálidos (precios, CTAs secundarios).
        clay: {
          50:  '#fbf2ec',
          100: '#f4dfd0',
          200: '#e9bea0',
          300: '#dc9b73',
          400: '#cd7c52',
          500: '#bd633a',
          600: '#a0502f',
          700: '#7f4027',
          800: '#653324',
          900: '#532c22'
        },
        // Fondo crema cálido, no blanco frío.
        cream: {
          50:  '#fdfaf5',
          100: '#faf6f0',
          200: '#f3ebde',
          300: '#e9dcc4',
          400: '#d9c5a0'
        },
        // Texto: marrón oscuro cálido en lugar de gris neutro.
        ink: {
          50:  '#f5f1ee',
          400: '#7a6a60',
          600: '#564a43',
          700: '#3f3631',
          800: '#2c2521',
          900: '#1d1814'
        },
        // Alias para no romper referencias antiguas a "brand".
        brand: {
          50:  '#fbf3f1',
          100: '#f5e3df',
          200: '#ecc7c0',
          300: '#dfa49a',
          400: '#d08679',
          500: '#c06b5d',
          600: '#a85648',
          700: '#874539',
          800: '#6b372e',
          900: '#562d26'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif']
      },
      boxShadow: {
        soft: '0 1px 3px rgba(60, 40, 30, 0.06), 0 8px 24px -8px rgba(60, 40, 30, 0.10)',
        warm: '0 4px 12px rgba(192, 107, 93, 0.12)'
      }
    }
  },
  corePlugins: {
    // Apagado para evitar que Tailwind pinte bordes en los divs internos
    // del notch de mat-form-field (línea vertical fantasma).
    preflight: false
  },
  plugins: []
};
