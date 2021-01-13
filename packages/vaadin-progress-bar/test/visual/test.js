describe('vaadin-progress-bar', () => {
  const locator = '#tests[data-ready]';

  ['lumo', 'material'].forEach((theme) => {
    it(`${theme}-progress-bar`, function () {
      return this.browser
        .url(`default.html?theme=${theme}`)
        .waitForVisible(locator, 15000)
        .assertView(`${theme}-progress-bar-ltr`, locator)
        .execute(() => {
          window.document.documentElement.setAttribute('dir', 'rtl');
        })
        .assertView(`${theme}-progress-bar-rtl`, locator);
    });
  });
});
