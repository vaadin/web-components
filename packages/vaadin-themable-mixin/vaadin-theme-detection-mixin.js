import { findRoot } from './lumo-injection-mixin.js';
import { ThemeDetector } from './src/theme-detector.js';

/**
 * Mixin for detecting which Vaadin theme is applied to the application.
 * Automatically adds a `vaadin-theme` attribute to the host element
 * with the name of the detected theme (`lumo` or `aura`), which can be
 * used in component styles to apply theme-specific styling.
 */
export const ThemeDetectionMixin = (superClass) =>
  class VaadinThemeDetectionMixin extends superClass {
    constructor() {
      super();

      this.__applyDetectedTheme = this.__applyDetectedTheme.bind(this);
    }

    connectedCallback() {
      super.connectedCallback();

      if (this.isConnected) {
        const root = findRoot(this);
        root.__themeDetector = root.__themeDetector || new ThemeDetector(root);
        this.__themeDetector = root.__themeDetector;
        this.__themeDetector.addEventListener('theme-changed', this.__applyDetectedTheme);
        this.__applyDetectedTheme();
      }
    }

    disconnectedCallback() {
      super.disconnectedCallback();

      if (this.__themeDetector) {
        this.__themeDetector.removeEventListener('theme-changed', this.__applyDetectedTheme);
        this.__themeDetector = null;
      }
    }

    __applyDetectedTheme() {
      if (!this.__themeDetector) {
        return;
      }

      const themes = this.__themeDetector.themes;
      if (themes.aura) {
        this.dataset.applicationTheme = 'aura';
      } else if (themes.lumo) {
        this.dataset.applicationTheme = 'lumo';
      } else {
        delete this.dataset.applicationTheme;
      }
    }
  };
