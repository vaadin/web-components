import sinon from 'sinon';

/**
 * This is used for overriding the function that registers styles in themable-mixin.test.js suite.
 * By default, the suite uses registerStyles API for registering styles, but here in the
 * adapter tests, we specifically want to use the Polymer <dom-module> element for it instead.
 *
 * Sinon spy is used to make sure the overridden function gets called.
 */
window.createStylesFunction = sinon.spy((moduleId, themeFor, styles) => {
  styles = [].concat(styles);
  const domModule = document.createElement('dom-module');
  domModule.setAttribute('theme-for', themeFor);
  domModule.innerHTML = `
    <template>
      <style>${styles.map((style) => style.cssText).join('\n')}</style>
    </template>
  `;
  domModule.register(moduleId);
});
