describe('vaadin-upload', () => {
  const locator = '#upload-tests[data-ready]';

  ['lumo', 'material'].forEach((theme) => {
    it(`${theme}-default`, function () {
      return this.browser
        .url(`upload.html?theme=${theme}`)
        .waitForVisible(locator, 10000)
        .assertView(`${theme}-default`, locator);
    });
  });
});
