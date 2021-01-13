describe('vaadin-split-layout', () => {
  const locator = 'vaadin-split-layout[data-ready]';

  ['lumo', 'material'].forEach((theme) => {
    it(`${theme}-default`, function () {
      return this.browser
        .url(`default.html?theme=${theme}`)
        .waitForVisible(locator, 15000)
        .assertView(`${theme}-default`, locator);
    });

    it(`${theme}-customized`, function () {
      return this.browser
        .url(`customized.html?theme=${theme}`)
        .waitForVisible(locator, 15000)
        .assertView(`${theme}-customized`, locator);
    });
  });
});
