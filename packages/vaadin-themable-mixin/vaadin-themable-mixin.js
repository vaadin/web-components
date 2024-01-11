/**
 * @license
 * Copyright (c) 2017 - 2024 Vaadin Ltd.
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

let themableInstances = [];

/**
 * Check if the custom element type has themes applied.
 * @param {Function} elementClass
 * @returns {boolean}
 */
function classHasThemes(elementClass) {
  return elementClass && Object.prototype.hasOwnProperty.call(elementClass, '__themes');
}

/**
 * Check if the custom element type has themes applied.
 * @param {string} tagName
 * @returns {boolean}
 */
function hasThemes(tagName) {
  return classHasThemes(customElements.get(tagName));
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
 * Returns true if the themeFor string matches the tag name
 * @param {string} themeFor
 * @param {string} tagName
 * @returns {boolean}
 */
function matchesThemeFor(themeFor, tagName) {
  return (themeFor || '').split(' ').some((themeForToken) => {
    return new RegExp(`^${themeForToken.split('*').join('.*')}$`, 'u').test(tagName);
  });
}

/**
 * Includes the styles to the template.
 * @param {CSSResult[]} styles
 * @param {HTMLTemplateElement} template
 */
function addStylesToTemplate(styles, template) {
  const styleEl = document.createElement('style');
  styleEl.setAttribute('themable-mixin-style', '');
  styleEl.innerHTML = styles.map((style) => style.cssText).join('\n');
  template.content.appendChild(styleEl);
}

/**
 * Dynamically updates the styles of the given component instance.
 */
function updateInstanceStyles(instance) {
  const componentClass = instance.constructor;

  // Style elements in the shadow root
  // TOOD: Can there be multiple style elements (inheritance)?
  const style = instance.shadowRoot.querySelector('style[themable-mixin-style]');
  if (style) {
    const themeStyles = componentClass.getStylesForThis();
    style.innerHTML = themeStyles.map((s) => s.cssText).join('\n');
  }

  // Adopted stylesheets
  // TODO: This may not be ideal. An element may have 0 styles beforehand.
  if (instance.shadowRoot.adoptedStyleSheets.length) {
    if (!componentClass.__adoptedStyleSheets) {
      componentClass.__adoptedStyleSheets = componentClass.finalizeStyles(componentClass.styles).flatMap((style) => {
        if (style instanceof CSSStyleSheet) {
          return style;
        }
        const styleSheet = new CSSStyleSheet();
        styleSheet.replaceSync(style.cssText);
        return styleSheet;
      });
    }
    instance.shadowRoot.adoptedStyleSheets = componentClass.__adoptedStyleSheets;
  }
}

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
  styles = flattenStyles(styles);

  if (window.Vaadin && window.Vaadin.styleModules) {
    window.Vaadin.styleModules.registerStyles(themeFor, styles, options);
  } else {
    themeRegistry.push({
      themeFor,
      styles,
      include: options.include,
      moduleId: options.moduleId,
    });
  }

  if (themeFor) {
    if (hasThemes(themeFor)) {
      const componentClass = customElements.get(themeFor);
      if (componentClass) {
        // Mark the component class as needing manual style update on instance creation
        componentClass.__needsStyleUpdate = true;
        // Clear the adopted stylesheets cache
        componentClass.__adoptedStyleSheets = null;
      }

      // Clean up the weak references to GC'd instances
      themableInstances = themableInstances.filter((ref) => ref.deref());
      // Iterate over all themable instances and update their styles if needed
      themableInstances.forEach((ref) => {
        const instance = ref.deref();
        if (instance && matchesThemeFor(themeFor, instance.constructor.is)) {
          updateInstanceStyles(instance);
        }
      });

      // Update Polymer-based component's template
      const template = componentClass.prototype._template;
      if (template) {
        // Remove existing styles
        const style = template.content.querySelector('style[themable-mixin-style]');
        if (style) {
          style.remove();
        }
        // Add updated styles
        addStylesToTemplate(componentClass.getStylesForThis(), template);
      }

      console.warn(
        `The custom element definition for "${themeFor}" ` +
          `was finalized before a style module was registered. ` +
          `Make sure to add component specific style modules before ` +
          `importing the corresponding custom element.`,
      );
    }
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
 * Maps the moduleName to an include priority number which is used for
 * determining the order in which styles are applied.
 * @param {string} moduleName
 * @returns {number}
 */
function getIncludePriority(moduleName = '') {
  let includePriority = 0;
  if (moduleName.startsWith('lumo-') || moduleName.startsWith('material-')) {
    includePriority = 1;
  } else if (moduleName.startsWith('vaadin-')) {
    includePriority = 2;
  }
  return includePriority;
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
 * Returns an array of themes that should be used for styling a component matching
 * the tag name. The array is sorted by the include order.
 * @param {string} tagName
 * @returns {Theme[]}
 */
function getThemes(tagName) {
  const defaultModuleName = `${tagName}-default-theme`;

  const themes = getAllThemes()
    // Filter by matching themeFor properties
    .filter((theme) => theme.moduleId !== defaultModuleName && matchesThemeFor(theme.themeFor, tagName))
    .map((theme) => ({
      ...theme,
      // Prepend styles from included themes
      styles: [...getIncludedStyles(theme), ...theme.styles],
      // Map moduleId to includePriority
      includePriority: getIncludePriority(theme.moduleId),
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
 * @polymerMixin
 * @mixes ThemePropertyMixin
 */
export const ThemableMixin = (superClass) =>
  class VaadinThemableMixin extends ThemePropertyMixin(superClass) {
    constructor() {
      super();
      // Store a weak reference to the instance
      themableInstances.push(new WeakRef(this));
    }

    /** @protected */
    firstUpdated() {
      super.firstUpdated();
      if (this.constructor.__needsStyleUpdate) {
        // If new themes have been registered after the component definition was finalized,
        // update the styles of the component instances.
        updateInstanceStyles(this);
      }
    }

    /**
     * Covers PolymerElement based component styling
     * @protected
     */
    static finalize() {
      super.finalize();

      // Make sure not to run the logic intended for PolymerElement when LitElement is used.
      if (this.elementStyles) {
        return;
      }

      const template = this.prototype._template;
      if (!template || classHasThemes(this)) {
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
      return styles ? [...super.finalizeStyles(styles), ...themeStyles] : themeStyles;
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
