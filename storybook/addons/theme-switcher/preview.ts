import type { Decorator, Preview } from '@storybook/web-components-vite';
import auraStyles from '@vaadin/aura/aura.css?inline';
import lumoStyles from '@vaadin/vaadin-lumo-styles/lumo.css?inline';
import {
  COLOR_SCHEME_GLOBAL,
  type ColorScheme,
  DEFAULT_COLOR_SCHEME,
  DEFAULT_THEME,
  type Theme,
  THEME_GLOBAL,
} from './constants.js';

const STYLES: Partial<Record<Theme, string>> = { aura: auraStyles, lumo: lumoStyles };

const STYLE_ID = 'vaadin-theme-switcher';

/**
 * Puts the theme CSS into a single `<style>` element at the start of `<head>`,
 * so styles of the story still win. Removing the element brings back base styles.
 */
function applyTheme(theme: Theme, colorScheme: ColorScheme) {
  const css = STYLES[theme];
  let style = document.getElementById(STYLE_ID);

  if (!css) {
    style?.remove();
  } else {
    if (!style) {
      style = document.createElement('style');
      style.id = STYLE_ID;
      document.head.prepend(style);
    }
    if (style.dataset.theme !== theme) {
      style.dataset.theme = theme;
      style.textContent = css;
    }
  }

  // Lumo uses the `theme` attribute, Aura and base styles use `color-scheme`
  const root = document.documentElement;
  root.style.colorScheme = colorScheme;
  if (colorScheme === 'dark') {
    root.setAttribute('theme', 'dark');
  } else {
    root.removeAttribute('theme');
  }
}

const withVaadinTheme: Decorator = (storyFn, { globals, viewMode }) => {
  // The docs page and its story canvases stay light, so dark components would be unreadable there
  const colorScheme = viewMode === 'docs' ? 'light' : (globals[COLOR_SCHEME_GLOBAL] ?? DEFAULT_COLOR_SCHEME);
  applyTheme(globals[THEME_GLOBAL] ?? DEFAULT_THEME, colorScheme);
  return storyFn();
};

export default {
  decorators: [withVaadinTheme],
  initialGlobals: {
    [THEME_GLOBAL]: DEFAULT_THEME,
    [COLOR_SCHEME_GLOBAL]: DEFAULT_COLOR_SCHEME,
  },
} satisfies Preview;
