describe('vaadin-chart', () => {
  const locator = 'vaadin-chart[data-ready]';

  it('default', function () {
    // prettier-ignore
    return this.browser
      .url('default.html')
      .waitForVisible(locator, 10000)
      .assertView('default', locator);
  });
});
