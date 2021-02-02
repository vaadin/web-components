describe('vaadin-accordion', () => {
  const locator = '#tests[data-ready]';

  ['lumo', 'material'].forEach((theme) => {
    it(`${theme}-default`, function () {
      return this.browser
        .url(`accordion.html?theme=${theme}`)
        .waitForVisible(locator, 10000)
        .assertView(`${theme}-default`, locator);
    });

    it(`${theme}-theme`, function () {
      return this.browser
        .url(`${theme}-theme.html`)
        .waitForVisible(locator, 10000)
        .assertView(`${theme}-theme`, locator);
    });
  });
});
