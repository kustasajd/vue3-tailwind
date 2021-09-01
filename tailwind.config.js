const defaultTheme = require('tailwindcss/defaultTheme');

whitelist = ["gray", "red", "orange", "yellow", "green", "teal", "blue", "purple", "pink"].reduce(
  (result, color) => result.push(`text-${color}-600`, `bg-${color}-600`, `bg-${color}-500`) && result, [])

module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true
  },
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: ['./index.html', './src/**/*.{vue, js, ts}'],
    options: {
      whitelist,
    }
  },
  theme: {
    extend: {
      colors: {
        'akara-dark': '#162532',
        'akara-red': '#C20a06',
        'akara-orange': '#F16a2f',
        'akara-yellow': '#FFC412',
      },
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      screens: {
        'max-3xl': { max: '1920px' },
        // => @media (max-width: 1920px) { ... }
  
        'max-2xl': { max: '1535px' },
        // => @media (max-width: 1535px) { ... }
  
        'max-xl': { max: '1279px' },
        // => @media (max-width: 1279px) { ... }
  
        'max-lg': { max: '1023px' },
        // => @media (max-width: 1023px) { ... }
  
        'max-md': { max: '767px' },
        // => @media (max-width: 767px) { ... }
  
        'max-sm': { max: '639px' },
        // => @media (max-width: 639px) { ... }
  
  
  
        'min-3xl': { min: '1920px' },
        // => @media (min-width: 1920px) { ... }
  
        'min-2xl': { min: '1535px' },
        // => @media (min-width: 1535px) { ... }
  
        'min-xl': { min: '1279px' },
        // => @media (min-width: 1279px) { ... }
  
        'min-lg': { min: '1023px' },
        // => @media (min-width: 1023px) { ... }
  
        'min-md': { min: '767px' },
        // => @media (min-width: 767px) { ... }
  
        'min-sm': { min: '639px' }
        // => @media (min-width: 639px) { ... }
      }
    },
  },
  plugins: [require('@tailwindcss/custom-forms')],
};
