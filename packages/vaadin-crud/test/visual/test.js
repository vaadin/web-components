describe('vaadin-crud', () => {
  const locator = 'vaadin-crud[data-ready]';

  ['lumo', 'material'].forEach((theme) => {
    it(`${theme}-default`, function () {
      return this.browser
        .url(`default.html?theme=${theme}`)
        .waitForVisible(locator, 15000)
        .assertView(`${theme}-default`, 'body');
    });

    it(`${theme}-editor-bottom`, function () {
      return this.browser
        .url(`editor-bottom.html?theme=${theme}`)
        .waitForVisible(locator, 15000)
        .assertView(`${theme}-editor-bottom`, locator);
    });

    ['ltr', 'rtl'].forEach((dir) => {
      it(`${theme}-aside-${dir}`, function () {
        return this.browser
          .url(`editor-aside.html?theme=${theme}&dir=${dir}`)
          .waitForVisible(locator, 15000)
          .assertView(`${theme}-editor-aside-${dir}`, locator);
      });
    });
  });
});
