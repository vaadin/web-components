describe('vaadin-time-picker', () => {
  const locator = '#time-picker-tests[data-ready]';

  ['lumo', 'material'].forEach((theme) => {
    it(`${theme}-default`, function () {
      return this.browser
        .url(`default.html?theme=${theme}`)
        .waitForVisible(locator, 10000)
        .assertView(`${theme}-default`, locator);
    });

    it(`${theme}-rtl`, function () {
      return this.browser
        .url(`default.html?theme=${theme}&dir=rtl`)
        .waitForVisible(locator, 10000)
        .assertView(`${theme}-rtl`, locator);
    });

    it(`${theme}-dropdown`, function () {
      return this.browser
        .url(`dropdown.html?theme=${theme}`)
        .waitForVisible(locator, 10000)
        .assertView(`${theme}-dropdown`, locator);
    });

    it(`${theme}-dropdown-rtl`, function () {
      return this.browser
        .url(`dropdown.html?theme=${theme}&dir=rtl`)
        .waitForVisible(locator, 10000)
        .assertView(`${theme}-dropdown-rtl`, locator);
    });

    it(`${theme}-step`, function () {
      return this.browser
        .url(`step.html?theme=${theme}`)
        .waitForVisible(locator, 10000)
        .assertView(`${theme}-step`, locator);
    });

    it(`${theme}-value`, function () {
      return this.browser
        .url(`value.html?theme=${theme}`)
        .waitForVisible(locator, 10000)
        .assertView(`${theme}-value`, locator);
    });
  });
});
