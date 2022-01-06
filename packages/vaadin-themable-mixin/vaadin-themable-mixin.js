/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css, CSSResult, unsafeCSS } from 'lit';
import { ThemePropertyMixin } from './vaadin-theme-property-mixin.js';

export { css, unsafeCSS };

/**
 * @typedef {Object} Theme
 * @property {string} themeFor
 * @property {CSSResult[]} styles
 * @property {string | string[]} [include]
 * @property {string} [moduleId]
 *
 * @typedef {CSSResult[] | CSSResult} CSSResultGroup
 */

/**
 * @type {Theme[]}
 */
const themeRegistry = [];

/**
 * Registers CSS styles for a component type. Make sure to register the styles before
 * the first instance of a component of the type is attached to DOM.
 *
 * @param {string} themeFor The local/tag name of the component type to register the styles for
 * @param {CSSResultGroup} styles The CSS style rules to be registered for the component type
 * matching themeFor and included in the local scope of each component instance
 * @param {{moduleId?: string, include?: string | string[]}} options Additional options
 * @return {void}
 */
export function registerStyles(themeFor, styles, options = {}) {
  if (themeFor) {
    if (hasThemes(themeFor)) {
      console.warn(`The custom element definition for "${themeFor}"
      was finalized before a style module was registered.
      Make sure to add component specific style modules before
      importing the corresponding custom element.`);
    }
  }

  styles = flattenStyles(styles);

  if (window.Vaadin && window.Vaadin.styleModules) {
    window.Vaadin.styleModules.registerStyles(themeFor, styles, options);
  } else {
    themeRegistry.push({
      themeFor,
      styles,
      include: options.include,
      moduleId: options.moduleId
    });
  }
}

/**
 * Returns all registered themes. By default the themeRegistry is returned as is.
 * In case the style-modules adapter is imported, the themes are obtained from there instead
 * @returns {Theme[]}
 */
function getAllThemes() {
  if (window.Vaadin && window.Vaadin.styleModules) {
    return window.Vaadin.styleModules.getAllThemes();
  }
  return themeRegistry;
}

/**
 * Returns true if the themeFor string matches the tag name
 * @param {string} themeFor
 * @param {string} tagName
 * @returns {boolean}
 */
function matchesThemeFor(themeFor, tagName) {
  return (themeFor || '').split(' ').some((themeForToken) => {
    return new RegExp('^' + themeForToken.split('*').join('.*') + '$').test(tagName);
  });
}

/**
 * Maps the moduleName to an include priority number which is used for
 * determining the order in which styles are applied.
 * @param {string} moduleName
 * @returns {number}
 */
function getIncludePriority(moduleName = '') {
  let includePriority = 0;
  if (moduleName.indexOf('lumo-') === 0 || moduleName.indexOf('material-') === 0) {
    includePriority = 1;
  } else if (moduleName.indexOf('vaadin-') === 0) {
    includePriority = 2;
  }
  return includePriority;
}

/**
 * Flattens the styles into a single array of styles.
 * @param {CSSResultGroup} styles
 * @param {CSSResult[]} result
 * @returns {CSSResult[]}
 */
function flattenStyles(styles = []) {
  return [styles].flat(Infinity).filter((style) => {
    if (style instanceof CSSResult) {
      return true;
    }
    console.warn('An item in styles is not of type CSSResult. Use `unsafeCSS` or `css`.');
    return false;
  });
}

/**
 * Gets an array of CSSResults matching the include property of the theme.
 * @param {Theme} theme
 * @returns {CSSResult[]}
 */
function getIncludedStyles(theme) {
  const includedStyles = [];
  if (theme.include) {
    [].concat(theme.include).forEach((includeModuleId) => {
      const includedTheme = getAllThemes().find((s) => s.moduleId === includeModuleId);
      if (includedTheme) {
        includedStyles.push(...getIncludedStyles(includedTheme), ...includedTheme.styles);
      } else {
        console.warn(`Included moduleId ${includeModuleId} not found in style registry`);
      }
    }, theme.styles);
  }
  return includedStyles;
}

/**
 * Includes the styles to the template.
 * @param {CSSResult[]} styles
 * @param {HTMLTemplateElement} template
 */
function addStylesToTemplate(styles, template) {
  const styleEl = document.createElement('style');
  styleEl.innerHTML = styles.map((style) => style.cssText).join('\n');
  template.content.appendChild(styleEl);
}

/**
 * Returns an array of themes that should be used for styling a component matching
 * the tag name. The array is sorted by the include order.
 * @param {string} tagName
 * @returns {Theme[]}
 */
function getThemes(tagName) {
  const defaultModuleName = tagName + '-default-theme';

  const themes = getAllThemes()
    // Filter by matching themeFor properties
    .filter((theme) => theme.moduleId !== defaultModuleName && matchesThemeFor(theme.themeFor, tagName))
    .map((theme) => ({
      ...theme,
      // Prepend styles from included themes
      styles: [...getIncludedStyles(theme), ...theme.styles],
      // Map moduleId to includePriority
      includePriority: getIncludePriority(theme.moduleId)
    }))
    // Sort by includePriority
    .sort((themeA, themeB) => themeB.includePriority - themeA.includePriority);

  if (themes.length > 0) {
    return themes;
  }
  // No theme modules found, return the default module if it exists
  return getAllThemes().filter((theme) => theme.moduleId === defaultModuleName);
}

/**
 * Check if the custom element type has themes applied.
 * @param {string} tagName
 * @returns {boolean}
 */
function hasThemes(tagName) {
  const elementClass = customElements.get(tagName);
  return elementClass && Object.prototype.hasOwnProperty.call(elementClass, '__themes');
}

/**
 * @polymerMixin
 * @mixes ThemePropertyMixin
 */
export const ThemableMixin = (superClass) =>
  class VaadinThemableMixin extends ThemePropertyMixin(superClass) {
    /**
     * Covers PolymerElement based component styling
     * @protected
     */
    static finalize() {
      super.finalize();

      const template = this.prototype._template;
      if (!template || hasThemes(this.is)) {
        return;
      }

      addStylesToTemplate(this.getStylesForThis(), template);
    }

    /**
     * Covers LitElement based component styling
     *
     * @protected
     */
    static finalizeStyles(styles) {
      // The "styles" object originates from the "static get styles()" function of
      // a LitElement based component. The theme styles are added after it
      // so that they can override the component styles.
      const themeStyles = this.getStylesForThis();
      return styles ? [styles, ...themeStyles] : themeStyles;
    }

    /**
     * Get styles for the component type
     *
     * @private
     */
    static getStylesForThis() {
      const parent = Object.getPrototypeOf(this.prototype);
      const inheritedThemes = (parent ? parent.constructor.__themes : []) || [];
      this.__themes = [...inheritedThemes, ...getThemes(this.is)];
      const themeStyles = this.__themes.flatMap((theme) => theme.styles);
      // Remove duplicates
      return themeStyles.filter((style, index) => index === themeStyles.lastIndexOf(style));
    }
  };

export { themeRegistry as __themeRegistry };
