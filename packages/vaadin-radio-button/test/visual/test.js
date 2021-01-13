describe('vaadin-radio-button', () => {
  const locator = '#tests[data-ready]';

  ['lumo', 'material'].forEach((theme) => {
    it(`${theme}-default`, function () {
      return this.browser
        .url(`default.html?theme=${theme}`)
        .waitForVisible(locator, 15000)
        .assertView(`${theme}-default`, locator);
    });

    it(`${theme}-default-rtl`, function () {
      return this.browser
        .url(`default-rtl.html?theme=${theme}`)
        .waitForVisible(locator, 15000)
        .assertView(`${theme}-default-rtl`, locator);
    });

    it(`${theme}-helper`, function () {
      return this.browser
        .url(`helper.html?theme=${theme}`)
        .waitForVisible(locator, 15000)
        .assertView(`${theme}-helper`, locator)
        .execute(() => {
          window.document.documentElement.setAttribute('dir', 'rtl');
        })
        .assertView(`${theme}-helper-rtl`, locator);
    });

    it(`${theme}-wrapping`, function () {
      return this.browser
        .url(`wrapping.html?theme=${theme}`)
        .waitForVisible(locator, 15000)
        .assertView(`${theme}-wrapping`, locator);
    });
  });
});
