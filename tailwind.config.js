/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        // Rosa polvo (light).
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
        cream: {
          50:  '#fdfaf5',
          100: '#faf6f0',
          200: '#f3ebde',
          300: '#e9dcc4',
          400: '#d9c5a0'
        },
        ink: {
          50:  '#f5f1ee',
          400: '#7a6a60',
          600: '#564a43',
          700: '#3f3631',
          800: '#2c2521',
          900: '#1d1814'
        },
        // Paleta NOCTURNA candente — para modo oscuro
        night: {
          50:  '#3d1e1a',   // surface más claro
          100: '#321714',
          200: '#26110f',
          300: '#1d0c0a',
          400: '#150805',
          500: '#0f0503',   // fondo principal
          border: '#4a2622'
        },
        ember: {
          // Rojo brasa para acentos en modo oscuro
          300: '#ff9eb1',
          400: '#ff7f97',
          500: '#ff5d7e',
          600: '#ff3e63',
          700: '#e51e48'
        },
        gold: {
          // Dorado cálido para detalles premium en modo oscuro
          300: '#f4d09c',
          400: '#e9b573',
          500: '#d99a4a',
          600: '#b97c33'
        },
        brand: {
          50:  '#fbf3f1', 100: '#f5e3df', 200: '#ecc7c0', 300: '#dfa49a',
          400: '#d08679', 500: '#c06b5d', 600: '#a85648', 700: '#874539',
          800: '#6b372e', 900: '#562d26'
        }
      },
      fontFamily: {
        sans:  ['Inter', 'system-ui', 'sans-serif'],
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif']
      },
      boxShadow: {
        soft:  '0 1px 3px rgba(60, 40, 30, 0.06), 0 8px 24px -8px rgba(60, 40, 30, 0.10)',
        warm:  '0 4px 12px rgba(192, 107, 93, 0.12)',
        ember: '0 0 0 1px rgba(255, 93, 126, 0.18), 0 8px 32px -8px rgba(255, 93, 126, 0.35)'
      }
    }
  },
  corePlugins: {
    preflight: false
  },
  plugins: []
};
