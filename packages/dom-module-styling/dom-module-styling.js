import { DomModule } from '@polymer/polymer/lib/elements/dom-module.js';
import { stylesFromTemplate } from '@polymer/polymer/lib/utils/style-gather.js';
import { unsafeCSS } from 'lit';

window.Vaadin = window.Vaadin || {};
window.Vaadin.domModuleStyling = {};

function getModuleStyles(module) {
  return stylesFromTemplate(module.querySelector('template')).map((styleElement) => {
    return unsafeCSS(styleElement.textContent);
  });
}

let moduleIdIndex = 0;
// Map of <CSSResult, Polymer.DomModule> pairs.
const styleMap = {};

window.Vaadin.domModuleStyling.registerStyles = (themeFor, styles = [], options) => {
  const themeId = (options && options.moduleId) || `custom-style-module-${moduleIdIndex++}`;

  const processedStyles = styles.map((cssResult) => {
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

  const moduleIncludes = [].concat((options && options.include) || []);

  themeModuleElement.innerHTML = `
    <template>
      ${moduleIncludes.map((include) => `<style include=${include}></style>`)}
      ${processedStyles.length ? `<style>${processedStyles.join('\n')}</style>` : ''}
    </template>
  `;

  themeModuleElement.register(themeId);
};

window.Vaadin.domModuleStyling.getAllThemes = () => {
  const domModule = DomModule;
  const modules = domModule.prototype.modules;

  return Object.keys(modules).map((moduleName) => {
    const module = modules[moduleName];
    module.__styles = module.__styles || getModuleStyles(module);

    return {
      themeFor: module.getAttribute('theme-for'),
      moduleId: moduleName,
      styles: module.__styles
    };
  });
};
