describe('vaadin-rich-text-editor', () => {
  const locator = '#tests[data-ready]';

  ['lumo', 'material'].forEach((theme) => {
    ['ltr', 'rtl'].forEach((dir) => {
      it(`${theme}-default-${dir}`, function () {
        return this.browser
          .url(`default.html?theme=${theme}&dir=${dir}`)
          .waitForVisible(locator, 30000)
          .assertView(`${theme}-default-${dir}`, locator);
      });
    });

    ['min-height', 'max-height', 'disabled', 'readonly'].forEach((state) => {
      it(`${theme}-${state}`, function () {
        return this.browser
          .url(`${state}.html?theme=${theme}`)
          .waitForVisible(locator, 30000)
          .assertView(`${theme}-${state}`, locator);
      });
    });
  });
});
