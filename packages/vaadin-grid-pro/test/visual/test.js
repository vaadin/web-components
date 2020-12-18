describe('vaadin-grid-pro', () => {
  const locator = '#tests[data-ready]';

  ['lumo', 'material'].forEach((theme) => {
    it(`${theme}-edit-column-checkbox`, function () {
      return this.browser
        .url(`edit-column-checkbox.html?theme=${theme}`)
        .waitForVisible(locator, 15000)
        .assertView(`${theme}-edit-column-checkbox`, locator);
    });

    it(`${theme}-edit-column-select`, function () {
      return this.browser
        .url(`edit-column-select.html?theme=${theme}`)
        .waitForVisible(locator, 15000)
        .assertView(`${theme}-edit-column-select`, locator);
    });

    it(`${theme}-edit-column-text`, function () {
      return this.browser
        .url(`edit-column-text.html?theme=${theme}`)
        .waitForVisible(locator, 15000)
        .assertView(`${theme}-edit-column-text`, locator);
    });
  });
});
