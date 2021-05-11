import '@polymer/polymer/lib/elements/dom-module.js';
import { CSSResult } from 'lit';
import { stylesFromTemplate } from '@polymer/polymer/lib/utils/style-gather.js';
export { css, unsafeCSS } from 'lit';

let moduleIdIndex = 0;
// Map of <CSSResult, Polymer.DomModule> pairs.
const styleMap = {};

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
  const themeId = (options && options.moduleId) || `custom-style-module-${moduleIdIndex++}`;

  if (!Array.isArray(styles)) {
    styles = styles ? [styles] : [];
  }

  const processedStyles = styles.map((cssResult) => {
    if (!(cssResult instanceof CSSResult)) {
      throw new Error('An item in styles is not of type CSSResult. Use `unsafeCSS` or `css`.');
    }
    if (!styleMap[cssResult]) {
      const template = document.createElement('template');
      template.innerHTML = `<style>${cssResult.toString()}</style>`;

      styleMap[cssResult] = stylesFromTemplate(template)[0];
    }

    return styleMap[cssResult].textContent;
  });

  const themeModuleElement = document.createElement('dom-module');
  if (themeFor) {
    const elementClass = customElements.get(themeFor);
    if (elementClass && Object.prototype.hasOwnProperty.call(elementClass, '__finalized')) {
      console.warn(`The custom element definition for "${themeFor}"
      was finalized before a style module was registered.
      Make sure to add component specific style modules before
      importing the corresponding custom element.`);
    }
    themeModuleElement.setAttribute('theme-for', themeFor);
  }

  const moduleIncludes = (options && options.include) || [];

  themeModuleElement.innerHTML = `
    <template>
      ${moduleIncludes.map((include) => `<style include=${include}></style>`)}
      ${processedStyles.length ? `<style>${processedStyles.join('\n')}</style>` : ''}
    </template>
  `;

  themeModuleElement.register(themeId);
};
