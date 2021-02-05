describe('vaadin-ordered-layout', () => {
  const locator = '#tests[data-ready]';

  ['lumo', 'material'].forEach((theme) => {
    it(`${theme}-horizontal-layout`, function () {
      return this.browser
        .url(`horizontal-layout.html?theme=${theme}`)
        .waitForVisible(locator, 10000)
        .assertView(`${theme}-horizontal-layout`, locator)
        .execute(() => {
          document.documentElement.setAttribute('dir', 'rtl');
        })
        .assertView(`${theme}-horizontal-layout-rtl`, locator);
    });

    it(`${theme}-vertical-layout`, function () {
      return this.browser
        .url(`vertical-layout.html?theme=${theme}`)
        .waitForVisible(locator, 10000)
        .assertView(`${theme}-vertical-layout`, locator)
        .execute(() => {
          document.documentElement.setAttribute('dir', 'rtl');
        })
        .assertView(`${theme}-vertical-layout-rtl`, locator);
    });
  });
});
