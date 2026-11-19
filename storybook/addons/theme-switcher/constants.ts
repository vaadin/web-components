export const ADDON_ID = 'vaadin/theme-switcher';
export const THEME_TOOL_ID = `${ADDON_ID}/theme`;
export const COLOR_SCHEME_TOOL_ID = `${ADDON_ID}/color-scheme`;

export const THEME_GLOBAL = 'vaadinTheme';
export const COLOR_SCHEME_GLOBAL = 'vaadinColorScheme';

export type Theme = 'aura' | 'base' | 'lumo';
export type ColorScheme = 'dark' | 'light';

export const THEMES: Array<{ value: Theme; title: string }> = [
  { value: 'base', title: 'Base styles' },
  { value: 'lumo', title: 'Lumo' },
  { value: 'aura', title: 'Aura' },
];

export const DEFAULT_THEME: Theme = 'base';
export const DEFAULT_COLOR_SCHEME: ColorScheme = 'light';
