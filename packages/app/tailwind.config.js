/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        light: 'RedHatMono_300Light',
        regular: 'RedHatMono_400Regular',
        medium: 'RedHatMono_500Medium',
        semiBold: 'RedHatMono_600SemiBold',
        bold: 'RedHatMono_700Bold',
        lightItalic: 'RedHatMono_300Light_Italic',
        regularItalic: 'RedHatMono_400Regular_Italic',
        mediumItalic: 'RedHatMono_500Medium_Italic',
        semiBoldItalic: 'RedHatMono_600SemiBold_Italic',
        boldItalic: 'RedHatMono_700Bold_Italic',
      },
    },
  },
  plugins: [],
}

