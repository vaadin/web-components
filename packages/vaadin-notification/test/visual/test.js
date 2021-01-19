describe('vaadin-notification', () => {
  const locator = 'body[data-ready]';

  ['lumo', 'material'].forEach((theme) => {
    it(`${theme}-default`, function () {
      return this.browser
        .url(`default.html?theme=${theme}`)
        .waitForVisible(locator, 15000)
        .assertView(`${theme}-default`, locator);
    });
  });

  it('lumo-theme', function () {
    // prettier-ignore
    return this.browser
      .url('theme.html?')
      .waitForVisible(locator, 15000)
      .assertView('lumo-theme', locator);
  });
});
