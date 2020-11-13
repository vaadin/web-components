describe('vaadin-custom-field', () => {
  const locator = '#custom-field-tests[data-ready]';

  ['lumo', 'material'].forEach((theme) => {
    it(`${theme}-default`, function () {
      return this.browser
        .url(`default.html?theme=${theme}`)
        .waitForVisible(locator, 10000)
        .assertView(`${theme}-default`, locator);
    });

    it(`${theme}-focused`, function () {
      return this.browser
        .url(`default.html?theme=${theme}&focus=true`)
        .waitForVisible(locator, 10000)
        .assertView(`${theme}-focused`, locator);
    });

    it(`${theme}-disabled`, function () {
      return this.browser
        .url(`disabled.html?theme=${theme}`)
        .waitForVisible(locator, 10000)
        .assertView(`${theme}-disabled`, locator);
    });

    it(`${theme}-readonly`, function () {
      return this.browser
        .url(`readonly.html?theme=${theme}`)
        .waitForVisible(locator, 10000)
        .assertView(`${theme}-readonly`, locator);
    });

    it(`${theme}-alignment`, function () {
      return this.browser
        .url(`alignment.html?theme=${theme}`)
        .waitForVisible(locator, 10000)
        .assertView(`${theme}-alignment`, locator);
    });

    it(`${theme}-width`, function () {
      return this.browser
        .url(`width.html?theme=${theme}`)
        .waitForVisible(locator, 10000)
        .assertView(`${theme}-width`, locator);
    });

    it(`${theme}-form-layout`, function () {
      return this.browser
        .url(`form-layout.html?theme=${theme}`)
        .waitForVisible(locator, 10000)
        .assertView(`${theme}-form-layout`, locator);
    });

    it(`${theme}-helper-text`, function () {
      return this.browser
        .url(`helper-text.html?theme=${theme}`)
        .waitForVisible(locator, 10000)
        .assertView(`${theme}-helper-text`, locator);
    });
  });

  it('lumo-small', function () {
    return this.browser.url('lumo.html').waitForVisible(locator, 10000).assertView('lumo-small', locator);
  });
});
