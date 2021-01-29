describe('vaadin-details', () => {
  const locator = '#tests[data-ready]';

  ['lumo', 'material'].forEach((theme) => {
    it(`${theme}-default`, function () {
      return this.browser
        .url(`details.html?theme=${theme}`)
        .waitForVisible(locator, 10000)
        .assertView(`${theme}-default`, locator)
        .execute(() => {
          document.documentElement.setAttribute('dir', 'rtl');
        })
        .assertView(`${theme}-rtl`, locator);
    });
  });

  ['filled', 'reverse', 'small'].forEach((variant) => {
    it(`lumo-${variant}`, function () {
      return this.browser
        .url(`lumo-${variant}.html`)
        .waitForVisible(locator, 10000)
        .assertView(`lumo-${variant}`, locator)
        .execute(() => {
          document.documentElement.setAttribute('dir', 'rtl');
        })
        .assertView(`lumo-${variant}-rtl`, locator);
    });
  });
});
