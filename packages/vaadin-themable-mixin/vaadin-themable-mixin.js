import { CSSResult, css, unsafeCSS } from 'lit';
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
 * @param {String} themeFor The local/tag name of the component type to register the styles for
 * @param {CSSResultGroup} styles The CSS style rules to be registered for the component type
 * matching themeFor and included in the local scope of each component instance
 * @param {Object=} options Additional options
 * @return {void}
 */
export function registerStyles(themeFor, styles, options = {}) {
  if (themeFor) {
    const elementClass = customElements.get(themeFor);
    if (elementClass && Object.prototype.hasOwnProperty.call(elementClass, '__finalized')) {
      console.warn(`The custom element definition for "${themeFor}"
      was finalized before a style module was registered.
      Make sure to add component specific style modules before
      importing the corresponding custom element.`);
    }
  }

  styles = recursiveFlattenStyles(styles);

  if (window.Vaadin && window.Vaadin.domModuleStyling) {
    window.Vaadin.domModuleStyling.registerStyles(themeFor, styles, options);
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
 * Returns all registered themes. By default the themes are obtained from the themeRegistry.
 * In case vaadin-dom-module-styling adapter is imported, the themes are obtained from there instead
 * @returns {Theme[]}
 */
function getAllThemes() {
  if (window.Vaadin && window.Vaadin.domModuleStyling) {
    if (themeRegistry.length > 0) {
      console.warn(`Seems that styles have been registered before the
<dom-module> styling adapter was imported.
Make sure to import the adapter before registering any styles.`);
    }

    return window.Vaadin.domModuleStyling.getAllThemes();
  } else {
    return themeRegistry;
  }
}

/**
 * Returns true if the themeFor applies to the given tag name
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
 * Maps the given moduleName to an include priority number that is used for
 * determining the order in which styles are added.
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
 * Flattens the given styles into a single array of styles.
 * @param {CSSResultGroup} styles
 * @param {CSSResult[]} result
 * @returns {CSSResult[]}
 */
function recursiveFlattenStyles(styles, result = []) {
  if (styles instanceof CSSResult) {
    result.push(styles);
  } else if (Array.isArray(styles)) {
    styles.forEach((style) => recursiveFlattenStyles(style, result));
  } else {
    console.warn('An item in styles is not of type CSSResult. Use `unsafeCSS` or `css`.');
  }
  return result;
}

/**
 * Gets an array of CSSResults matching the include property of the given theme
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
 * Includes the given styles to the template.
 * @param {CSSResult[]} styles
 * @param {HTMLTemplateElement} template
 */
function addStylesToTemplate(styles, template) {
  const styleEl = document.createElement('style');
  styleEl.innerHTML = styles
    // Remove duplicates so that the last occurrence remains
    .filter((style, index) => index === styles.lastIndexOf(style))
    .map((style) => style.cssText)
    .join('\n');
  template.content.appendChild(styleEl);
}

/**
 * Returns an array of themes that should be used for styling a component matching
 * the given tagName. The array is sorted by the include order.
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
  } else {
    // No theme modules found, return the default module if it exists
    return getAllThemes().filter((theme) => theme.moduleId === defaultModuleName);
  }
}

/**
 * @polymerMixin
 * @mixes ThemePropertyMixin
 */
export const ThemableMixin = (superClass) =>
  class VaadinThemableMixin extends ThemePropertyMixin(superClass) {
    /**
     * Covers PolymerElement based compoenent styling
     * @protected
     */
    static finalize() {
      super.finalize();

      const template = this.prototype._template;
      if (!template || template.__themes) {
        return;
      }

      const inheritedTemplate = Object.getPrototypeOf(this.prototype)._template;
      const inheritedThemes = (inheritedTemplate ? inheritedTemplate.__themes : []) || [];

      template.__themes = [...inheritedThemes, ...getThemes(this.is)];

      // Get flattened styles array
      const styles = template.__themes.reduce((styles, theme) => [...styles, ...theme.styles], []);
      addStylesToTemplate(styles, template);
    }

    /**
     * Covers LitElement based component styling
     * @protected
     */
    static finalizeStyles(styles) {
      return (
        getThemes(this.is)
          // Get flattened styles array
          .reduce((styles, theme) => [...styles, ...theme.styles], [])
          .concat(styles)
      );
    }
  };
