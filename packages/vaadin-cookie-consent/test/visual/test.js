describe('vaadin-cookie-consent', () => {
  const locator = '.cc-window';

  it('default', function () {
    // prettier-ignore
    return this.browser
      .url('default.html')
      .waitForVisible(locator, 10000)
      .assertView('default', locator);
  });
});
