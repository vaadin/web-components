import { DomModule } from '@polymer/polymer/lib/elements/dom-module.js';
import { stylesFromTemplate } from '@polymer/polymer/lib/utils/style-gather.js';
import { CSSResult } from 'lit';

/**
 * Backwards compatibility adapter for the deprecated dom-module -based theming mechanism.
 * Should be moved to a separate package. Naming TBD.
 * Consider:
 * - not importing the adapter automatically (like vaadin-template-renderer, as it brings in the Polymer dependency)
 * - chaging vaadin component styles to use "option.includePriority" instead of the deprecated "option.moduleId"
 */

let moduleIdIndex = 0;
// Map of <CSSResult, Polymer.DomModule> pairs.
const styleMap = {};

const registerTemplateStyles = (themeFor, styles, options) => {
  const themeId = (options && options.moduleId) || `custom-style-module-${moduleIdIndex++}`;

  const processedStyles = styles.map((cssResult) => {
    if (!(cssResult instanceof CSSResult)) {
      // TODO: This should be in registerStyles
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

const getTemplateStyles = () => {
  const domModule = DomModule;
  const modules = domModule.prototype.modules;

  return (
    Object.keys(modules)
      // TODO: Decide what to do with the default themes
      .filter((moduleName) => !moduleName.endsWith('-default-theme'))
      .map((moduleName) => {
        const module = modules[moduleName];

        let includePriority = 0;
        if (moduleName.indexOf('lumo-') === 0 || moduleName.indexOf('material-') === 0) {
          includePriority = 1;
        } else if (moduleName.indexOf('vaadin-') === 0) {
          includePriority = 2;
        }

        return {
          themeFor: module.getAttribute('theme-for'),
          includePriority,
          style: '',
          styleAttributes: {
            include: moduleName
          }
        };
      })
  );
};

window.Vaadin = window.Vaadin || {};
window.Vaadin.registerTemplateStyles = registerTemplateStyles;
window.Vaadin.getTemplateStyles = getTemplateStyles;
