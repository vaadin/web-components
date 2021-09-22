import { DomModule } from '@polymer/polymer/lib/elements/dom-module.js';
import { stylesFromTemplate } from '@polymer/polymer/lib/utils/style-gather.js';
import { unsafeCSS } from 'lit';

window.Vaadin = window.Vaadin || {};
window.Vaadin.domModuleStyling = {};

let moduleIdIndex = 0;

window.Vaadin.domModuleStyling.registerStyles = (themeFor, styles = [], options = {}) => {
  const themeId = options.moduleId || `custom-style-module-${moduleIdIndex++}`;

  const module = document.createElement('dom-module');

  if (themeFor) {
    module.setAttribute('theme-for', themeFor);
  }

  // The styles array only needs to be included in the template in case options.moduleId is used,
  // so that it's possible to include the styles by moduleId in some other <dom-module>
  // using <style include="module-id">
  const includeStylesToTemplate = styles.length && options.moduleId;

  // options.include may be undefined, string or an array of strings. Convert it to an array
  const moduleIncludes = [].concat(options.include || []);
  if (moduleIncludes.length === 0) {
    // No includes are used so the styles array is considered complete and can be cached as is
    module.__allStyles = styles;
  } else if (!includeStylesToTemplate) {
    // Includes are used so the styles array can be cached,
    // but the included styles must be later added on top of it.
    // Don't cache anything in case the styles will get included in the
    // <dom-module> template anyways to avoid duplicate styles.
    module.__partialStyles = styles;
  }

  module.innerHTML = `
    <template>
      ${moduleIncludes.map((include) => `<style include=${include}></style>`)}
      ${includeStylesToTemplate ? `<style>${styles.map((style) => style.cssText).join('\n')}</style>` : ''}
    </template>
  `;

  module.register(themeId);
};

function getModuleStyles(module) {
  return stylesFromTemplate(module.querySelector('template')).map((styleElement) => {
    return unsafeCSS(styleElement.textContent);
  });
}

window.Vaadin.domModuleStyling.getAllThemes = () => {
  const domModule = DomModule;
  const modules = domModule.prototype.modules;

  return Object.keys(modules).map((moduleName) => {
    const module = modules[moduleName];
    module.__allStyles = module.__allStyles || getModuleStyles(module).concat(module.__partialStyles || []);

    return {
      themeFor: module.getAttribute('theme-for'),
      moduleId: moduleName,
      styles: module.__allStyles
    };
  });
};
