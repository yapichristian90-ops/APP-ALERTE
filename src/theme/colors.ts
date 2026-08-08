/**
 * Palette de la marque ALERTE Côte d'Ivoire, extraite du logo (bouclier
 * dégradé orange + repère de localisation). Les alertes ont leurs propres
 * teintes pour rester reconnaissables même en aperçu rapide plein écran.
 */
export const colors = {
  brand: {
    50: "#FFF7F0",
    100: "#FFEAD9",
    200: "#FFD1AD",
    300: "#FFB57D",
    400: "#FB964B",
    500: "#E8630A",
    600: "#D85D13",
    700: "#C94A0C",
    800: "#A83B0A",
    900: "#7A2A08",
  },
  violence: {
    500: "#D7263D",
    600: "#B31B2E",
    100: "#FBDEE1",
  },
  kidnap: {
    500: "#1E6FD9",
    600: "#155BB0",
    100: "#DCEAFB",
  },
  success: "#1E9E5A",
  warning: "#E8A21A",
  neutral: {
    0: "#FFFFFF",
    50: "#FAF8F6",
    100: "#F2EEEA",
    200: "#E4DED8",
    300: "#CFC6BE",
    400: "#A79C92",
    500: "#7C7168",
    600: "#584F48",
    700: "#3D3630",
    800: "#26211D",
    900: "#171310",
  },
  overlay: "rgba(23, 19, 16, 0.55)",
};

export type ColorScale = typeof colors;
