describe('vaadin-button', () => {
  const locator = '#tests[data-ready]';

  ['lumo', 'material'].forEach((theme) => {
    it(`${theme}-default`, function () {
      return this.browser
        .url(`default.html?theme=${theme}`)
        .waitForVisible(locator, 15000)
        .assertView(`${theme}-default`, locator);
    });

    it(`${theme}-colors`, function () {
      return this.browser
        .url(`colors-${theme}.html`)
        .waitForVisible(locator, 15000)
        .assertView(`${theme}-colors`, locator);
    });

    it(`${theme}-rtl`, function () {
      return this.browser
        .url(`rtl.html?theme=${theme}`)
        .waitForVisible(locator, 15000)
        .assertView(`${theme}-rtl`, locator);
    });

    it(`${theme}-width`, function () {
      return this.browser
        .url(`width.html?theme=${theme}`)
        .waitForVisible(locator, 15000)
        .assertView(`${theme}-width`, locator);
    });
  });

  it('lumo-sizing', function () {
    // prettier-ignore
    return this.browser
      .url('sizing.html')
      .waitForVisible(locator, 15000)
      .assertView('lumo-sizing', locator);
  });

  it('lumo-types', function () {
    // prettier-ignore
    return this.browser
      .url('types.html')
      .waitForVisible(locator, 15000)
      .assertView('lumo-types', locator);
  });
});
