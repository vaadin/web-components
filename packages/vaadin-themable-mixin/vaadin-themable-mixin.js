import { ThemePropertyMixin } from './vaadin-theme-property-mixin.js';
import './vaadin-template-styling.js';

/**
 * {
 *  includePriority: number,
 *  themeFor: string,
 *  style: string,
 *  styleAttributes: object // Used only by the lagacy theming system (<style include="some-style">)
 * }[]
 **/
export const themes = [];

/**
 * @polymerMixin
 * @mixes ThemePropertyMixin
 */
export const ThemableMixin = (superClass) =>
  class VaadinThemableMixin extends ThemePropertyMixin(superClass) {
    /** @protected */
    static finalize() {
      super.finalize();

      const template = this.prototype._template;
      if (!template) {
        return;
      }

      const inheritedTemplate = Object.getPrototypeOf(this.prototype)._template;
      if (inheritedTemplate) {
        inheritedTemplate.__includedThemes = inheritedTemplate.__includedThemes || [];
        Array.from(inheritedTemplate.__includedThemes).forEach((theme) => {
          this._includeStyle(theme, template);
        });
      }

      this._includeMatchingThemes(template);
    }

    /** @private */
    static _includeMatchingThemes(template) {
      // Get styles defined with the deprecated `<dom-module>` based theming system
      let legacyThemes = [];
      if (window.Vaadin && window.Vaadin.getTemplateStyles) {
        legacyThemes = window.Vaadin.getTemplateStyles();
      }

      [...themes, ...legacyThemes]
        .sort((styleA, styleB) => styleB.includePriority - styleA.includePriority)
        .forEach((style) => {
          const themeFor = style.themeFor;
          if (themeFor) {
            themeFor.split(' ').forEach((themeForToken) => {
              if (new RegExp('^' + themeForToken.split('*').join('.*') + '$').test(this.is)) {
                this._includeStyle(style, template);
              }
            });
          }
        });
    }

    /** @private */
    static _includeStyle(theme, template) {
      template.__includedThemes = template.__includedThemes || [];
      if (template && !template.__includedThemes.includes(theme)) {
        const styleEl = document.createElement('style');
        styleEl.innerHTML = theme.style.toString();
        if (theme.styleAttributes) {
          Object.keys(theme.styleAttributes).forEach((attribute) => {
            styleEl.setAttribute(attribute, theme.styleAttributes[attribute]);
          });
        }
        template.content.appendChild(styleEl);
        template.__includedThemes.push(theme);
      }
    }
  };
