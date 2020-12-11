describe('vaadin-tabs', () => {
  const locator = '#tabs-tests[data-ready]';

  ['lumo', 'material'].forEach((theme) => {
    it(`${theme}-horizontal-tabs`, function () {
      return this.browser
        .url(`horizontal-tabs.html?theme=${theme}`)
        .waitForVisible(locator, 15000)
        .assertView(`${theme}-horizontal-tabs`, locator);
    });

    it(`${theme}-vertical-tabs`, function () {
      return this.browser
        .url(`vertical-tabs.html?theme=${theme}`)
        .waitForVisible(locator, 15000)
        .assertView(`${theme}-vertical-tabs`, locator);
    });

    ['ltr', 'rtl'].forEach((dir) => {
      it(`${theme}-scrollable-tabs-${dir}`, function () {
        return this.browser
          .url(`scrollable-tabs.html?theme=${theme}&dir=${dir}`)
          .waitForVisible(locator, 15000)
          .assertView(`${theme}-scrollable-tabs-${dir}`, locator);
      });

      it(`${theme}-anchor-tabs-${dir}`, function () {
        return this.browser
          .url(`anchor-tabs.html?theme=${theme}&dir=${dir}`)
          .waitForVisible(locator, 15000)
          .assertView(`${theme}-anchor-tabs-${dir}`, locator);
      });
    });
  });
});
