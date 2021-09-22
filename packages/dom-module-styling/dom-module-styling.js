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

window.Vaadin.domModuleStyling.registerStyles = (themeFor, styles = [], options = {}) => {
  const themeId = options.moduleId || `custom-style-module-${moduleIdIndex++}`;

  const themeModuleElement = document.createElement('dom-module');

  if (themeFor) {
    themeModuleElement.setAttribute('theme-for', themeFor);
  }

  const moduleIncludes = [].concat(options.include || []);
  if (moduleIncludes.length === 0) {
    // No includes so the styles array can be cached as is
    themeModuleElement.__styles = styles;
  }

  themeModuleElement.innerHTML = `
    <template>
      ${moduleIncludes.map((include) => `<style include=${include}></style>`)}
      ${styles.length ? `<style>${styles.map((style) => style.cssText).join('\n')}</style>` : ''}
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
