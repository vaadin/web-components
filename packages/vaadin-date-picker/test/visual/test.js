describe('vaadin-date-picker', () => {
  const locator = '#date-picker-tests[data-ready]';

  ['lumo', 'material'].forEach((theme) => {
    it(`${theme}-default`, function () {
      return this.browser
        .url(`default.html?theme=${theme}`)
        .waitForVisible(locator, 15000)
        .assertView(`${theme}-default`, locator);
    });

    it(`${theme}-rtl`, function () {
      return this.browser
        .url(`default.html?theme=${theme}&dir=rtl`)
        .waitForVisible(locator, 15000)
        .assertView(`${theme}-rtl`, locator);
    });

    it(`${theme}-dropdown`, function () {
      return this.browser
        .url(`dropdown.html?theme=${theme}`)
        .waitForVisible(locator, 15000)
        .assertView(`${theme}-dropdown`, locator);
    });

    it(`${theme}-date-limit`, function () {
      return this.browser
        .url(`date-limit.html?theme=${theme}`)
        .waitForVisible(locator, 15000)
        .assertView(`${theme}-date-limit`, locator);
    });

    it(`${theme}-value`, function () {
      return this.browser
        .url(`value.html?theme=${theme}`)
        .waitForVisible(locator, 15000)
        .assertView(`${theme}-value`, locator);
    });

    it(`${theme}-week-numbers`, function () {
      return this.browser
        .url(`week-numbers.html?theme=${theme}`)
        .waitForVisible(locator, 15000)
        .assertView(`${theme}-week-numbers`, locator);
    });
  });
});
