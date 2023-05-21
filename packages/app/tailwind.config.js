const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        light: 'RedHatMono_300Light',
        regular: 'RedHatMono_400Regular',
        medium: 'RedHatMono_500Medium',
        semi: 'RedHatMono_600SemiBold',
        bold: 'RedHatMono_700Bold',
        lightItalic: 'RedHatMono_300Light_Italic',
        regularItalic: 'RedHatMono_400Regular_Italic',
        mediumItalic: 'RedHatMono_500Medium_Italic',
        semiItalic: 'RedHatMono_600SemiBold_Italic',
        boldItalic: 'RedHatMono_700Bold_Italic',
      },
      colors: {
        'blue-light': colors.blue[700],
        'blue-dark': colors.blue[500],
        'secondary-light': colors.zinc[500],
        'secondary-dark': colors.zinc[400],
      },
      backgroundColor: {
        light: colors.white,
        dark: colors.zinc[900],
        placeholder: colors.zinc[300],
        'placeholder-dark': colors.zinc[700],
        'contrast-light': colors.zinc[300],
        'contrast-dark': colors.zinc[600],
      },
      textColor: {
        'primary-light': colors.zinc[800],
        'primary-dark': colors.zinc[100],
        'label': colors.zinc[300],
      },
    },
  },
  plugins: [],
}

