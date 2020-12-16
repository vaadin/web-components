describe('vaadin-menu-bar', () => {
  const locator = '#tests[data-ready]';

  ['lumo', 'material'].forEach((theme) => {
    it(`${theme}-default`, function () {
      return this.browser
        .url(`default.html?theme=${theme}`)
        .waitForVisible(locator, 15000)
        .assertView(`${theme}-default`, locator);
    });

    it(`${theme}-focused`, function () {
      return this.browser
        .url(`focused.html?theme=${theme}`)
        .waitForVisible(locator, 15000)
        .assertView(`${theme}-focused`, locator);
    });

    it(`${theme}-icons`, function () {
      return this.browser
        .url(`icons.html?theme=${theme}`)
        .waitForVisible(locator, 15000)
        .assertView(`${theme}-icons`, locator);
    });

    if (theme === 'material') {
      ['outlined', 'contained', 'text'].forEach((variant) => {
        it(`${theme}-${variant}`, function () {
          return this.browser
            .url(`theme.html?theme=${theme}&variant=${variant}`)
            .waitForVisible(locator, 15000)
            .assertView(`${theme}-${variant}`, locator);
        });

        it(`${theme}-${variant}-rtl`, function () {
          return this.browser
            .url(`rtl.html?theme=${theme}&variant=${variant}`)
            .waitForVisible(locator, 15000)
            .assertView(`${theme}-${variant}-rtl`, locator);
        });
      });
    }

    if (theme === 'lumo') {
      ['primary', 'secondary', 'tertiary', 'tertiary-inline', 'small'].forEach((variant) => {
        it(`${theme}-${variant}`, function () {
          return this.browser
            .url(`theme.html?theme=${theme}&variant=${variant}`)
            .waitForVisible(locator, 15000)
            .assertView(`${theme}-${variant}`, locator);
        });

        it(`${theme}-${variant}-rtl`, function () {
          return this.browser
            .url(`rtl.html?theme=${theme}&variant=${variant}`)
            .waitForVisible(locator, 15000)
            .assertView(`${theme}-${variant}-rtl`, locator);
        });
      });
    }
  });
});
