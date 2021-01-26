describe('vaadin-dialog', () => {
  const locator = 'body[data-ready]';

  ['lumo', 'material'].forEach((theme) => {
    it(`${theme}-default`, function () {
      return this.browser
        .url(`default.html?theme=${theme}`)
        .waitForVisible(locator, 15000)
        .assertView(`${theme}-default`, locator);
    });

    it(`${theme}-no-padding`, function () {
      return this.browser
        .url(`no-padding.html?theme=${theme}`)
        .waitForVisible(locator, 15000)
        .assertView(`${theme}-no-padding`, locator);
    });
  });
});
