import { CSSResult } from 'lit';
export { css, unsafeCSS } from 'lit';
import { themes } from './vaadin-themable-mixin.js';
import './vaadin-template-styling.js';

function recursiveFlattenStyles(styles, result = []) {
  if (styles instanceof CSSResult) {
    result.push(styles);
  } else if (Array.isArray(styles)) {
    styles.forEach((style) => recursiveFlattenStyles(style, result));
  }
  return result;
}

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
export const registerStyles = (themeFor, styles, options) => {
  styles = recursiveFlattenStyles(styles);

  if (themeFor) {
    const elementClass = customElements.get(themeFor);
    if (elementClass && Object.prototype.hasOwnProperty.call(elementClass, '__finalized')) {
      console.warn(`The custom element definition for "${themeFor}"
      was finalized before a style module was registered.
      Make sure to add component specific style modules before
      importing the corresponding custom element.`);
    }
  }

  if (options && (options.include || options.moduleId)) {
    // Handle the deprecated "include" and "moduleId" options using the dom-module-based approach.
    handleDeprecatedTemplateStyles(themeFor, styles, options);
    return;
  }

  styles.forEach((style) => {
    themes.push({
      includePriority: (options && options.includePriority) || 0,
      themeFor,
      style
    });
  });
};

const handleDeprecatedTemplateStyles = (themeFor, styles, options) => {
  if (options && options.include && !options.suppressDeprecationWarning) {
    console.warn(
      `The "include" option in registerStyles is deprecated. Instead, include an imported CSSResult in the styles array.`
    );
  }

  if (window.Vaadin && window.Vaadin.registerTemplateStyles) {
    // Fallback to the deprecated Polymer dom-module-based approach.
    window.Vaadin.registerTemplateStyles(themeFor, styles, options);
  } else {
    console.warn(`In order to continue using the deprecated "include" or "moduleId" options,
please import the required adapter '@vaadin/vaadin-template-styling' `);
  }
};
