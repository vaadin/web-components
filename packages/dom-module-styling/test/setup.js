import sinon from 'sinon';

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
