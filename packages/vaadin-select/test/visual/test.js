describe('vaadin-select', () => {
  const locator = '#select-tests[data-ready]';

  ['lumo', 'material'].forEach((theme) => {
    it(`${theme}-default`, function () {
      return this.browser
        .url(`select.html?theme=${theme}`)
        .waitForVisible(locator, 10000)
        .assertView(`${theme}-default`, locator);
    });

    it(`${theme}-rtl`, function () {
      return this.browser
        .url(`rtl.html?theme=${theme}`)
        .waitForVisible(locator, 10000)
        .assertView(`${theme}-rtl`, locator);
    });
  });

  ['ltr', 'rtl'].forEach((dir) => {
    it(`${dir}-align`, function () {
      return this.browser
        .url(`align-themes.html?dir=${dir}`)
        .waitForVisible(locator, 10000)
        .assertView(`${dir}-align`, locator);
    });
  });

  it('lumo-variants', function () {
    return this.browser.url(`lumo.html`).waitForVisible(locator, 10000).assertView('lumo-variants', locator);
  });
});
