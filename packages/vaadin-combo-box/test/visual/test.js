describe('vaadin-combo-box', () => {
  const locator = '#combo-box-tests[data-ready]';

  ['lumo', 'material'].forEach((theme) => {
    it(`${theme}-default`, function () {
      return this.browser
        .url(`default.html?theme=${theme}`)
        .waitForVisible(locator, 10000)
        .assertView(`${theme}-default`, locator);
    });

    it(`${theme}-rtl`, function () {
      return this.browser
        .url(`default-rtl.html?theme=${theme}`)
        .waitForVisible(locator, 10000)
        .assertView(`${theme}-rtl`, locator);
    });

    it(`${theme}-clear-button`, function () {
      return this.browser
        .url(`clear-button.html?theme=${theme}`)
        .waitForVisible(locator, 10000)
        .assertView(`${theme}-clear-button`, locator);
    });

    ['ltr', 'rtl'].forEach((dir) => {
      it(`${theme}-dropdown-${dir}`, function () {
        return this.browser
          .url(`dropdown.html?theme=${theme}&dir=${dir}`)
          .waitForVisible(locator, 10000)
          .assertView(`${theme}-dropdown-${dir}`, locator);
      });

      it(`${theme}-template-${dir}`, function () {
        return this.browser
          .url(`template.html?theme=${theme}&dir=${dir}`)
          .waitForVisible(locator, 10000)
          .assertView(`${theme}-template-${dir}`, locator);
      });
    });
  });
});
