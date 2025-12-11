/** @type {import('tailwindcss').Config} */
exports.default = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Rouge pour les accents et les éléments importants
        'admin-primary': '#DC2626', // Un rouge vif (Red-600)
        // Fond très clair/blanc nuancé pour l'ensemble de l'application
        'admin-bg': '#F9FAFB', // Un gris très clair
      },
      // Configuration de la police si vous voulez une police différente
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

