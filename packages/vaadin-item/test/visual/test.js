describe('vaadin-item', () => {
  const locator = '#tests[data-ready]';

  ['lumo', 'material'].forEach((theme) => {
    ['ltr', 'rtl'].forEach((dir) => {
      it(`${theme}-item-${dir}`, function () {
        return this.browser
          .url(`default.html?theme=${theme}&dir=${dir}`)
          .waitForVisible(locator, 10000)
          .assertView(`${theme}-default-${dir}`, locator)
          .execute(() => {
            const item = window.document.querySelector('vaadin-item');
            item.setAttribute('tabindex', '0');
          })
          .assertView(`${theme}-focusable-${dir}`, locator)
          .execute(() => {
            const item = window.document.querySelector('vaadin-item');
            item.setAttribute('selected', '');
          })
          .assertView(`${theme}-selected-${dir}`, locator);
      });
    });

    it(`${theme}-multi-line`, function () {
      return this.browser
        .url(`multi-line.html?theme=${theme}`)
        .waitForVisible(locator, 10000)
        .assertView(`${theme}-multi-line`, locator);
    });
  });
});
