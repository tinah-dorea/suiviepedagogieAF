/**
 * Guide de Style Moderne - Application Suivi Pédagogique AF
 * 
 * Ce fichier documente les classes Tailwind CSS à utiliser pour un design cohérent
 * dans toute l'application.
 */

// ============================================================================
// 📦 CARTES (Cards)
// ============================================================================

// Carte Standard
const cardStandard = `
  bg-white 
  rounded-2xl 
  shadow-lg 
  hover:shadow-2xl 
  transition-all 
  duration-300 
  border 
  border-gray-100
`;

// Carte avec Header Dégradé
const cardWithGradientHeader = `
  relative 
  overflow-hidden 
  rounded-2xl 
  shadow-lg 
  hover:shadow-2xl 
  transition-all 
  duration-300
`;

// Header Dégradé par Statut
const statusGradients = {
  'success': 'bg-gradient-to-r from-green-500 to-emerald-600',
  'info': 'bg-gradient-to-r from-blue-500 to-cyan-600',
  'warning': 'bg-gradient-to-r from-amber-500 to-orange-600',
  'danger': 'bg-gradient-to-r from-red-500 to-rose-600',
  'neutral': 'bg-gradient-to-r from-gray-400 to-gray-500',
};

// ============================================================================
// 🔘 BOUTONS (Buttons)
// ============================================================================

// Bouton Primaire (Ajouter)
const btnPrimary = `
  inline-flex 
  items-center 
  px-4 
  py-2 
  bg-gradient-to-r 
  from-blue-600 
  to-blue-700 
  text-white 
  text-sm 
  font-medium 
  rounded-lg 
  hover:from-blue-700 
  hover:to-blue-800 
  transition-all 
  shadow-md 
  hover:shadow-lg
`;

// Bouton Secondaire
const btnSecondary = `
  px-4 
  py-2 
  border 
  border-gray-300 
  rounded-lg 
  text-gray-700 
  hover:bg-gray-50 
  transition-colors
`;

// Bouton Danger
const btnDanger = `
  px-4 
  py-2 
  bg-red-600 
  text-white 
  rounded-lg 
  hover:bg-red-700 
  transition-colors
`;

// Bouton Icone
const btnIcon = `
  p-2 
  rounded-lg 
  hover:bg-gray-100 
  transition-colors
`;

// ============================================================================
// 📊 TABLEAUX (Tables)
// ============================================================================

// Conteneur de Tableau
const tableContainer = `
  bg-white 
  rounded-2xl 
  shadow-lg 
  overflow-hidden 
  border 
  border-gray-100
`;

// En-tête de Tableau
const tableHeader = `
  bg-gradient-to-r 
  from-blue-50 
  to-blue-100
`;

// Cellule Header
const tableTh = `
  px-6 
  py-4 
  text-left 
  text-xs 
  font-semibold 
  text-blue-800 
  uppercase 
  tracking-wider
`;

// Ligne de Tableau
const tableRow = `
  hover:bg-blue-50/50 
  transition-colors
`;

// Cellule Corps
const tableTd = `
  px-6 
  py-4 
  whitespace-nowrap
`;

// ============================================================================
// 🎯 BADGES DE STATUT
// ============================================================================

const statusBadges = {
  'success': 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-700',
  'info': 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700',
  'warning': 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-50 text-amber-700',
  'danger': 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-50 text-red-700',
  'neutral': 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-50 text-gray-700',
};

// ============================================================================
// 📈 STATISTIQUES (Stats Cards)
// ============================================================================

const statCard = `
  text-center 
  p-3 
  rounded-xl
`;

const statCardGradients = {
  'blue': 'bg-gradient-to-br from-blue-50 to-blue-100',
  'green': 'bg-gradient-to-br from-green-50 to-green-100',
  'purple': 'bg-gradient-to-br from-purple-50 to-purple-100',
  'amber': 'bg-gradient-to-br from-amber-50 to-amber-100',
  'red': 'bg-gradient-to-br from-red-50 to-red-100',
};

const statValue = `
  text-2xl 
  font-bold
`;

const statValueColors = {
  'blue': 'text-blue-600',
  'green': 'text-green-600',
  'purple': 'text-purple-600',
  'amber': 'text-amber-600',
  'red': 'text-red-600',
};

const statLabel = `
  text-xs 
  text-gray-600 
  mt-1
`;

// ============================================================================
// 🪟 MODALS
// ============================================================================

// Overlay
const modalOverlay = `
  fixed 
  inset-0 
  bg-black 
  bg-opacity-50 
  flex 
  items-center 
  justify-center 
  z-50 
  overflow-y-auto 
  p-4
`;

// Modal Container
const modalContainer = `
  bg-white 
  rounded-xl 
  shadow-2xl 
  max-w-2xl 
  w-full 
  mx-auto 
  my-8
`;

// Modal Header avec Dégradé
const modalHeader = `
  px-6 
  py-4 
  border-b 
  border-gray-200 
  flex 
  items-center 
  justify-between 
  bg-gradient-to-r 
  from-blue-600 
  to-blue-700 
  text-white 
  rounded-t-xl 
  sticky 
  top-0
`;

// Modal Body
const modalBody = `
  p-6 
  max-h-[70vh] 
  overflow-y-auto
`;

// Modal Footer
const modalFooter = `
  flex 
  justify-end 
  space-x-3 
  mt-6 
  pt-4 
  border-t 
  sticky 
  bottom-0 
  bg-white
`;

