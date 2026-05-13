/**
 * Google Fonts that the Aura dev playground can opt into.
 */
export const AURA_GOOGLE_FONTS = [
  {
    family: 'Inter',
    importUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap',
  },
  {
    family: 'Roboto',
    importUrl: 'https://fonts.googleapis.com/css2?family=Roboto:wght@100..900&display=swap',
  },
  {
    family: 'Public Sans',
    importUrl: 'https://fonts.googleapis.com/css2?family=Public+Sans:wght@100..900&display=swap',
  },
  {
    family: 'Geist',
    importUrl: 'https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap',
  },
  {
    family: 'Manrope',
    importUrl: 'https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&display=swap',
  },
  {
    family: 'Atkinson Hyperlegible Next',
    importUrl: 'https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible+Next:wght@400;500;600;700&display=swap',
  },
  {
    family: 'Geist Mono',
    importUrl: 'https://fonts.googleapis.com/css2?family=Geist+Mono:wght@100..900&display=swap',
  },
  {
    family: 'JetBrains Mono',
    importUrl: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@100..800&display=swap',
  },
  {
    family: 'Atkinson Hyperlegible Mono',
    importUrl: 'https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible+Mono:wght@400;500;600;700&display=swap',
  },
];

/**
 * Lookup map keyed by CSS font-family name → Google Fonts import URL.
 * Used by aura-theme-editor's export CSS logic to emit @import rules.
 */
export const FONT_FAMILY_IMPORTS = Object.fromEntries(AURA_GOOGLE_FONTS.map((font) => [font.family, font.importUrl]));
