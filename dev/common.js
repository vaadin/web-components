import { css } from 'lit';
import { addGlobalStyles } from '@vaadin/component-base/src/styles/add-global-styles.js';

addGlobalStyles(
  'dev-common',
  css`
    :where(body) {
      font-family: system-ui, sans-serif;
      line-height: 1.25;
      margin: 2rem;
    }

    .heading {
      font-weight: 600;
      font-size: calc(18 / 16 * 1rem);
      line-height: calc(20 / 16 * 1rem);
      margin: 2em 0 1.25em;
      text-box: cap alphabetic;
    }

    .section {
      display: flex;
      flex-wrap: wrap;
      gap: 1lh 1.5lh;
      margin: 2lh 0;
      align-items: baseline;
    }

    .section > :is(.heading, p) {
      width: 100%;
      margin: 0;
    }
  `,
);

// Theme Switcher Styles
addGlobalStyles(
  'theme-switcher-styles',
  css`
    #theme-switcher {
      position: fixed;
      top: 10px;
      right: 10px;
      z-index: 1000;
      display: flex;
      gap: 4px;
      padding: 4px;
      background: rgba(255, 255, 255, 0.95);
      border: 1px solid #ddd;
      border-radius: 4px;
      font-family: system-ui, sans-serif;
      font-size: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(10px);
    }

    #theme-switcher button {
      padding: 6px 12px;
      border: 1px solid #ddd;
      border-radius: 3px;
      background: white;
      color: #333;
      cursor: pointer;
      font-size: 12px;
      font-weight: 500;
      transition: all 0.15s ease;
      min-width: 50px;
    }

    #theme-switcher button:hover {
      background: #f5f5f5;
      border-color: #ccc;
    }

    #theme-switcher button.active {
      background: #0078d4;
      color: white;
      border-color: #0078d4;
    }

    #theme-switcher button:focus-visible {
      outline: 2px solid #0078d4;
      outline-offset: 2px;
    }

    @media (prefers-color-scheme: dark) {
      #theme-switcher {
        background: rgba(40, 40, 40, 0.95);
        border-color: #555;
      }
      #theme-switcher button {
        background: #2a2a2a;
        color: #fff;
        border-color: #555;
      }
      #theme-switcher button:hover {
        background: #3a3a3a;
        border-color: #666;
      }
      #theme-switcher button.active {
        background: #0078d4;
        color: white;
        border-color: #0078d4;
      }
    }
  `,
);

// Theme Configuration
const THEMES = {
  base: { label: 'Base', cssPath: null },
  lumo: { label: 'Lumo', cssPath: '/packages/vaadin-lumo-styles/lumo.css' },
  aura: { label: 'Aura', cssPath: '/packages/aura/aura.css' },
};

const DEFAULT_THEME = 'base';
const THEME_ATTR = 'data-theme';

/**
 * Update UI to reflect active theme
 * @param {string} activeTheme - Currently active theme
 */
function updateThemeSwitcherUI(activeTheme) {
  const switcher = document.getElementById('theme-switcher');
  if (!switcher) return;

  switcher.querySelectorAll('button').forEach((button) => {
    const isActive = button.dataset.theme === activeTheme;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
}

/**
 * Load theme by adding/removing CSS link elements
 * @param {string} themeName - Name of theme to load (base, lumo, or aura)
 */
function loadTheme(themeName) {
  if (!THEMES[themeName]) {
    console.warn(`Unknown theme: ${themeName}, falling back to ${DEFAULT_THEME}`);
    themeName = DEFAULT_THEME;
  }

  // Remove all existing theme links
  document.querySelectorAll(`link[${THEME_ATTR}]`).forEach((link) => link.remove());

  // Add new theme link if not base
  const theme = THEMES[themeName];
  if (theme.cssPath) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = theme.cssPath;
    link.setAttribute(THEME_ATTR, themeName);
    document.head.appendChild(link);
  }

  // Update UI
  updateThemeSwitcherUI(themeName);
}

/**
 * Change theme (update URL + load)
 * @param {string} themeName - Name of theme to switch to
 */
function changeTheme(themeName) {
  const url = new URL(window.location);
  if (themeName === DEFAULT_THEME) {
    url.searchParams.delete('theme');
  } else {
    url.searchParams.set('theme', themeName);
  }
  history.replaceState(null, '', url);
  loadTheme(themeName);
}

/**
 * Get current theme from URL parameter or default to base
 * @returns {string} Current theme name
 */
function getCurrentTheme() {
  const urlParams = new URLSearchParams(window.location.search);
  const urlTheme = urlParams.get('theme');
  if (urlTheme && THEMES[urlTheme]) {
    return urlTheme;
  }

  return DEFAULT_THEME;
}

/**
 * Create theme switcher UI
 */
function initThemeSwitcher() {
  const switcher = document.createElement('div');
  switcher.id = 'theme-switcher';
  switcher.setAttribute('role', 'toolbar');
  switcher.setAttribute('aria-label', 'Theme switcher');

  Object.entries(THEMES).forEach(([key, config]) => {
    const button = document.createElement('button');
    button.textContent = config.label;
    button.dataset.theme = key;
    button.setAttribute('aria-label', `Switch to ${config.label} theme`);
    button.addEventListener('click', () => changeTheme(key));
    switcher.appendChild(button);
  });

  document.body.appendChild(switcher);

  // Update UI to reflect current theme
  updateThemeSwitcherUI(getCurrentTheme());
}

// Handle browser back/forward
window.addEventListener('popstate', () => {
  loadTheme(getCurrentTheme());
});

// Initialize theme support
(function initThemeSupport() {
  const currentTheme = getCurrentTheme();
  loadTheme(currentTheme);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThemeSwitcher);
  } else {
    initThemeSwitcher();
  }
})();