// Bouton Fermer Modal
const modalCloseBtn = `
  text-white 
  hover:text-gray-200 
  transition-colors
`;

// ============================================================================
// 🎨 ICÔNES AVEC FOND
// ============================================================================

const iconWithBackground = `
  flex-shrink-0 
  w-10 
  h-10 
  rounded-lg 
  flex 
  items-center 
  justify-center
`;

const iconBackgroundGradients = {
  'blue': 'bg-gradient-to-br from-blue-100 to-blue-200',
  'green': 'bg-gradient-to-br from-green-100 to-green-200',
  'purple': 'bg-gradient-to-br from-purple-100 to-purple-200',
  'amber': 'bg-gradient-to-br from-amber-100 to-amber-200',
  'red': 'bg-gradient-to-br from-red-100 to-red-200',
};

const iconColors = {
  'blue': 'text-blue-600',
  'green': 'text-green-600',
  'purple': 'text-purple-600',
  'amber': 'text-amber-600',
  'red': 'text-red-600',
};

// ============================================================================
// 📝 EXEMPLES D'UTILISATION
// ============================================================================

/*
  // Carte Standard
  <div className={cardStandard}>
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900">Titre</h3>
      <p className="mt-2 text-gray-600">Contenu...</p>
    </div>
  </div>

  // Bouton Ajouter
  <button className={btnPrimary}>
    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
    Ajouter
  </button>

  // Tableau
  <div className={tableContainer}>
    <table className="min-w-full">
      <thead className={tableHeader}>
        <tr>
          <th className={tableTh}>Colonne 1</th>
          <th className={tableTh}>Colonne 2</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        <tr className={tableRow}>
          <td className={tableTd}>Donnée 1</td>
          <td className={tableTd}>Donnée 2</td>
        </tr>
      </tbody>
    </table>
  </div>

  // Badge de Statut
  <span className={statusBadges.success}>Actif</span>

  // Carte Statistique
  <div className={`${statCard} ${statCardGradients.blue}`}>
    <div className={`${statValue} ${statValueColors.blue}`}>42</div>
    <div className={statLabel}>Utilisateurs</div>
  </div>

  // Modal
  <div className={modalOverlay}>
    <div className={modalContainer}>
      <div className={modalHeader}>
        <h3 className="text-lg font-semibold">Titre</h3>
        <button className={modalCloseBtn}>×</button>
      </div>
      <div className={modalBody}>
        {/* Contenu */}
      </div>
      <div className={modalFooter}>
        <button className={btnSecondary}>Annuler</button>
        <button className={btnPrimary}>Valider</button>
      </div>
    </div>
  </div>

  // Icône avec Fond
  <div className={`${iconWithBackground} ${iconBackgroundGradients.blue}`}>
    <svg className={`${iconColors.blue} w-5 h-5`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  </div>
*/

// ============================================================================
// 🎨 PALETTE DE COULEURS
// ============================================================================

/*
  Primaire: blue-600 → blue-700 (boutons, headers)
  Succès: green-500 → emerald-600 (statut actif, validation)
  Information: blue-500 → cyan-600 (statut à venir)
  Avertissement: amber-500 → orange-600 (attention)
  Danger: red-500 → rose-600 (erreur, suppression)
  Neutre: gray-400 → gray-500 (statut terminé, inactif)
  
  Backgrounds:
  - Principal: bg-gray-50
  - Cartes: bg-white
  - Hover: bg-blue-50/50
  - Headers: bg-gradient-to-r from-blue-50 to-blue-100
*/

// ============================================================================
// ✨ EFFETS SPÉCIAUX
// ============================================================================

// Effet Hover sur Carte
const cardHoverEffect = `
  group 
  relative 
  overflow-hidden
`;

const cardHoverOverlay = `
  absolute 
  inset-0 
  bg-gradient-to-r 
  from-blue-600/5 
  to-purple-600/5 
  opacity-0 
  group-hover:opacity-100 
  transition-opacity 
  duration-300 
  pointer-events-none
`;

// Effet de Vague (décoratif dans les headers)
const waveDecoration = `
  absolute 
  top-0 
  right-0 
  w-32 
  h-32 
  bg-white 
  opacity-10 
  rounded-full 
  -mr-16 
  -mt-16
`;

// Glassmorphism (badges sur fond coloré)
const glassmorphism = `
  bg-white/20 
  backdrop-blur-sm
`;

// ============================================================================
// 📱 RESPONSIVE
// ============================================================================

/*
  Mobile First:
  - px-4 sm:px-8 py-4 sm:py-6 (padding pages)
  - text-lg sm:text-xl (titres)
  - grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 (grilles)
  - hidden md:block (éléments desktop uniquement)
*/

export default {
  cardStandard,
  cardWithGradientHeader,
  statusGradients,
  btnPrimary,
  btnSecondary,
  btnDanger,
  btnIcon,
  tableContainer,
  tableHeader,
  tableTh,
  tableRow,
  tableTd,
  statusBadges,
  statCard,
  statCardGradients,
  statValue,
  statValueColors,
  statLabel,
  modalOverlay,
  modalContainer,
  modalHeader,
  modalBody,
  modalFooter,
  modalCloseBtn,
  iconWithBackground,
  iconBackgroundGradients,
  iconColors,
  cardHoverEffect,
  cardHoverOverlay,
  waveDecoration,
  glassmorphism,
};
